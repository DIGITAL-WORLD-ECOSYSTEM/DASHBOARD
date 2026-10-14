import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AccountLayout } from 'src/sections/account/account-layout';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBankingContaPage = lazy(() => import('src/pages/dashboard/banking/conta'));
const OverviewBankingRedePage = lazy(() => import('src/pages/dashboard/banking/rede'));
const OverviewBankingCartoesPage = lazy(() => import('src/pages/dashboard/banking/cartoes'));
const OverviewBankingReceberPage = lazy(() => import('src/pages/dashboard/banking/receber'));
const OverviewBankingTransferenciasPage = lazy(() => import('src/pages/dashboard/banking/transferencias'));
const OverviewBankingTransacoesPage = lazy(() => import('src/pages/dashboard/banking/transacoes'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const BankingTreasuryPage = lazy(() => import('src/pages/dashboard/banking/treasury'));
const BankingPaymentsPage = lazy(() => import('src/pages/dashboard/banking/payments'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
const AccountBillingPage = lazy(() => import('src/pages/dashboard/user/account/billing'));
const AccountSocialsPage = lazy(() => import('src/pages/dashboard/user/account/socials'));
const AccountNotificationsPage = lazy(
  () => import('src/pages/dashboard/user/account/notifications')
);
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
const AccountTwoFAPage = lazy(() => import('src/pages/dashboard/user/account/2fa'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

const accountLayout = () => (
  <AccountLayout>
    <SuspenseOutlet />
  </AccountLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
      { path: 'chat', element: <ChatPage /> },
      {
        path: 'banking',
        children: [
          { element: <OverviewBankingPage />, index: true },
          { path: 'conta', element: <OverviewBankingContaPage /> },
          { path: 'rede', element: <OverviewBankingRedePage /> },
          { path: 'cartoes', element: <OverviewBankingCartoesPage /> },
          { path: 'receber', element: <OverviewBankingReceberPage /> },
          { path: 'transferencias', element: <OverviewBankingTransferenciasPage /> },
          { path: 'transacoes', element: <OverviewBankingTransacoesPage /> },
          { 
            path: 'treasury', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <BankingTreasuryPage />
              </RoleBasedGuard>
            ) 
          },
          { 
            path: 'payments', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <BankingPaymentsPage />
              </RoleBasedGuard>
            ) 
          },
        ]
      },
      { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'user',
        children: [
          { index: true, element: <UserProfilePage /> },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'new', element: <UserCreatePage /> },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              { path: 'billing', element: <AccountBillingPage /> },
              { path: 'notifications', element: <AccountNotificationsPage /> },
              { path: 'socials', element: <AccountSocialsPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
              { path: '2fa', element: <AccountTwoFAPage /> },
            ],
          },
        ],
      },
      {
        path: 'file-manager',
        children: [
          { index: true, element: <FileManagerPage /> },
          { path: 'image', element: <FileManagerPage /> },
          { path: 'video', element: <FileManagerPage /> },
          { path: 'document', element: <FileManagerPage /> },
        ],
      },
    ],
  },
];
