import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type Web3SignInParams = {
  address: string;
};

// ----------------------------------------------------------------------

declare global {
  interface Window {
    ethereum?: any;
  }
}

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const token =
      res.data?.accessToken ||
      res.data?.data?.accessToken ||
      res.data?.token ||
      res.data?.data?.token;

    if (!token) {
      throw new Error('Token de acesso não retornado pelo servidor.');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    await axios.post(endpoints.auth.signUp, params);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    try {
      await axios.post('/api/v1/identity/logout');
    } catch (e) {
      console.warn('Backend logout failed, proceeding with local clean:', e);
    }
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

/** **************************************
 * Web3 Sign in (SIWE)
 * *************************************** */
export const signInWithWeb3 = async (address: string): Promise<void> => {
  try {
    // 1. Obter desafio (SIWE) do backend via POST (com fallback para GET)
    let challengeData: any;
    try {
      const challengeRes = await axios.post(endpoints.auth.web3Nonce, { address });
      challengeData = challengeRes.data?.data || challengeRes.data;
    } catch {
      const challengeRes = await axios.get(endpoints.auth.web3Nonce, { params: { address } });
      challengeData = challengeRes.data?.data || challengeRes.data;
    }

    const challengeId = challengeData?.challengeId;
    const messageToSign = challengeData?.message || challengeData?.statement;

    console.log('Web3 Challenge received:', { challengeId, address, hasMessage: !!messageToSign });

    if (!messageToSign) {
      throw new Error('Falha ao obter mensagem de autenticação SIWE do servidor.');
    }

    if (!window.ethereum) {
      throw new Error('MetaMask não encontrada. Por favor, instale a extensão para continuar.');
    }

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [messageToSign, address],
    });

    const verifyRes = await axios.post(endpoints.auth.web3Verify, {
      challengeId,
      address,
      message: messageToSign,
      signature,
    });

    const token =
      verifyRes.data?.accessToken ||
      verifyRes.data?.data?.accessToken ||
      verifyRes.data?.token ||
      verifyRes.data?.data?.token;

    if (!token) {
      throw new Error('Token de acesso não retornado pelo servidor.');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during Web3 sign in:', error);
    throw error;
  }
};
