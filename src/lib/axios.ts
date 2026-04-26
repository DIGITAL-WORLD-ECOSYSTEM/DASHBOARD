import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';
import { CryptoCore } from 'src/utils/crypto';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  // 1. Zero-Trust Signature Header
  const identityKey = sessionStorage.getItem('identityKey');
  const did = sessionStorage.getItem('identityDID');

  if (identityKey && did) {
    const timestamp = Date.now().toString();
    const body = config.data ? JSON.stringify(config.data) : '';
    const msg = CryptoCore.encode(timestamp + body);
    
    // Converte a chave (supondo Hex)
    const privateKeyBytes = Uint8Array.from(
      identityKey.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const signature = await CryptoCore.sign(privateKeyBytes, msg);

    config.headers['X-Identity-Signature'] = CryptoCore.toBase64(signature);
    config.headers['X-Identity-DID'] = did;
    config.headers['X-Identity-Timestamp'] = timestamp;
  }

  // 2. JWT Fallback
  const token = sessionStorage.getItem('accessToken');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    console.error('Axios message:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  platform: {
    email: {
      campaign: '/api/platform/email/campaign',
    },
  },
} as const;
