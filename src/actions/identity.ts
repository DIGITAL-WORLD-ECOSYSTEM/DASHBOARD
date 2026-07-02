import type { IUserItem } from 'src/types/user';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export interface ICitizenItem {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  cargoOsc: string | null;
  did: string | null;
  avatarUrl: string | null;
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  role: 'citizen' | 'partner' | 'admin' | 'system';
  phoneNumber: string | null;
  email: string;
}

// Helper to map DB citizen record to the UI's IUserItem type
export function mapCitizenToUserItem(citizen: ICitizenItem): IUserItem {
  let uiStatus = 'pending';
  if (citizen.kycStatus === 'approved') {
    uiStatus = 'active';
  } else if (citizen.kycStatus === 'rejected') {
    uiStatus = 'rejected';
  } else if (citizen.kycStatus === 'pending') {
    uiStatus = 'pending';
  } else {
    uiStatus = 'pending'; // fallback for 'none'
  }

  return {
    id: String(citizen.id),
    name: `${citizen.firstName || ''} ${citizen.lastName || ''}`.trim() || citizen.username,
    email: citizen.email,
    phoneNumber: citizen.phoneNumber || '',
    company: citizen.cargoOsc || 'ASPPIBRA',
    role: citizen.role,
    status: uiStatus,
    avatarUrl: citizen.avatarUrl || '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
    country: 'BR',
    isVerified: citizen.kycStatus === 'approved',
  };
}

// ----------------------------------------------------------------------

export function useGetCitizens() {
  const url = endpoints.platform.identity.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<{ success: boolean; data: ICitizenItem[] }>(url, fetcher);

  const memoizedValue = useMemo(() => {
    const list = data?.data || [];
    const mapped = list.map(mapCitizenToUserItem);

    return {
      citizens: mapped,
      citizensRaw: list,
      citizensLoading: isLoading,
      citizensError: error,
      citizensValidating: isValidating,
      citizensEmpty: !isLoading && !list.length,
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createCitizen(data: {
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  cargoOsc?: string;
  phoneNumber?: string;
  nacionalidade?: string;
  role?: string;
  kycStatus?: string;
  avatarUrl?: string;
  password?: string;
}) {
  const res = await axiosInstance.post(endpoints.platform.identity.base, data);
  return res.data;
}

// ----------------------------------------------------------------------

export async function updateCitizen(
  id: string | number,
  data: {
    firstName?: string;
    lastName?: string;
    cargoOsc?: string;
    phoneNumber?: string;
    nacionalidade?: string;
    role?: string;
    kycStatus?: string;
    avatarUrl?: string;
  }
) {
  const res = await axiosInstance.patch(`${endpoints.platform.identity.base}/${id}`, data);
  return res.data;
}

// ----------------------------------------------------------------------

export async function deleteCitizen(id: string | number) {
  const res = await axiosInstance.delete(`${endpoints.platform.identity.base}/${id}`);
  return res.data;
}

// ----------------------------------------------------------------------

export async function deleteCitizens(ids: (string | number)[]) {
  const res = await axiosInstance.post(endpoints.platform.identity.bulkDelete, { ids });
  return res.data;
}
