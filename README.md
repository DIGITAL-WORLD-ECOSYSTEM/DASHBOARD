# 🌐 DAO Dashboard - Frontend Client

Este é o frontend do sistema de painel de controle e governança (DAO). Ele foi construído utilizando as melhores práticas modernas de **Clean Architecture**, focando na separação de responsabilidades (Domain Separation) e integração híbrida entre contas tradicionais (Web2) e identidades descentralizadas (Web3 - SIWE).

---

## 🏗️ Arquitetura do Frontend (Architecture)

### 1. Sistema de Identidade: O Padrão View Model
Para garantir que a lógica complexa de perfis não invada os componentes visuais, a aplicação adota o padrão **View Model Pattern**. 

A fonte da verdade de autenticação (`AuthProvider`) foi isolada, retornando apenas a sessão bruta. Os componentes visuais consomem os dados através do Hook especializado:
**`useUserProfile`** (`src/auth/hooks/use-user-profile.ts`)

#### Profile Transformers (`src/utils/profile-transformers.ts`)
A arquitetura conta com uma suíte de "Funções Puras" (Transformers) responsáveis pelas regras de negócio visuais:
* **`buildDisplayName`**: Define o nome de exibição (Single Source of Truth). Prioriza Nomes Civis, realiza o fallback inteligente para endereços de Carteiras Web3 (aplicando o interceptador de emergência) ou extração de e-mails.
* **`formatWalletAddress`**: Formata nativamente qualquer carteira para o padrão simétrico (ex: `0xDfcE...e6b56f`).
* **`buildDisplayAvatar`**: Garante que o aplicativo inteiro respeite o carregamento de imagens de perfil do banco de dados ou acione nativamente a imagem global de Fallback (`/assets/images/avatar/default-avatar.png`).

---

## 🗺️ Roadmap de Evolução (Próximas Fases)

O núcleo de apresentação e rotas dinâmicas do dashboard já foi refatorado. As próximas fases focam exclusivamente na **Consistência de Dados e Infraestrutura de Backend**:

### Etapa A: Correção e Expansão dos DTOs (`/login` e `/me`)
* **Objetivo:** O Frontend depende de campos completos (`firstName`, `lastName`, `photoURL`, `did`, `walletAddress`, etc.). Atualmente o login local (`local.ts`) retorna DTOs limitados (`{ id, email, role }`). 
* **Ação:** Atualizar o *Drizzle ORM* e as rotas para retornar a payload completa, permitindo que a camada View Model opere em sua capacidade máxima com dados do banco ao invés de fallbacks.

### Etapa B: Infraestrutura de Storage de Avatar
* **Objetivo:** Substituir as simulações (`Promise.resolve`) no componente `account-general.tsx`.
* **Ação:** Implementar upload `multipart/form-data` conectando ao **Cloudflare R2**, salvando a URL gerada de volta no banco de dados SQLite (D1) e atualizando a sessão em tempo real.

### Etapa C: Chat e Comunicação Real-Time
* **Objetivo:** Romper o isolamento do Módulo de Chat.
* **Ação:** Substituir totalmente o estado estático e o hook `useMockedUser` por uma arquitetura em tempo real. A decisão da engenharia pendula entre Polling REST otimizado (via Cloudflare Workers) ou WebSocket/SSE gerenciado via Cloudflare Durable Objects.

---

## ⚠️ Débitos Técnicos e Módulos Congelados (Known Issues)

> [!WARNING]
> **Módulo de Chat Congelado:** 
> Todos os arquivos dentro de `src/sections/chat/*` foram isolados deliberadamente da refatoração arquitetural. Atualmente, este módulo **continua consumindo o Hook estático `useMockedUser`**. Qualquer alteração estrutural no chat deve aguardar o início da **Etapa C** do nosso Roadmap para evitar regressões e trabalho duplo.

---

## 🛠️ Instalação e Execução (Dev)

**Pré-requisitos**
* Node.js >=20 (Recomendado)
* Gerenciador de Pacotes: `pnpm` (Padrão atual) ou `yarn`.

**Instalação (pnpm)**
```sh
pnpm install
pnpm dev
```

**Build de Produção**
```sh
pnpm build
```

*(Base do projeto originada do Minimal UI Kit. Ambiente de Mock data genérico em `https://api-dev-minimal-[version].vercel.app` para componentes não integrados ao backend).*
