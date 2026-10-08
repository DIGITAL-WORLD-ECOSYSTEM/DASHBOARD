// ----------------------------------------------------------------------
// DevOS Deterministic Mock Data Store (Etapa 1.1 — Read-Only & In-Memory)
// ZERO PRODUCTION SIDE EFFECTS: No D1, No R2, No Blockchain, No Wallet
// ----------------------------------------------------------------------

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
  latencyMs?: number;
  traceId: string;
}

export interface D1Column {
  name: string;
  type: string;
  primaryKey?: boolean;
  notNull?: boolean;
}

export interface D1TableMeta {
  name: string;
  rows: number;
  sizeKB: number;
  columns: D1Column[];
  sampleData: Record<string, any>[];
}

export interface D1Migration {
  id: string;
  name: string;
  appliedAt: string;
  status: 'APPLIED' | 'PENDING';
  checksumSha256: string;
  executionTimeMs: number;
}

export interface SafeAsset {
  symbol: string;
  name: string;
  balance: string;
  valueUsd: number;
  icon: string;
}

export interface SafeSigner {
  address: string;
  label: string;
  role: string;
  status: 'CONFIRMED' | 'PENDING' | 'OFFLINE';
  lastActive: string;
}

export interface SafeProposal {
  id: string;
  title: string;
  type: string;
  targetAddress: string;
  valueEth: string;
  confirmations: number;
  threshold: number;
  status: 'AWAITING_CONFIRMATIONS' | 'READY_FOR_EXECUTION' | 'SIMULATED';
  createdAt: string;
}

export interface MockDevice {
  id: string;
  name: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  ed25519PublicKey: string;
  sessionHash: string;
  os: string;
  arch: string;
  ipAddress: string;
  capabilities: string[];
  enrolledAt: string;
  lastActivity: string;
}

export interface AuditEventItem {
  id: string;
  timestamp: string;
  eventType: string;
  actor: string;
  resource: string;
  result: 'ALLOWED' | 'DENIED' | 'FLAGGED';
  details: string;
  signatureVerified: boolean;
}

// ----------------------------------------------------------------------
// 1. OBSERVABILITY MOCKS
// ----------------------------------------------------------------------

export const MOCK_TELEMETRY = {
  tps: 148.4,
  latencyP50: 16,
  latencyP99: 42,
  activeWorkers: 12,
  totalRequests24h: 1842910,
  bandwidthUsedMB: 84.6,
  bandwidthLimitGB: 10.0,
  errorRatePct: 0.002,
  services: [
    { name: 'Public Gateway API', status: 'OPERATIONAL (MOCK)', latencyMs: 18, region: 'Edge-Global' },
    { name: 'Cloudflare D1 Storage', status: 'READ-ONLY EMULATOR (MOCK)', latencyMs: 8, region: 'Localhost' },
    { name: 'Cloudflare R2 Buckets', status: 'OPERATIONAL (MOCK)', latencyMs: 24, region: 'Local-Emulator' },
    { name: 'EVM RPC Bridge', status: 'MOCK DISCONNECTED', latencyMs: 0, region: 'Offline (Safety Rule)' },
  ],
};

export const MOCK_LOGS: LogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-08 00:15:32.104',
    level: 'INFO',
    service: 'auth-gateway',
    message: 'Ed25519 handshake challenge acknowledged for device=mock-node-alpha',
    latencyMs: 12,
    traceId: 'trc-9f82a1',
  },
  {
    id: 'log-002',
    timestamp: '2026-10-08 00:15:28.450',
    level: 'INFO',
    service: 'd1-session-api',
    message: 'D1 bookmark consistency verification passed. Replica lag: 0ms (In-Memory)',
    latencyMs: 6,
    traceId: 'trc-88b10e',
  },
  {
    id: 'log-003',
    timestamp: '2026-10-08 00:15:15.912',
    level: 'WARN',
    service: 'rate-limiter',
    message: 'Rate limit threshold near 80% on /api/v1/public/proposals from subnet 192.168.0.0/24',
    latencyMs: 22,
    traceId: 'trc-76c2d1',
  },
  {
    id: 'log-004',
    timestamp: '2026-10-08 00:14:59.008',
    level: 'INFO',
    service: 'treasury-policy',
    message: 'Local Safe simulation invocation requested. Operation Policy: SIMULATION_ONLY',
    latencyMs: 14,
    traceId: 'trc-65e4f2',
  },
  {
    id: 'log-005',
    timestamp: '2026-10-08 00:14:41.319',
    level: 'ERROR',
    service: 'evm-guard',
    message: 'Direct RPC attempt blocked by sandbox safety invariant (INV-001)',
    latencyMs: 4,
    traceId: 'trc-54a3b7',
  },
  {
    id: 'log-006',
    timestamp: '2026-10-08 00:14:20.115',
    level: 'INFO',
    service: 'device-registry',
    message: 'Device heartbeat received from mock-node-alpha [status: ACTIVE, aal: AAL2]',
    latencyMs: 9,
    traceId: 'trc-43f2a8',
  },
  {
    id: 'log-007',
    timestamp: '2026-10-08 00:13:58.742',
    level: 'WARN',
    service: 'worker-mesh',
    message: 'Worker edge node mia-02 high CPU spike (72%). Auto-balancing traffic to iad-01',
    latencyMs: 38,
    traceId: 'trc-32b1c4',
  },
  {
    id: 'log-008',
    timestamp: '2026-10-08 00:13:12.805',
    level: 'INFO',
    service: 'audit-stream',
    message: 'Cryptographic hash chain validated up to block #49120. Checksum matches.',
    latencyMs: 15,
    traceId: 'trc-21e0d9',
  },
];

// ----------------------------------------------------------------------
// 2. DATABASE MOCKS (D1 INSPECTION STUDIO)
// ----------------------------------------------------------------------

export const MOCK_D1_METRICS = {
  sizeMB: '14.82',
  limitGB: '10.00',
  reads24h: '1,420,500',
  writes24h: '84,120',
  latencyMs: 4,
  pendingWrites: 0,
  lockedEvents: 0,
  status: 'Healthy (Read-Only Mock)',
  score: 100,
};

export const MOCK_D1_TABLES: D1TableMeta[] = [
  {
    name: 'gov_members',
    rows: 1420,
    sizeKB: 320,
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true, notNull: true },
      { name: 'ed25519_pubkey', type: 'TEXT', notNull: true },
      { name: 'evm_address', type: 'TEXT' },
      { name: 'role', type: 'TEXT', notNull: true },
      { name: 'status', type: 'TEXT', notNull: true },
      { name: 'created_at', type: 'DATETIME', notNull: true },
    ],
    sampleData: [
      { id: 'usr-001', ed25519_pubkey: 'MOCK-ed25519-7f3a9c8b4...', evm_address: '0x8a12...41a0', role: 'CORE_FOUNDER', status: 'ACTIVE', created_at: '2026-01-10 12:00:00' },
      { id: 'usr-002', ed25519_pubkey: 'MOCK-ed25519-9b21c4f81...', evm_address: '0x9b54...12f8', role: 'SECURITY_COUNCIL', status: 'ACTIVE', created_at: '2026-02-14 09:30:00' },
      { id: 'usr-003', ed25519_pubkey: 'MOCK-ed25519-3c81e05a2...', evm_address: '0x3f99...77b1', role: 'OPERATOR', status: 'ACTIVE', created_at: '2026-03-01 15:45:00' },
      { id: 'usr-004', ed25519_pubkey: 'MOCK-ed25519-01c5d9aa4...', evm_address: '0x11cc...88d2', role: 'AUDITOR', status: 'SUSPENDED', created_at: '2026-04-18 18:20:00' },
    ],
  },
  {
    name: 'gov_proposals',
    rows: 48,
    sizeKB: 84,
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true, notNull: true },
      { name: 'title', type: 'TEXT', notNull: true },
      { name: 'proposer_id', type: 'TEXT', notNull: true },
      { name: 'status', type: 'TEXT', notNull: true },
      { name: 'quorum_reached', type: 'INTEGER', notNull: true },
      { name: 'created_at', type: 'DATETIME', notNull: true },
    ],
    sampleData: [
      { id: 'prop-042', title: 'Infra Grant Q4 - Edge Nodes', proposer_id: 'usr-001', status: 'ACTIVE', quorum_reached: 1, created_at: '2026-10-01 10:00:00' },
      { id: 'prop-043', title: 'Treasury Safe Threshold Update', proposer_id: 'usr-002', status: 'VOTING', quorum_reached: 0, created_at: '2026-10-04 14:20:00' },
      { id: 'prop-041', title: 'Bug Bounty Pool Replenishment', proposer_id: 'usr-001', status: 'EXECUTED', quorum_reached: 1, created_at: '2026-09-20 18:00:00' },
    ],
  },
  {
    name: 'w3_ledger',
    rows: 18290,
    sizeKB: 4120,
    columns: [
      { name: 'tx_id', type: 'TEXT', primaryKey: true, notNull: true },
      { name: 'from_address', type: 'TEXT', notNull: true },
      { name: 'to_address', type: 'TEXT', notNull: true },
      { name: 'token_symbol', type: 'TEXT', notNull: true },
      { name: 'amount', type: 'NUMERIC', notNull: true },
      { name: 'timestamp', type: 'DATETIME', notNull: true },
    ],
    sampleData: [
      { tx_id: 'tx-mock-091a', from_address: '0x71c...b97 (Safe)', to_address: '0x4f1...12a', token_symbol: 'USDC', amount: '15000.00', timestamp: '2026-10-06 18:22:01' },
      { tx_id: 'tx-mock-091b', from_address: '0x8a1...41a', to_address: '0x71c...b97 (Safe)', token_symbol: 'ETH', amount: '2.50', timestamp: '2026-10-05 11:14:30' },
      { tx_id: 'tx-mock-091c', from_address: '0x71c...b97 (Safe)', to_address: '0x9b5...12f', token_symbol: 'ASPP', amount: '50000.00', timestamp: '2026-10-03 09:05:12' },
    ],
  },
  {
    name: 'audit_events',
    rows: 94102,
    sizeKB: 10240,
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true, notNull: true },
      { name: 'event_type', type: 'TEXT', notNull: true },
      { name: 'actor_device', type: 'TEXT', notNull: true },
      { name: 'resource', type: 'TEXT', notNull: true },
      { name: 'result', type: 'TEXT', notNull: true },
      { name: 'timestamp', type: 'DATETIME', notNull: true },
    ],
    sampleData: [
      { id: 'aud-99120', event_type: 'DEVICE_CONNECTED', actor_device: 'mock-node-alpha', resource: 'ControlPlane', result: 'ALLOWED', timestamp: '2026-10-08 00:15:32' },
      { id: 'aud-99119', event_type: 'POLICY_CHECK', actor_device: 'mock-node-alpha', resource: 'D1:gov_members', result: 'ALLOWED', timestamp: '2026-10-08 00:15:00' },
      { id: 'aud-99118', event_type: 'TREASURY_SIMULATE', actor_device: 'mock-secops-mac', resource: 'Safe:Prop042', result: 'ALLOWED', timestamp: '2026-10-07 23:40:15' },
    ],
  },
];

export const MOCK_D1_MIGRATIONS: D1Migration[] = [
  {
    id: '0001',
    name: '0001_initial_gov_schema.sql',
    appliedAt: '2026-09-01 10:00:00',
    status: 'APPLIED',
    checksumSha256: 'sha256:7f8a12903bd819a0ce8f12837bc901a8',
    executionTimeMs: 142,
  },
  {
    id: '0002',
    name: '0002_add_ed25519_device_registry.sql',
    appliedAt: '2026-09-15 14:22:10',
    status: 'APPLIED',
    checksumSha256: 'sha256:3c19b0188ef77210aa390291ba77c102',
    executionTimeMs: 88,
  },
  {
    id: '0003',
    name: '0003_safe_multisig_audit_sync.sql',
    appliedAt: '2026-10-01 09:12:45',
    status: 'APPLIED',
    checksumSha256: 'sha256:a4b2771092dc019942ff650198aa774b',
    executionTimeMs: 95,
  },
  {
    id: '0004',
    name: '0004_immutable_audit_log_v2.sql',
    appliedAt: '2026-10-06 18:30:00',
    status: 'APPLIED',
    checksumSha256: 'sha256:d8916c029fa778810e91823abce88120',
    executionTimeMs: 110,
  },
];

// ----------------------------------------------------------------------
// 3. TREASURY MOCKS (SAFE MULTISIG ENGINE)
// ----------------------------------------------------------------------

export const MOCK_SAFE_CONFIG = {
  address: '0x71CB89b6fB1982741E0F44781295D4A27B0192A0',
  network: 'Arbitrum One (Mock Target)',
  threshold: 3,
  totalSigners: 5,
  totalUsdValuation: 4892400.0,
  nonce: 42,
  status: 'Active (Simulation Engine)',
};

export const MOCK_SAFE_ASSETS: SafeAsset[] = [
  { symbol: 'USDC', name: 'USD Coin', balance: '2,500,000.00', valueUsd: 2500000.0, icon: 'cryptocurrency:usdc' },
  { symbol: 'WETH', name: 'Wrapped Ether', balance: '680.50', valueUsd: 1837350.0, icon: 'cryptocurrency:eth' },
  { symbol: 'ASPP', name: 'ASPPIBRA Governance', balance: '500,000.00', valueUsd: 500000.0, icon: 'solar:shield-star-bold' },
  { symbol: 'DAI', name: 'Dai Stablecoin', balance: '55,050.00', valueUsd: 55050.0, icon: 'cryptocurrency:dai' },
];

export const MOCK_SAFE_SIGNERS: SafeSigner[] = [
  { address: '0x8a12F4...41a0', label: 'Founder Safe Signer', role: 'Signer 1 (Core)', status: 'CONFIRMED', lastActive: '2h ago' },
  { address: '0x9b54A1...12f8', label: 'SecOps Multisig Key', role: 'Signer 2 (Security)', status: 'CONFIRMED', lastActive: '5h ago' },
  { address: '0x3f99E0...77b1', label: 'Operations Vault', role: 'Signer 3 (Ops)', status: 'PENDING', lastActive: '1d ago' },
  { address: '0x11cc90...88d2', label: 'Legal Counsel Key', role: 'Signer 4 (Compliance)', status: 'OFFLINE', lastActive: '3d ago' },
  { address: '0x44ee19...99c4', label: 'External Auditor', role: 'Signer 5 (Audit)', status: 'CONFIRMED', lastActive: '6h ago' },
];

export const MOCK_SAFE_PROPOSALS: SafeProposal[] = [
  {
    id: 'PROP-042',
    title: 'Q4 Edge Infrastructure Node Grants',
    type: 'ERC20 Transfer (USDC)',
    targetAddress: '0x4f19C02...12a0',
    valueEth: '25,000 USDC',
    confirmations: 2,
    threshold: 3,
    status: 'AWAITING_CONFIRMATIONS',
    createdAt: '2026-10-06 14:00:00',
  },
  {
    id: 'PROP-043',
    title: 'Cold Storage Vault Liquidity Rebalancing',
    type: 'Contract Interaction',
    targetAddress: '0x10b784...89cd',
    valueEth: '150 WETH',
    confirmations: 3,
    threshold: 3,
    status: 'READY_FOR_EXECUTION',
    createdAt: '2026-10-05 09:30:00',
  },
  {
    id: 'PROP-041',
    title: 'Community Dev Security Audit Retainer',
    type: 'Multi-Asset Batch',
    targetAddress: '0x33e891...fa22',
    valueEth: '10,000 DAI',
    confirmations: 3,
    threshold: 3,
    status: 'SIMULATED',
    createdAt: '2026-09-28 11:15:00',
  },
];

// ----------------------------------------------------------------------
// 4. SECURITY & DEVICE REGISTRY MOCKS
// ----------------------------------------------------------------------

export const MOCK_DEVICES: MockDevice[] = [
  {
    id: 'dev-node-alpha',
    name: 'Workstation Alpha (Primary Control)',
    status: 'ACTIVE',
    ed25519PublicKey: 'MOCK-ed25519-7F3A9C8B4D2E1A009C8B4D2E1A009C8B4D2E1A00',
    sessionHash: 'mock-sess-sha256-a18b76ce882901fabc4912098bc',
    os: 'Linux (Ubuntu 24.04 LTS)',
    arch: 'x86_64',
    ipAddress: '127.0.0.1 (Local Cockpit)',
    capabilities: ['obs:read', 'db:inspect', 'treasury:simulate', 'sec:view'],
    enrolledAt: '2026-09-01 10:00:00',
    lastActivity: 'Active Now',
  },
  {
    id: 'dev-secops-macbook',
    name: 'SecOps M3 Max (Hardware Enclave)',
    status: 'SUSPENDED',
    ed25519PublicKey: 'MOCK-ed25519-9B21C4F81A77E2001A77E2001A77E2001A77E200',
    sessionHash: 'mock-sess-sha256-88fe91024bc661900de7812903a',
    os: 'macOS 15.1 Sequoia',
    arch: 'arm64 (Apple Silicon)',
    ipAddress: '192.168.1.105',
    capabilities: ['obs:read', 'sec:view'],
    enrolledAt: '2026-09-12 14:15:00',
    lastActivity: '4 hours ago (Session Timed Out)',
  },
  {
    id: 'dev-operator-thinkpad',
    name: 'Field Laptop ThinkPad X1',
    status: 'REVOKED',
    ed25519PublicKey: 'MOCK-ed25519-01C5D9AA43108F9943108F9943108F9943108F99',
    sessionHash: 'mock-sess-sha256-e91208941098bca4409182377ff',
    os: 'Linux (Fedora 41)',
    arch: 'x86_64',
    ipAddress: '10.0.0.99',
    capabilities: [],
    enrolledAt: '2026-08-15 09:00:00',
    lastActivity: '3 days ago (Revoked by Policy)',
  },
];

// ----------------------------------------------------------------------
// 5. AUDIT TRAIL MOCKS
// ----------------------------------------------------------------------

export const MOCK_AUDIT_TRAIL: AuditEventItem[] = [
  {
    id: 'evt-1008-01',
    timestamp: '2026-10-08 00:15:32',
    eventType: 'DEVICE_CONNECTED',
    actor: 'device=dev-node-alpha',
    resource: 'ControlPlane:Cockpit',
    result: 'ALLOWED',
    details: 'Handshake completed with local mock identity. AAL Level: 2 (Simulated)',
    signatureVerified: true,
  },
  {
    id: 'evt-1008-02',
    timestamp: '2026-10-08 00:15:00',
    eventType: 'POLICY_CHECK',
    actor: 'device=dev-node-alpha',
    resource: 'Database:gov_members',
    result: 'ALLOWED',
    details: 'Read-only inspection request passed capability policy: db:inspect',
    signatureVerified: true,
  },
  {
    id: 'evt-1008-03',
    timestamp: '2026-10-08 00:14:12',
    eventType: 'TREASURY_SIMULATE',
    actor: 'device=dev-node-alpha',
    resource: 'Safe:PROP-042',
    result: 'ALLOWED',
    details: 'Transaction dry-run executed in-memory. Result: SUCCESS_NO_SIDE_EFFECTS',
    signatureVerified: true,
  },
  {
    id: 'evt-1008-04',
    timestamp: '2026-10-08 00:10:45',
    eventType: 'SESSION_ENROLL',
    actor: 'device=dev-secops-macbook',
    resource: 'Session:mock-sess-88fe',
    result: 'FLAGGED',
    details: 'Session inactivity limit reached (120 min). Device status switched to SUSPENDED',
    signatureVerified: true,
  },
  {
    id: 'evt-1008-05',
    timestamp: '2026-10-07 23:55:00',
    eventType: 'SECURITY_REVOCATION',
    actor: 'device=dev-node-alpha (Admin)',
    resource: 'Device:dev-operator-thinkpad',
    result: 'ALLOWED',
    details: 'Device key revoked per operator policy due to decommissioning. Capabilities cleared.',
    signatureVerified: true,
  },
  {
    id: 'evt-1008-06',
    timestamp: '2026-10-07 22:30:18',
    eventType: 'SCHEMA_INSPECT',
    actor: 'device=dev-node-alpha',
    resource: 'D1:MigrationsTimeline',
    result: 'ALLOWED',
    details: 'Verified SHA-256 integrity of applied migrations 0001-0004.',
    signatureVerified: true,
  },
  {
    id: 'evt-1008-07',
    timestamp: '2026-10-07 21:18:40',
    eventType: 'DIRECT_ACCESS_BLOCKED',
    actor: 'unauthenticated-process',
    resource: 'D1:w3_ledger:WRITE',
    result: 'DENIED',
    details: 'Write access rejected: DevOS cockpit operates in strict READ ONLY mode (INV-001)',
    signatureVerified: false,
  },
];
