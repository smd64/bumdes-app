// src/components/GeneralLedger.tsx
import React from 'react';
import { GeneralLedgerEntry } from '../types/financialTypes';

interface Props {
  data: GeneralLedgerEntry[];
}

const GeneralLedgerComponent: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <h2>Buku Besar</h2>
      <ul>
        {data.map((entry) => (
          <li key={entry.date}>
            {entry.date} - {entry.account}: {entry.amount} ({entry.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GeneralLedgerComponent;
