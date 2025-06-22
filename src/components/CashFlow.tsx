// src/components/CashFlow.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { CashFlow } from '../types/financialTypes';

interface Props {
  data: CashFlow[];
}

const CashFlowComponent: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div>
      <h2>Arus Kas</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default CashFlowComponent;
