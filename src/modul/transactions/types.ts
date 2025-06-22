export interface Approval {
  level: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverId: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number | string; // penting: bisa string dari API
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  approvals: Approval[];
}
