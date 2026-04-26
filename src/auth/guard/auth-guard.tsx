import { useState, useEffect } from 'react';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};



export function AuthGuard({ children }: AuthGuardProps) {


  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);



  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    /*
    if (!authenticated) {
      const { method } = CONFIG.auth;

      const signInPath = signInPaths[method];
      const redirectPath = createRedirectPath(signInPath);

      router.replace(redirectPath);

      return;
    }
    */

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
