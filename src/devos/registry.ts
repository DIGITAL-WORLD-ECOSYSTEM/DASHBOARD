// registry.ts
// Fonte Central da Verdade para o DevOS

export type DevModule = {
  id: string;
  title: string;
  path: string;
  icon?: string;
  description?: string;
};

export const DEV_MODULES: DevModule[] = [
  { id: 'dashboard', title: 'Command Center', path: '/dev' },
  { id: 'dao', title: 'Tesouraria', path: '/dev/dao' },
  { id: 'wallets', title: 'Carteiras', path: '/dev/wallets' },
  { id: 'ledger', title: 'Livro-Razão', path: '/dev/ledger' },
  { id: 'invoices', title: 'Faturas', path: '/dev/invoices' },
  { id: 'database', title: 'Database', path: '/dev/database' },
  { id: 'notifications', title: 'Central de Notificações', path: '/dev/notifications' },
  { id: 'security', title: 'Security Center', path: '/dev/security' },
  { id: 'audit', title: 'Audit Explorer', path: '/dev/audit' },
  { id: 'apis', title: 'APIs', path: '/dev/apis' },
  { id: 'infrastructure', title: 'Infrastructure', path: '/dev/infrastructure' },
];

export const FOUNDER_MODULES: DevModule[] = [
  { id: 'founder-strategic', title: 'Strategic', path: '/dev/founder/strategic' },
  { id: 'founder-operations', title: 'Operations', path: '/dev/founder/operations' },
  { id: 'founder-emergency', title: 'Emergency', path: '/dev/founder/emergency' },
];
