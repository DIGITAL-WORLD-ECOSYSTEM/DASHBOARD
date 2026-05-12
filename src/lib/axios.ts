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
  const identityKey = localStorage.getItem('identityKey');
  const did = localStorage.getItem('identityDID');

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
  const token = localStorage.getItem('dao_access_token');
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
    me: '/api/core/identity/me',
    signIn: '/api/core/identity/local/login',
    signUp: '/api/core/identity/local/register',
    web3Nonce: '/api/core/identity/web3/nonce',
    web3Verify: '/api/core/identity/web3/verify',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/posts',
    details: '/api/posts', // O slug será passado via param
    latest: '/api/posts', // Podemos usar o list com filtro ou limite
    search: '/api/posts/search',
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
    treasury: {
      analytics: '/api/platform/treasury/analytics',
    },
  },
} as const;
