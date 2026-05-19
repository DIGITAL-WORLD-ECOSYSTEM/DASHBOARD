import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src//_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '',
  DASHBOARD: '/dashboard',
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
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: {
        root: `${ROOTS.DASHBOARD}/analytics`,
        global: `${ROOTS.DASHBOARD}/analytics/global`,
        social: {
          root: `${ROOTS.DASHBOARD}/analytics/social`,
          networks: '#',
          analytics: '#',
          api: `${ROOTS.DASHBOARD}/analytics/social/api`,
        },
        user: {
          root: `${ROOTS.DASHBOARD}/analytics/user`,
          associates: '#',
          members: `${ROOTS.DASHBOARD}/analytics/user/members`,
          users: `${ROOTS.DASHBOARD}/analytics/user/list`,
          api: '#',
        },
        finance: {
          root: `${ROOTS.DASHBOARD}/analytics/finance`,
          treasury: '#',
          payments: '#',
          dao: '#',
          contract: `${ROOTS.DASHBOARD}/analytics/contract`,
          ledger: `${ROOTS.DASHBOARD}/analytics/ledger`,
          api: '#',
        },
      },
      banking: `${ROOTS.DASHBOARD}/banking`,
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
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: { details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}` },
    }
  },
};
