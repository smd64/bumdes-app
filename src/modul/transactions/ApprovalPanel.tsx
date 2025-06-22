import React from 'react';
import { Approval } from './types';
import { useApproveTransaction } from './useApprovals';
import { Button, Typography, Stack, Alert } from '@mui/material';

interface Props {
  approvals: Approval[];
  userId: number;
  transactionId: number;
}

export function ApprovalPanel({ approvals, userId, transactionId }: Props) {
  const { mutate, isLoading, error } = useApproveTransaction();

  const handleApprove = (level: number) => {
    mutate({ transactionId, level });
  };

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error.message}</Alert>}

      {approvals.map(({ level, status, approverId }) => (
        <div key={level}>
          <Typography>
            Level {level}: {status}
          </Typography>

          {approverId === userId && status === 'PENDING' && (
            <Button variant="outlined" onClick={() => handleApprove(level)} disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Approve'}
            </Button>
          )}
        </div>
      ))}
    </Stack>
  );
}
