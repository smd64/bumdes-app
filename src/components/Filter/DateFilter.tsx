import React from 'react';

interface DateFilterProps {
  period: string;
  onChange: (newPeriod: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ period, onChange }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>
        Pilih Periode:&nbsp;
        <input type="month" value={period} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
};

export default DateFilter;
