import { Stack } from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts';
import { CustomerOverview } from '../../models/ViewCustomerModel';

interface DiagramProps {
  customer: CustomerOverview;
}

const DashboardDiagrams: React.FC<DiagramProps> = ({ customer }) => {
  const totalIncome: number =
    customer?.income.base.reduce((sum, inc) => inc.values!.serviceIncome! + sum, 0) || 0;
  const totalExpense: number =
    customer?.expenses.base.reduce((sum, inc) => inc.values!.mapped! + sum, 0) || 0;

  const data = [
    {
      value: totalIncome,
      label: 'Inkomster',
    },
    {
      value: totalExpense,
      label: 'Utgifter',
    },
  ];

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      {customer?.income.base.length && customer?.expenses.base.length && (
        <PieChart
          series={[
            {
              startAngle: -90,
              paddingAngle: 2,
              innerRadius: 40,
              outerRadius: 70,
              data,
            },
          ]}
          margin={{ right: 5, bottom: 10 }}
          width={200}
          height={200}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
              itemMarkHeight: 13,
              itemMarkWidth: 13,
            },
          }}
        />
      )}

      {customer?.income.base && (
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: Array.from(
                { length: customer.income.base.length },
                (_, index) => `Inkomst ${index + 1}`
              ),
            },
          ]}
          series={[{ data: customer.income.base.map((inc) => inc.values?.serviceIncome || 0) }]}
          height={300}
          width={500}
          tooltip={{ trigger: 'item' }}
        />
      )}
    </Stack>
  );
};

export default DashboardDiagrams;
