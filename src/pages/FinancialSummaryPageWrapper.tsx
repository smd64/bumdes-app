import React from 'react';
import { useParams } from 'react-router-dom';
import FinancialSummaryPage from './FinancialSummaryPage';

const FinancialSummaryPageWrapper = () => {
  const { id } = useParams();
  const unitUsahaId = parseInt(id || '', 10);

  if (isNaN(unitUsahaId)) {
    return <div className="p-4 text-red-600">ID Unit Usaha tidak valid.</div>;
  }

  return <FinancialSummaryPage unitUsahaId={unitUsahaId} />;
};

export default FinancialSummaryPageWrapper;
