import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccount, updateAccount } from '../api/accounts';
import AccountForm from '../components/Form/AccountForm';

export default function EditAccountPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['account', id], () => getAccount(+id), {
    enabled: !!id,
  });

  const mutation = useMutation((data) => updateAccount(+id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      navigate('/accounts');
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <AccountForm defaultValues={data} onSubmit={mutation.mutate} isLoading={mutation.isLoading} />
  );
}
