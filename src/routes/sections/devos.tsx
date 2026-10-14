import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { DevOSLayout } from 'src/layouts/devos';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// Módulos DevOS
const DashboardPage = lazy(() => import('src/pages/devos/page'));
const DatabasePage = lazy(() => import('src/pages/devos/database-page'));
const NotificationsPage = lazy(() => import('src/pages/devos/notifications-page'));
const DevOSEmailPage = lazy(() => import('src/pages/devos/communication/email-page'));
const DevOSChatPage = lazy(() => import('src/pages/devos/communication/chat-page'));
const DevOSWhatsAppPage = lazy(() => import('src/pages/devos/communication/whatsapp-page'));
const DevOSSmsPage = lazy(() => import('src/pages/devos/communication/sms-page'));
const DevOSSocialPage = lazy(() => import('src/pages/devos/communication/social-page'));
const DevOSSettingsPage = lazy(() => import('src/pages/devos/communication/settings-page'));
const APIsPage = lazy(() => import('src/pages/devos/apis-page'));
const AuditPage = lazy(() => import('src/pages/devos/audit-page'));
const SecurityPage = lazy(() => import('src/pages/devos/security-page'));
const InfrastructurePage = lazy(() => import('src/pages/devos/infrastructure-page'));
const DAOPage = lazy(() => import('src/pages/devos/dao-page'));
const WalletsPage = lazy(() => import('src/pages/devos/wallets-page'));
const LedgerPage = lazy(() => import('src/pages/devos/ledger-page'));
const InvoicesPage = lazy(() => import('src/pages/devos/invoices-page'));
const EcommercePage = lazy(() => import('src/pages/devos/ecommerce-page'));
const AnalyticsPage = lazy(() => import('src/pages/devos/analytics-page'));
const BlogPage = lazy(() => import('src/pages/devos/blog-page'));

const StrategicPage = lazy(() => import('src/pages/devos/founder/strategic-page'));
const OperationsPage = lazy(() => import('src/pages/devos/founder/operations-page'));
const EmergencyPage = lazy(() => import('src/pages/devos/founder/emergency-page'));

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const DevOSLayoutWrapper = () => (
  <DevOSLayout>
    <SuspenseOutlet />
  </DevOSLayout>
);

// ----------------------------------------------------------------------
// Regra Especial de Segurança para Etapa 1.1 (Seção 5):
// - Em ambiente local de desenvolvimento (Vite dev server), renderiza o cockpit diretamente com mock banner.
// - Em build de produção, import.meta.env.DEV é substituído estaticamente por false na compilação,
//   eliminando completamente o branch de dev (dead code elimination) e mantendo AuthGuard e RoleBasedGuard intactos.
// - Nenhum guard global compartilhado é modificado.
// ----------------------------------------------------------------------
const devosElement = import.meta.env.DEV ? (
  <DevOSLayoutWrapper />
) : (
  <AuthGuard>
    <RoleBasedGuard allowedRoles={['dev']} hasContent>
      <DevOSLayoutWrapper />
    </RoleBasedGuard>
  </AuthGuard>
);

export const devosRoutes: RouteObject[] = [
  {
    path: 'dev',
    element: devosElement,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'database', element: <DatabasePage /> },
      {
        path: 'notifications',
        children: [
          { index: true, element: <NotificationsPage /> },
          { path: 'email', element: <DevOSEmailPage /> },
          { path: 'chat', element: <DevOSChatPage /> },
          { path: 'whatsapp', element: <DevOSWhatsAppPage /> },
          { path: 'sms', element: <DevOSSmsPage /> },
          { path: 'social', element: <DevOSSocialPage /> },
          { path: 'settings', element: <DevOSSettingsPage /> },
        ],
      },
      { path: 'apis', element: <APIsPage /> },
      { path: 'audit', element: <AuditPage /> },
      { path: 'security', element: <SecurityPage /> },
      { path: 'infrastructure', element: <InfrastructurePage /> },
      { path: 'dao', element: <DAOPage /> },
      { path: 'wallets', element: <WalletsPage /> },
      { path: 'ledger', element: <LedgerPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'ecommerce', element: <EcommercePage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'blog', element: <BlogPage /> },
      {
        path: 'founder',
        children: [
          { index: true, element: <StrategicPage /> },
          { path: 'strategic', element: <StrategicPage /> },
          { path: 'operations', element: <OperationsPage /> },
          { path: 'emergency', element: <EmergencyPage /> },
        ],
      },
    ],
  },
];
