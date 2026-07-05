import type { AuthState } from '../../types';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback, useState } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });
  const [simulatedRole, setSimulatedRole] = useState<string | null>(() => localStorage.getItem('simulated_role'));

  const updateSimulatedRole = useCallback((role: string | null) => {
    if (role) {
      localStorage.setItem('simulated_role', role);
    } else {
      localStorage.removeItem('simulated_role');
    }
    setSimulatedRole(role);
  }, []);

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(JWT_STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me);

        const { user } = res.data;

        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        // Tenta recuperar a sessão usando Cookies HttpOnly
        try {
          const res = await axios.get(endpoints.auth.me);
          const { user } = res.data;
          const token = res.data.accessToken || '';
          if (token) {
            setSession(token);
          }
          setState({ user: { ...user, accessToken: token }, loading: false });
        } catch (e) {
          setState({ user: null, loading: false });
        }
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => {
      const backendRole = state.user?.role;
      const mappedRole = backendRole === 'citizen' ? 'user' : (backendRole ?? 'admin');
      const finalRole = simulatedRole || mappedRole;

      return {
        user: state.user ? { ...state.user, role: finalRole } : null,
        checkUserSession,
        updateSimulatedRole,
        loading: status === 'loading',
        authenticated: status === 'authenticated',
        unauthenticated: status === 'unauthenticated',
      };
    },
    [checkUserSession, updateSimulatedRole, state.user, status, simulatedRole]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
