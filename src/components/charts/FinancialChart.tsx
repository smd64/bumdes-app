import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface FinancialChartProps {
  cashFlow: Record<string, number>;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ cashFlow }) => {
  // convert object to array untuk chart
  const data = Object.entries(cashFlow).map(([categoryType, amount]) => ({
    categoryType,
    amount,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="categoryType" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
          }
        />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FinancialChart;
