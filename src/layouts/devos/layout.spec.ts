import { it, expect, describe } from 'vitest';

import { paths } from 'src/routes/paths';

import { DEVOS_NAV_DATA, getSectionTitle } from './layout';

describe('DevOS Layout — Integridade da Barra Lateral e Navegação', () => {
  it('deve possuir exatamente 4 grupos de navegação principais', () => {
    expect(DEVOS_NAV_DATA).toHaveLength(4);
    const subheaders = DEVOS_NAV_DATA.map((group) => group.subheader);
    expect(subheaders).toEqual([
      'FINANCEIRO',
      'CONTROL PLANE',
      'SECURITY',
      'INFRASTRUCTURE',
    ]);
  });

  it('deve conter todos os 11 itens de navegação esperados sem perdas', () => {
    const totalItems = DEVOS_NAV_DATA.reduce((acc, group) => acc + group.items.length, 0);
    expect(totalItems).toBe(11);

    const financeiroGroup = DEVOS_NAV_DATA.find((g) => g.subheader === 'FINANCEIRO');
    expect(financeiroGroup?.items.map((i) => i.title)).toEqual([
      'Tesouraria',
      'Carteiras',
      'Livro-Razão',
      'Faturas',
    ]);

    const controlPlaneGroup = DEVOS_NAV_DATA.find((g) => g.subheader === 'CONTROL PLANE');
    expect(controlPlaneGroup?.items.map((i) => i.title)).toEqual([
      'Observability',
      'Database',
      'Notificações',
    ]);

    const securityGroup = DEVOS_NAV_DATA.find((g) => g.subheader === 'SECURITY');
    expect(securityGroup?.items.map((i) => i.title)).toEqual([
      'Security',
      'Audit',
    ]);

    const infraGroup = DEVOS_NAV_DATA.find((g) => g.subheader === 'INFRASTRUCTURE');
    expect(infraGroup?.items.map((i) => i.title)).toEqual([
      'APIs',
      'Infrastructure',
    ]);
  });

  it('deve resolver corretamente o título de exibição no cabeçalho para cada rota', () => {
    expect(getSectionTitle(paths.devos.root)).toBe('Observability');
    expect(getSectionTitle(paths.devos.dao)).toBe('Tesouraria');
    expect(getSectionTitle(paths.devos.wallets)).toBe('Carteiras');
    expect(getSectionTitle(paths.devos.ledger)).toBe('Livro-Razão');
    expect(getSectionTitle(paths.devos.invoices)).toBe('Faturas');
    expect(getSectionTitle(paths.devos.database)).toBe('Database');
    expect(getSectionTitle(paths.devos.notifications.root)).toBe('Notificações');
    expect(getSectionTitle(paths.devos.security)).toBe('Security');
    expect(getSectionTitle(paths.devos.audit)).toBe('Audit');
    expect(getSectionTitle(paths.devos.apis)).toBe('APIs');
    expect(getSectionTitle(paths.devos.infrastructure)).toBe('Infrastructure');
    expect(getSectionTitle('/devos/unknown')).toBe('DevOS Cockpit');
  });
});
