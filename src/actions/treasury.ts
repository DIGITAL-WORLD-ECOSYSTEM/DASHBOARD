import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

export interface ITreasuryAnalytics {
  summary: {
    totalOutflow: number;
    avgTicket: number;
    count: number;
    topRecipient: string;
  };
  monthlyTrend: {
    month: string;
    total: number;
  }[];
  distribution: {
    label: string;
    value: number;
  }[];
  transactions: {
    id: string;
    date: string;
    favored: string;
    value: number;
    institution: string;
    insight: string;
    receipt: boolean;
  }[];
}

export function useGetTreasuryAnalytics() {
  const url = endpoints.platform.treasury.analytics;

  const { data, isLoading, error, isValidating } = useSWR<{ data: ITreasuryAnalytics }>(url, fetcher);

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
