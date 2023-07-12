import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';

import PieIcon from '../../../public/icons/markets/pie-icon.svg';
import TotalBorrowIcon from '../../../public/icons/markets/total-borrow-indicator.svg';
import TotalSupplyIcon from '../../../public/icons/markets/total-supply-indicator.svg';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';

export const MarketsTopPanel = () => {
  const { reserves, loading } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const aggregatedStats = reserves.reduce(
    (acc, reserve) => {
      return {
        totalLiquidity: acc.totalLiquidity.plus(reserve.totalLiquidityUSD),
        totalDebt: acc.totalDebt.plus(reserve.totalDebtUSD),
      };
    },
    {
      totalLiquidity: valueToBigNumber(0),
      totalDebt: valueToBigNumber(0),
    }
  );

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <TopInfoPanel
      titleComponent={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PageTitle
            pageTitle={<Trans>Dashboard</Trans>}
            withMarketSwitcher={true}
            bridge={currentNetworkConfig.bridge}
          />
        </Box>
      }
    >
      <TopInfoPanelItem
        icon={<PieIcon />}
        title={<Trans>Total market size</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={aggregatedStats.totalLiquidity.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      <TopInfoPanelItem
        icon={<TotalSupplyIcon />}
        title={<Trans>Total available</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={aggregatedStats.totalLiquidity.minus(aggregatedStats.totalDebt).toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      <TopInfoPanelItem
        icon={<TotalBorrowIcon />}
        title={<Trans>Total borrows</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={aggregatedStats.totalDebt.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
    </TopInfoPanel>
  );
};
