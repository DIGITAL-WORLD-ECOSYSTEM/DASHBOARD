import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  folder: icon('ic-folder'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Visão Geral
   */
  {
    subheader: 'Visão Geral',
    items: [
      { title: 'Início', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'E-commerce', path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
      {
        title: 'Análise',
        path: paths.dashboard.general.analytics.root,
        icon: ICONS.analytics,
        children: [
          {
            title: 'Social Hub',
            path: paths.dashboard.general.analytics.social.root,
            children: [
              { title: 'Redes Sociais', path: paths.dashboard.general.analytics.social.networks },
              { title: 'Analytics', path: paths.dashboard.general.analytics.social.analytics },
              { title: 'API', path: paths.dashboard.general.analytics.social.api },
            ],
          },
          {
            title: 'User Hub',
            path: paths.dashboard.general.analytics.user.root,
            children: [
              { title: 'Associados', path: paths.dashboard.general.analytics.user.associates },
              { title: 'Membros', path: paths.dashboard.general.analytics.user.members },
              { title: 'Usuários', path: paths.dashboard.general.analytics.user.users },
              { title: 'API', path: paths.dashboard.general.analytics.user.api },
            ],
          },
          {
            title: 'Finance Hub',
            path: paths.dashboard.general.analytics.finance.root,
            children: [
              { title: 'Tesouraria', path: paths.dashboard.general.analytics.finance.treasury },
              { title: 'Pagamentos', path: paths.dashboard.general.analytics.finance.payments },
              { title: 'Finanças da DAO', path: paths.dashboard.general.analytics.finance.dao },
              { title: 'Contrato', path: paths.dashboard.general.analytics.finance.contract },
              { title: 'Auditoria', path: paths.dashboard.general.analytics.finance.ledger },
              { title: 'API', path: paths.dashboard.general.analytics.finance.api },
            ],
          },
          { title: 'Visão Global', path: paths.dashboard.general.analytics.global },
        ],
      },
      { title: 'Bancário', path: paths.dashboard.general.banking, icon: ICONS.banking },
      { title: 'Arquivos', path: paths.dashboard.general.file, icon: ICONS.file },
    ],
  },
  /**
   * Gestão
   */
  {
    subheader: 'Gestão',
    items: [
      {
        title: 'Usuário',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Perfil', path: paths.dashboard.user.root },
          { title: 'Cartões', path: paths.dashboard.user.cards },
          { title: 'Lista', path: paths.dashboard.user.list },
          { title: 'Criar', path: paths.dashboard.user.new },
          { title: 'Editar', path: paths.dashboard.user.demo.edit },
          { title: 'Conta', path: paths.dashboard.user.account, deepMatch: true },
        ],
      },
      {
        title: 'Produto',
        path: paths.dashboard.product.root,
        icon: ICONS.product,
        children: [
          { title: 'Lista', path: paths.dashboard.product.root },
          { title: 'Detalhes', path: paths.dashboard.product.demo.details },
          { title: 'Criar', path: paths.dashboard.product.new },
          { title: 'Editar', path: paths.dashboard.product.demo.edit },
        ],
      },
      {
        title: 'Pedido',
        path: paths.dashboard.order.root,
        icon: ICONS.order,
        children: [
          { title: 'Lista', path: paths.dashboard.order.root },
          { title: 'Detalhes', path: paths.dashboard.order.demo.details },
        ],
      },
      {
        title: 'Faturas',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'Lista', path: paths.dashboard.invoice.root },
          { title: 'Detalhes', path: paths.dashboard.invoice.demo.details },
          { title: 'Criar', path: paths.dashboard.invoice.new },
          { title: 'Editar', path: paths.dashboard.invoice.demo.edit },
        ],
      },
      {
        title: 'Blog',
        path: paths.dashboard.post.root,
        icon: ICONS.blog,
        children: [
          { title: 'Lista', path: paths.dashboard.post.root },
          { title: 'Detalhes', path: paths.dashboard.post.demo.details },
          { title: 'Criar', path: paths.dashboard.post.new },
          { title: 'Editar', path: paths.dashboard.post.demo.edit },
        ],
      },
      { title: 'Gestor de Arquivos', path: paths.dashboard.fileManager, icon: ICONS.folder },
      {
        title: 'E-mail',
        path: paths.dashboard.mail,
        icon: ICONS.mail,
        info: (
          <Label color="error" variant="inverted">
            +32
          </Label>
        ),
      },
      { title: 'Chat', path: paths.dashboard.chat, icon: ICONS.chat },
      { title: 'Calendário', path: paths.dashboard.calendar, icon: ICONS.calendar },
    ],
  },
];
