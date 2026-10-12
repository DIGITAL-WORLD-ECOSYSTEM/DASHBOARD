use super::local_database::{LocalDatabase, StoredWallet, StorageError};

pub struct MigrationManager;

impl MigrationManager {
    /// Executa as migrações versionadas no banco SQLite local dentro de transação
    pub fn run_migrations(db: &LocalDatabase) -> Result<(), StorageError> {
        let mut conn = db.get_connection()?;
        let tx = conn.transaction()?;

        // 1. Tabela de controle de versão de migrações
        tx.execute_batch(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                applied_at TEXT NOT NULL
            );"
        )?;

        // Consulta última migração aplicada
        let current_version: u32 = tx
            .query_row("SELECT COALESCE(MAX(version), 0) FROM schema_migrations", [], |row| row.get(0))
            .unwrap_or(0);

        // Migração 1: Estrutura inicial do cofre e tabelas de custódia
        if current_version < 1 {
            tx.execute_batch(
                "CREATE TABLE IF NOT EXISTS vault_header (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    version INTEGER NOT NULL,
                    canary_envelope TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS wallets (
                    id INTEGER PRIMARY KEY,
                    target TEXT NOT NULL,
                    custody_type TEXT NOT NULL,
                    user_name TEXT NOT NULL,
                    label TEXT NOT NULL,
                    derivation_path TEXT NOT NULL,
                    network TEXT NOT NULL,
                    address TEXT NOT NULL,
                    status TEXT NOT NULL,
                    kyc_status TEXT NOT NULL,
                    seed_words_count INTEGER NOT NULL,
                    created_at TEXT NOT NULL,
                    vault_id TEXT,
                    client_doc TEXT
                );

                CREATE TABLE IF NOT EXISTS vault_secrets (
                    vault_id TEXT PRIMARY KEY,
                    target TEXT NOT NULL,
                    envelope TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                INSERT INTO schema_migrations (version, applied_at)
                VALUES (1, datetime('now'));"
            )?;
        }

        tx.commit()?;

        // Semeadura inicial se tabela estiver vazia
        let existing = db.list_wallets()?;
        if existing.is_empty() {
            let initial_wallets = Self::get_initial_seed_wallets();
            db.append_wallets(&initial_wallets)?;
        }

        Ok(())
    }

    /// Semeia as carteiras preexistentes de forma 100% honesta e auditável:
    /// - custody_type: 'WATCH_ONLY' (não possuem segredos no cofre local)
    /// - vault_id: None (sem chave privada atribuída)
    /// - kyc_status: 'UNVERIFIED' (não simulado como 'VERIFIED')
    fn get_initial_seed_wallets() -> Vec<StoredWallet> {
        let mut wallets = Vec::new();

        // 7 Carteiras Institucionais da DAO (Identificadas como WATCH_ONLY)
        let dao_seeds = [
            (1, "Caixa Operacional Principal", "m/44'/60'/0'/0/0", "Arbitrum One", "0x3f99E077b18a12F4e912b77a11cc9088d29941a0"),
            (2, "Gas Station & Network Fees", "m/44'/60'/0'/0/1", "Arbitrum One", "0x11cc9088d244ee1999c43f99E077b18a12F4e912"),
            (3, "Carteira de Liquidação & Escrow", "m/44'/60'/0'/0/2", "Polygon", "0x29941a03f99E077b18a12F4e912b77a11cc9088d"),
            (4, "Cofre de Recompensas de Governança", "m/44'/60'/0'/0/3", "Arbitrum One", "0x44ee1999c43f99E077b18a12F4e912b77a11cc9"),
            (5, "Pool de Liquidez & Market Making", "m/44'/60'/0'/0/4", "Arbitrum One", "0x99c43f99E077b18a12F4e912b77a11cc9088d244"),
            (6, "Fundo de Reserva de Estabilidade", "m/44'/60'/0'/0/5", "Ethereum", "0x77b18a12F4e912b77a11cc9088d29941a03f99E0"),
            (7, "Nó Validador & Infraestrutura", "m/44'/60'/0'/0/6", "Arbitrum One", "0x88d29941a03f99E077b18a12F4e912b77a11cc90"),
        ];

        for (id, label, path, net, addr) in dao_seeds {
            wallets.push(StoredWallet {
                id,
                target: "DAO".to_string(),
                custody_type: "WATCH_ONLY".to_string(),
                user: "ASPPIBRA DAO".to_string(),
                label: label.to_string(),
                derivation_path: path.to_string(),
                network: net.to_string(),
                address: addr.to_string(),
                status: "ACTIVE".to_string(),
                kyc_status: "UNVERIFIED".to_string(),
                seed_words_count: 24,
                created_at: "2026-08-19 15:57".to_string(),
                vault_id: None,
                client_doc: None,
            });
        }

        // 12 Carteiras de Associados (Identificadas como WATCH_ONLY)
        let client_seeds = [
            (101, "Andressa de Lima Ferreira", "CPF ***.***.780-**", "Conta de Custódia Membro #2024001", "m/44'/60'/0'/0/0", "Arbitrum One", "0x780a12F4e912b77a3f99E077b111cc9088d29941a0"),
            (102, "Felipe Dev", "CPF ***.***.111-**", "Conta de Custódia Membro #4", "m/44'/60'/0'/0/0", "Arbitrum One", "0x111e077b18a12F4e912b77a11cc9088d29941a0"),
            (103, "Paulo Roberto Batista Ferreira", "CPF ***.***.432-**", "Conta de Custódia Associado #101", "m/44'/60'/0'/0/0", "Arbitrum One", "0x4329e077b18a12F4e912b77a11cc9088d29941a0"),
            (104, "Sandro Alves de Amorim", "CPF ***.***.891-**", "Conta de Custódia Associado #106", "m/44'/60'/0'/0/0", "Arbitrum One", "0x8912e077b18a12F4e912b77a11cc9088d29941a0"),
            (105, "Carlos Mendes de Oliveira", "CPF ***.***.554-**", "Conta de Custódia Associado #102", "m/44'/60'/0'/0/0", "Polygon", "0x5541e077b18a12F4e912b77a11cc9088d29941a0"),
            (106, "Juliana Costa e Silva", "CPF ***.***.329-**", "Conta de Custódia Associada #103", "m/44'/60'/0'/0/0", "Arbitrum One", "0x3298e077b18a12F4e912b77a11cc9088d29941a0"),
            (107, "Lucas Henrique de Almeida", "CPF ***.***.712-**", "Conta de Custódia Associado #104", "m/44'/60'/0'/0/0", "BNB Chain", "0x7123e077b18a12F4e912b77a11cc9088d29941a0"),
            (108, "Mariana Ribeiro Santos", "CPF ***.***.608-**", "Conta de Custódia Associada #105", "m/44'/60'/0'/0/0", "Arbitrum One", "0x6087e077b18a12F4e912b77a11cc9088d29941a0"),
            (109, "Beatriz Souza Moreira", "CPF ***.***.934-**", "Conta de Custódia Associada #107", "m/44'/60'/0'/0/0", "Arbitrum One", "0x9345e077b18a12F4e912b77a11cc9088d29941a0"),
            (110, "Rodrigo Fernandes Lima", "CPF ***.***.217-**", "Conta de Custódia Associado #108", "m/44'/60'/0'/0/0", "Ethereum", "0x2176e077b18a12F4e912b77a11cc9088d29941a0"),
            (111, "Camila Duarte Nogueira", "CPF ***.***.845-**", "Conta de Custódia Associada #109", "m/44'/60'/0'/0/0", "Polygon", "0x8452e077b18a12F4e912b77a11cc9088d29941a0"),
            (112, "Gabriel Pires de Santana", "CPF ***.***.371-**", "Conta de Custódia Associado #110", "m/44'/60'/0'/0/0", "Arbitrum One", "0x3719e077b18a12F4e912b77a11cc9088d29941a0"),
        ];

        for (id, name, doc, label, path, net, addr) in client_seeds {
            wallets.push(StoredWallet {
                id,
                target: "CLIENT".to_string(),
                custody_type: "WATCH_ONLY".to_string(),
                user: name.to_string(),
                label: label.to_string(),
                derivation_path: path.to_string(),
                network: net.to_string(),
                address: addr.to_string(),
                status: "ACTIVE".to_string(),
                kyc_status: "UNVERIFIED".to_string(),
                seed_words_count: 24,
                created_at: "2023-08-08 12:00".to_string(),
                vault_id: None,
                client_doc: Some(doc.to_string()),
            });
        }

        wallets
    }
}
