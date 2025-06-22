import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../api/user';

export function useUserMe() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
