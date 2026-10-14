import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src//_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '',
  DASHBOARD: '',
  DEVOS: '/dev',
};

// ----------------------------------------------------------------------

export const paths = {
  about: '#',
  contact: '#',
  faqs: '#',
  pricing: '#',
  payment: '#',
  comingSoon: '#',
  maintenance: '/maintenance',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '#',
  docs: '#',
  changelog: '#',
  zoneStore: '#',
  minimalStore: '#',
  freeUI: '#',
  figmaUrl: '#',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    jwt: {
      signIn: `/login`,
      signUp: `/register`,
      resetPassword: `/forgot-password`,
      updatePassword: `/reset-password`,
      verify: `/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: '/',
    mail: `${ROOTS.DASHBOARD}/communication/email`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    designSystem: `${ROOTS.DASHBOARD}/design-system`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DEVOS}/ecommerce`,
      analytics: {
        root: `${ROOTS.DEVOS}/analytics`,
        global: `${ROOTS.DEVOS}/analytics`,
        social: {
          root: `${ROOTS.DEVOS}/analytics`,
          networks: '#',
          analytics: '#',
          api: '#',
        },
        user: {
          root: `${ROOTS.DEVOS}/analytics`,
          associates: '#',
          members: `${ROOTS.DEVOS}/analytics`,
          users: `${ROOTS.DEVOS}/analytics`,
          cards: '#',
          new: `${ROOTS.DASHBOARD}/user/new`,
          api: '#',
        },
        finance: {
          root: `${ROOTS.DEVOS}/analytics`,
          dao: '#',
          contract: `${ROOTS.DEVOS}/analytics`,
          api: '#',
        },
      },
      banking: {
        root: `${ROOTS.DASHBOARD}/banking`,
        treasury: `${ROOTS.DASHBOARD}/banking/treasury`,
        payments: `${ROOTS.DASHBOARD}/banking/payments`,
        financialHistory: `${ROOTS.DEVOS}/ledger`,
      },
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit` },
    },
    product: {
      root: `${ROOTS.DEVOS}/ecommerce`,
      new: `${ROOTS.DEVOS}/ecommerce`,
      details: (id: string) => `${ROOTS.DEVOS}/ecommerce`,
      edit: (id: string) => `${ROOTS.DEVOS}/ecommerce`,
      demo: {
        details: `${ROOTS.DEVOS}/ecommerce`,
        edit: `${ROOTS.DEVOS}/ecommerce`,
      },
    },
    post: {
      root: `${ROOTS.DEVOS}/blog`,
      new: `${ROOTS.DEVOS}/blog`,
      details: (title: string) => `${ROOTS.DEVOS}/blog`,
      edit: (title: string) => `${ROOTS.DEVOS}/blog`,
      demo: {
        details: `${ROOTS.DEVOS}/blog`,
        edit: `${ROOTS.DEVOS}/blog`,
      },
    },
    order: {
      root: `${ROOTS.DEVOS}/ecommerce`,
      details: (id: string) => `${ROOTS.DEVOS}/ecommerce`,
      demo: { details: `${ROOTS.DEVOS}/ecommerce` },
    },
  },
  // DEVOS
  devos: {
    root: ROOTS.DEVOS,
    database: `${ROOTS.DEVOS}/database`,
    notifications: {
      root: `${ROOTS.DEVOS}/notifications`,
      email: `${ROOTS.DEVOS}/notifications/email`,
      whatsapp: `${ROOTS.DEVOS}/notifications/whatsapp`,
      sms: `${ROOTS.DEVOS}/notifications/sms`,
      social: `${ROOTS.DEVOS}/notifications/social`,
      chat: `${ROOTS.DEVOS}/notifications/chat`,
      settings: `${ROOTS.DEVOS}/notifications/settings`,
    },
    apis: `${ROOTS.DEVOS}/apis`,
    audit: `${ROOTS.DEVOS}/audit`,
    security: `${ROOTS.DEVOS}/security`,
    infrastructure: `${ROOTS.DEVOS}/infrastructure`,
    dao: `${ROOTS.DEVOS}/dao`,
    wallets: `${ROOTS.DEVOS}/wallets`,
    ledger: `${ROOTS.DEVOS}/ledger`,
    citizenLedger: `${ROOTS.DEVOS}/ledger`,
    invoices: `${ROOTS.DEVOS}/invoices`,
    ecommerce: `${ROOTS.DEVOS}/ecommerce`,
    analytics: `${ROOTS.DEVOS}/analytics`,
    blog: `${ROOTS.DEVOS}/blog`,
    founder: {
      strategic: `${ROOTS.DEVOS}/founder/strategic`,
      operations: `${ROOTS.DEVOS}/founder/operations`,
      emergency: `${ROOTS.DEVOS}/founder/emergency`,
    },
  },
};
