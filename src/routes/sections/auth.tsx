import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 * *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/jwt/reset-password')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/jwt/update-password')),
  VerifyPage: lazy(() => import('src/pages/auth/jwt/verify')),
};

const OAuth = {
  CallbackPage: lazy(() => import('src/pages/auth/oauth/callback')),
};

const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.SignInPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.SignUpPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'reset-password',
      element: (
        <AuthCenteredLayout>
          <Jwt.ResetPasswordPage />
        </AuthCenteredLayout>
      ),
    },
    {
      path: 'update-password',
      element: (
        <AuthCenteredLayout>
          <Jwt.UpdatePasswordPage />
        </AuthCenteredLayout>
      ),
    },
    {
      path: 'verify',
      element: (
        <AuthCenteredLayout>
          <Jwt.VerifyPage />
        </AuthCenteredLayout>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      authJwt,
      {
        path: 'oauth',
        children: [{ path: 'callback', element: <OAuth.CallbackPage /> }],
      },
    ],
  },
];
