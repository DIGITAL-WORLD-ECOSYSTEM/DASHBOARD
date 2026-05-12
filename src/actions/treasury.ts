import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export function useGetTreasuryAnalytics() {
  const url = endpoints.platform.treasury.analytics;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      analytics: data?.data || null,
      analyticsLoading: isLoading,
      analyticsError: error,
      analyticsValidating: isValidating,
      analyticsEmpty: !isLoading && !data?.data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
