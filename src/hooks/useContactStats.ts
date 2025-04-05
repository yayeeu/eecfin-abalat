
import { useQuery } from '@tanstack/react-query';
import { getContactStats, getElderContactStats } from '@/lib/contactStatsService';
import { useAuth } from '@/contexts/AuthContext';

export const useContactStats = () => {
  const { user } = useAuth();
  
  const { data: allStats, isLoading: allLoading, error: allError } = useQuery({
    queryKey: ['contact-stats-all'],
    queryFn: getContactStats
  });

  const { data: myStats, isLoading: myLoading, error: myError } = useQuery({
    queryKey: ['contact-stats-my', user?.id],
    queryFn: () => user?.id ? getElderContactStats(user.id) : Promise.resolve(null),
    enabled: !!user?.id
  });

  return {
    allStats,
    allLoading,
    allError,
    myStats,
    myLoading,
    myError
  };
};
