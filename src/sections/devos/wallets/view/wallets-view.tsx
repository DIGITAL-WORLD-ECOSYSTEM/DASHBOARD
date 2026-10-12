import { useState, useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { WalletBridge, StoredWallet } from 'src/platform/desktop/wallets/wallet-bridge';

import { WalletCreateCard } from '../components/wallet-create-card';
import { WalletSeedModal } from '../components/wallet-seed-modal';
import { WalletDetailModal } from '../components/wallet-detail-modal';
import { DaoWalletsTable } from '../components/dao-wallets-table';
import { ClientWalletsTable } from '../components/client-wallets-table';
import { WalletMonitoringService } from '../services/wallet-monitoring-service';
import { SUPPORTED_NETWORKS } from '../domain/wallet-policy';
import type { DaoWallet, ClientWallet, DerivedPreview, WalletTarget } from '../types/wallet-types';

export function WalletsView() {
  // Tabs: 'dao' ou 'clients'
  const [activeTab, setActiveTab] = useState<WalletTarget>('dao');

  // Filtros
  const [searchFilter, setSearchFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('ALL');

  // Estado do Formulário de Criação
  const [walletTarget, setWalletTarget] = useState<WalletTarget>('dao');
  const [seedWordsCount, setSeedWordsCount] = useState<number>(24);
  const [targetNetwork, setTargetNetwork] = useState<string>('Arbitrum One');
  const [quantity, setQuantity] = useState<number>(1);
  const [baseLabel, setBaseLabel] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientDoc, setClientDoc] = useState<string>('');

  // Carteiras em Memória carregadas do Rust
  const [daoWallets, setDaoWallets] = useState<DaoWallet[]>([]);
  const [clientWallets, setClientWallets] = useState<ClientWallet[]>([]);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);

  // Estado do Cofre
  const [vaultInitialized, setVaultInitialized] = useState<boolean>(true);
  const [initialMasterPassword, setInitialMasterPassword] = useState('');
  const [isInitializingVault, setIsInitializingVault] = useState(false);

  // Geração e Pré-visualização
  const [isGenerating, setIsGenerating] = useState(false);
  const [creationModalOpen, setCreationModalOpen] = useState(false);
  const [creationSessionId, setCreationSessionId] = useState<string | null>(null);
  const [generatedMnemonic, setGeneratedMnemonic] = useState<string[]>([]);
  const [rawMnemonicPhrase, setRawMnemonicPhrase] = useState<string>('');
  const [derivedPreviews, setDerivedPreviews] = useState<DerivedPreview[]>([]);

  // Modal de Detalhes
  const [selectedWallet, setSelectedWallet] = useState<DaoWallet | ClientWallet | null>(null);

  // Monitoramento RPC
  const [loadingAddresses, setLoadingAddresses] = useState<Set<string>>(new Set());
  const [isBatchRefreshing, setIsBatchRefreshing] = useState(false);

  // Feedback do Usuário
  const [feedbackAlert, setFeedbackAlert] = useState<{ severity: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Normaliza registros do Rust para as interfaces locais
  const mapStoredToDao = (w: StoredWallet): DaoWallet => ({
    id: w.id,
    user: w.user,
    label: w.label,
    derivationPath: w.derivation_path,
    network: w.network,
    address: w.address,
    custodyType: w.custody_type,
    keyProvider:
      w.custody_type === 'CUSTODIAL_LOCAL'
        ? 'Rust Native Vault (Argon2id + AES-256-GCM)'
        : 'Watch-Only (Monitoramento sem chave privada)',
    keyReference: w.vault_id || null,
    status: w.status as any,
    kycStatus: w.kyc_status as any,
    balance: '0.00 ETH',
    balanceStatus: 'Confirmed',
    seedWordsCount: w.seed_words_count,
    createdAt: w.created_at,
    vaultId: w.vault_id || null,
  });

  const mapStoredToClient = (w: StoredWallet): ClientWallet => ({
    id: w.id,
    clientName: w.user,
    clientDoc: w.client_doc || 'CPF Em Verificação',
    label: w.label,
    derivationPath: w.derivation_path,
    network: w.network,
    address: w.address,
    custodyType: w.custody_type,
    keyProvider:
      w.custody_type === 'CUSTODIAL_LOCAL'
        ? 'Rust Native Vault (Argon2id + AES-256-GCM)'
        : 'Watch-Only (Monitoramento sem chave privada)',
    keyReference: w.vault_id || null,
    status: w.status as any,
    kycStatus: w.kyc_status as any,
    balance: '0.00 ETH',
    balanceStatus: 'Confirmed',
    seedWordsCount: w.seed_words_count,
    createdAt: w.created_at,
    vaultId: w.vault_id || null,
  });


  // Carrega carteiras do armazenamento local Rust
  const loadStoredWallets = useCallback(async () => {
    setIsLoadingStorage(true);
    try {
      if (WalletBridge.isDesktop()) {
        const status = await WalletBridge.getVaultStatus();
        setVaultInitialized(status.is_initialized);

        const storedList = await WalletBridge.listStoredWallets();
        const daos = storedList.filter((w) => w.target === 'DAO').map(mapStoredToDao);
        const clients = storedList.filter((w) => w.target === 'CLIENT').map(mapStoredToClient);

        setDaoWallets(daos);
        setClientWallets(clients);
      }
    } catch (err: any) {
      console.warn('Falha ao comunicar com Rust Core:', err);
    } finally {
      setIsLoadingStorage(false);
    }
  }, []);

  useEffect(() => {
    loadStoredWallets();
  }, [loadStoredWallets]);

  // Inicializa o cofre caso ainda não tenha sido definido
  const handleInitVault = async () => {
    if (initialMasterPassword.length < 8) {
      setFeedbackAlert({
        severity: 'error',
        message: 'A senha mestre deve conter no mínimo 8 caracteres.',
      });
      return;
    }

    setIsInitializingVault(true);
    try {
      await WalletBridge.initMasterPassword(initialMasterPassword);
      setVaultInitialized(true);
      setInitialMasterPassword('');
      setFeedbackAlert({
        severity: 'success',
        message: 'Cofre do DevOS inicializado com sucesso no disco local (Argon2id + AES-256-GCM)!',
      });
      await loadStoredWallets();
    } catch (err: any) {
      setFeedbackAlert({
        severity: 'error',
        message: err?.message || 'Falha ao inicializar cofre.',
      });
    } finally {
      setIsInitializingVault(false);
    }
  };

  // Disparo de Geração de Carteiras no Rust Core
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await WalletBridge.generateSeedAndPreview({
        wordCount: seedWordsCount,
        target: walletTarget === 'dao' ? 'DAO' : 'CLIENT',
        accountBranch: walletTarget === 'dao' ? 0 : 0,
        count: quantity,
        baseLabel: baseLabel.trim() || (walletTarget === 'dao' ? 'Carteira DAO' : 'Cliente'),
        network: targetNetwork,
      });

      setCreationSessionId(response.session_id);

      // Frase mnemônica permanece retida em Rust por padrão
      if (response.mnemonic) {
        const words = response.mnemonic.split(' ');
        setGeneratedMnemonic(words);
        setRawMnemonicPhrase(response.mnemonic);
      } else {
        setGeneratedMnemonic([]);
        setRawMnemonicPhrase('');
      }

      setDerivedPreviews(
        response.previews.map((p) => ({
          index: p.index,
          derivationPath: p.derivation_path,
          address: p.address,
          label: p.label,
          network: p.network,
        }))
      );
      setCreationModalOpen(true);
    } catch (err: any) {
      setFeedbackAlert({
        severity: 'error',
        message: `Falha ao gerar carteiras no Rust: ${err?.message || 'Erro de entropia'}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Revelação sob demanda explícita da mnemônica armazenada efemeramente no Rust mediante autorização por senha
  const handleRevealMnemonic = async (password: string): Promise<string> => {
    if (!creationSessionId) {
      throw new Error('Nenhuma sessão de criação ativa.');
    }
    const phrase = await WalletBridge.revealPendingMnemonic(creationSessionId, password);
    return phrase;
  };

  // Confirmação e Selagem no Cofre Criptográfico Local
  const handleConfirmAndSaveVault = async (masterPassword: string) => {
    try {
      const allStored = await WalletBridge.confirmAndSaveWallets({
        master_password: masterPassword,
        session_id: creationSessionId || undefined,
        mnemonic: rawMnemonicPhrase || undefined,
        target: walletTarget === 'dao' ? 'DAO' : 'CLIENT',
        network: targetNetwork,
        previews: derivedPreviews.map((p) => ({
          index: p.index,
          derivation_path: p.derivationPath,
          address: p.address,
          label: p.label,
          network: p.network,
        })),
        client_name: walletTarget === 'clients' ? clientName.trim() || undefined : undefined,
        client_doc: walletTarget === 'clients' ? clientDoc.trim() || undefined : undefined,
      });

      const updatedDaos = allStored.filter((w) => w.target === 'DAO').map(mapStoredToDao);
      const updatedClients = allStored.filter((w) => w.target === 'CLIENT').map(mapStoredToClient);

      setDaoWallets(updatedDaos);
      setClientWallets(updatedClients);
      setActiveTab(walletTarget);
      setCreationModalOpen(false);

      // Limpeza imediata do material secreto efêmero da memória WebView e cancelamento de sessão
      setCreationSessionId(null);
      setRawMnemonicPhrase('');
      setGeneratedMnemonic([]);
      setDerivedPreviews([]);

      setFeedbackAlert({
        severity: 'success',
        message: `Sucesso! Lote de carteiras selado com segurança no cofre local e metadados persistidos!`,
      });
    } catch (err: any) {
      throw new Error(err?.message || 'Erro ao persistir carteiras no cofre local.');
    }
  };

  // Limpeza explícita ao fechar o modal de criação sem salvar
  const handleCloseCreationModal = () => {
    if (creationSessionId) {
      WalletBridge.cancelPendingCreation(creationSessionId).catch((err) =>
        console.warn('Falha ao cancelar sessão efêmera:', err)
      );
    }
    setCreationModalOpen(false);
    setCreationSessionId(null);
    setRawMnemonicPhrase('');
    setGeneratedMnemonic([]);
    setDerivedPreviews([]);
  };

  // Consulta de Saldo Real de uma Carteira via RPC
  const handleRefreshBalance = async (wallet: DaoWallet | ClientWallet, tokenSymbol?: string) => {
    const addr = wallet.address.toLowerCase();
    setLoadingAddresses((prev) => new Set(prev).add(addr));

    try {
      const update = await WalletMonitoringService.updateWalletBalance(wallet.address, wallet.network, tokenSymbol);

      if ('user' in wallet) {
        setDaoWallets((prev) =>
          prev.map((w) =>
            w.address.toLowerCase() === addr
              ? {
                  ...w,
                  balance: update.balance,
                  balanceStatus: update.status,
                  nonce: update.transactionCount,
                  selectedToken: update.symbol,
                }
              : w
          )
        );
      } else {
        setClientWallets((prev) =>
          prev.map((w) =>
            w.address.toLowerCase() === addr
              ? {
                  ...w,
                  balance: update.balance,
                  balanceStatus: update.status,
                  nonce: update.transactionCount,
                  selectedToken: update.symbol,
                }
              : w
          )
        );
      }
    } finally {
      setLoadingAddresses((prev) => {
        const next = new Set(prev);
        next.delete(addr);
        return next;
      });
    }
  };

  // Consulta em lote de todas as carteiras da aba ativa
  const handleBatchRefresh = async () => {
    const currentList = activeTab === 'dao' ? daoWallets : clientWallets;
    if (currentList.length === 0) return;

    setIsBatchRefreshing(true);
    const queryItems = currentList.map((w) => ({ address: w.address, network: w.network }));

    try {
      const results = await WalletMonitoringService.updateBatchBalances(queryItems);

      if (activeTab === 'dao') {
        setDaoWallets((prev) =>
          prev.map((w) => {
            const res = results.get(w.address.toLowerCase());
            return res
              ? {
                  ...w,
                  balance: res.balance,
                  balanceStatus: res.status,
                  nonce: res.transactionCount,
                  selectedToken: res.symbol,
                }
              : w;
          })
        );
      } else {
        setClientWallets((prev) =>
          prev.map((w) => {
            const res = results.get(w.address.toLowerCase());
            return res
              ? {
                  ...w,
                  balance: res.balance,
                  balanceStatus: res.status,
                  nonce: res.transactionCount,
                  selectedToken: res.symbol,
                }
              : w;
          })
        );
      }


      setFeedbackAlert({
        severity: 'info',
        message: `Saldos da blockchain atualizados via RPC para ${queryItems.length} carteira(s).`,
      });
    } finally {
      setIsBatchRefreshing(false);
    }
  };

  // Filtros aplicados
  const filteredDaoWallets = useMemo(() => {
    return daoWallets.filter((w) => {
      const matchSearch =
        !searchFilter ||
        w.user.toLowerCase().includes(searchFilter.toLowerCase()) ||
        w.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        w.address.toLowerCase().includes(searchFilter.toLowerCase()) ||
        w.derivationPath.includes(searchFilter);

      const matchNet =
        networkFilter === 'ALL' ||
        w.network === networkFilter ||
        w.network.toLowerCase().includes(networkFilter.toLowerCase());

      return matchSearch && matchNet;
    });
  }, [daoWallets, searchFilter, networkFilter]);

  const filteredClientWallets = useMemo(() => {
    return clientWallets.filter((w) => {
      const matchSearch =
        !searchFilter ||
        w.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        w.clientDoc.toLowerCase().includes(searchFilter.toLowerCase()) ||
        w.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        w.address.toLowerCase().includes(searchFilter.toLowerCase()) ||
        w.derivationPath.includes(searchFilter);

      const matchNet =
        networkFilter === 'ALL' ||
        w.network === networkFilter ||
        w.network.toLowerCase().includes(networkFilter.toLowerCase());

      return matchSearch && matchNet;
    });
  }, [clientWallets, searchFilter, networkFilter]);

  return (
    <Stack spacing={2.5}>
      {/* FEEDBACK ALERT */}
      {feedbackAlert && (
        <Alert severity={feedbackAlert.severity} onClose={() => setFeedbackAlert(null)}>
          {feedbackAlert.message}
        </Alert>
      )}

      {/* BANNER DE INICIALIZAÇÃO DE COFRE (Caso o cofre ainda não tenha senha mestre) */}
      {!vaultInitialized && !isLoadingStorage && (
        <Card
          sx={{
            p: 2.5,
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
            border: (theme) => `1px solid ${theme.palette.warning.main}`,
            borderRadius: 2,
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Iconify icon={'solar:shield-warning-bold' as any} width={24} sx={{ color: 'warning.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Inicialização Necessária do Cofre DevOS
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Defina a senha mestre para selar o cabeçalho criptográfico local (Argon2id + AES-256-GCM). Nenhuma carteira poderá ter material secreto persistido sem uma senha mestre autorizada.
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Nova Senha Mestre (Mínimo 8 caracteres)"
                value={initialMasterPassword}
                onChange={(e) => setInitialMasterPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="warning"
                onClick={handleInitVault}
                disabled={isInitializingVault || initialMasterPassword.length < 8}
                sx={{ textTransform: 'none', fontWeight: 800, minWidth: 140 }}
              >
                {isInitializingVault ? 'Inicializando...' : 'Definir Senha'}
              </Button>
            </Stack>
          </Stack>
        </Card>
      )}

      {/* FORMULÁRIO DE GERAÇÃO E CUSTÓDIA */}
      <WalletCreateCard
        walletTarget={walletTarget}
        setWalletTarget={setWalletTarget}
        seedWordsCount={seedWordsCount}
        setSeedWordsCount={setSeedWordsCount}
        targetNetwork={targetNetwork}
        setTargetNetwork={setTargetNetwork}
        quantity={quantity}
        setQuantity={setQuantity}
        baseLabel={baseLabel}
        setBaseLabel={setBaseLabel}
        clientName={clientName}
        setClientName={setClientName}
        clientDoc={clientDoc}
        setClientDoc={setClientDoc}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* CABEÇALHO DAS ABAS E FILTROS */}
      <Card
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
            spacing={1.5}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              sx={{
                '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', minHeight: 44 },
              }}
            >
              <Tab
                value="dao"
                label={`Carteiras da DAO (${daoWallets.length})`}
                icon={<Iconify icon={'solar:shield-bold' as any} width={18} />}
                iconPosition="start"
              />
              <Tab
                value="clients"
                label={`Carteiras dos Associados (${clientWallets.length})`}
                icon={<Iconify icon={'solar:users-group-two-rounded-bold' as any} width={18} />}
                iconPosition="start"
              />
            </Tabs>

            <Button
              variant="outlined"
              size="small"
              onClick={handleBatchRefresh}
              disabled={isBatchRefreshing || (activeTab === 'dao' ? daoWallets.length === 0 : clientWallets.length === 0)}
              startIcon={
                isBatchRefreshing ? (
                  <CircularProgress size={14} />
                ) : (
                  <Iconify icon={'solar:refresh-circle-bold' as any} />
                )
              }
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              {isBatchRefreshing ? 'Consultando RPC...' : 'Atualizar Todos os Saldos'}
            </Button>
          </Stack>

          {/* BARRA DE PESQUISA E FILTRO DE REDE */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar por endereço, titular, rótulo ou caminho de derivação..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'solar:magnifer-bold' as any} width={18} sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              size="small"
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="ALL">Todas as Redes</MenuItem>
              {SUPPORTED_NETWORKS.map((net) => (
                <MenuItem key={net.id} value={net.name}>
                  {net.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Card>

      {/* TABELAS DE CARTEIRAS */}
      {isLoadingStorage ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress size={28} sx={{ mb: 1.5 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Carregando registros de custódia do banco de dados local...
          </Typography>
        </Card>
      ) : activeTab === 'dao' ? (
        <DaoWalletsTable
          wallets={filteredDaoWallets}
          onSelectWallet={setSelectedWallet}
          onRefreshBalance={handleRefreshBalance}
          loadingAddresses={loadingAddresses}
        />
      ) : (
        <ClientWalletsTable
          wallets={filteredClientWallets}
          onSelectWallet={setSelectedWallet}
          onRefreshBalance={handleRefreshBalance}
          loadingAddresses={loadingAddresses}
        />
      )}

      {/* MODAL DE SEMENTE E CONFIRMAÇÃO DE COFRE */}
      <WalletSeedModal
        open={creationModalOpen}
        onClose={handleCloseCreationModal}
        mnemonicWords={generatedMnemonic}
        sessionId={creationSessionId || undefined}
        onRevealMnemonic={handleRevealMnemonic}
        derivedPreviews={derivedPreviews}
        onConfirmAndSave={handleConfirmAndSaveVault}
        target={walletTarget}
      />

      {/* MODAL DE DETALHES E AUDITORIA AUTORIZADA */}
      <WalletDetailModal
        open={Boolean(selectedWallet)}
        onClose={() => setSelectedWallet(null)}
        wallet={selectedWallet}
      />
    </Stack>
  );
}
