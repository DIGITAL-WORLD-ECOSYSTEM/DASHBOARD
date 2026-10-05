import type { IUserItem } from 'src/types/user';

// ----------------------------------------------------------------------

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDate(date?: Date | string | null): string {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Ativo',
    pending: 'Pendente',
    suspended: 'Suspenso',
    inactive: 'Inativo',
    blocked: 'Bloqueado',
  };
  return map[status] || status;
}

function getKycLabel(kyc: string): string {
  const map: Record<string, string> = {
    draft: 'Não Iniciado',
    pending: 'Pendente',
    under_review: 'Em Análise',
    approved: 'Verificado',
    rejected: 'Rejeitado',
    expired: 'Expirado',
  };
  return map[kyc] || kyc;
}

function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    admin: 'Administrador (Admin)',
    dev: 'Engenharia (Dev)',
    user: 'Associado (Citizen)',
  };
  return map[role] || role.toUpperCase();
}

// ----------------------------------------------------------------------
// 1. EXPORT TO CSV (Universal UTF-8 with BOM & Semicolon Delimiter)
// ----------------------------------------------------------------------
export function exportUsersToCsv(users: IUserItem[], filenamePrefix = 'asppibra_associados') {
  const headers = [
    'ID',
    'Código ASPPIBRA (AspId)',
    'Nome Completo',
    'E-mail',
    'Telefone',
    'Função / Cargo',
    'Nível de Acesso (Role)',
    'Situação da Conta',
    'Status KYC',
    'Nível de Confiança',
    'DID Descentralizado',
    'E-mail Verificado',
    'Telefone Verificado',
    'MFA Ativado',
    'Passkeys',
    'Data de Cadastro',
  ];

  const rows = users.map((u) => [
    `"${u.id || ''}"`,
    `"${u.aspId || ''}"`,
    `"${(u.name || '').replace(/"/g, '""')}"`,
    `"${(u.email || '').replace(/"/g, '""')}"`,
    `"${(u.phoneNumber || '').replace(/"/g, '""')}"`,
    `"${(u.company || 'ASPPIBRA').replace(/"/g, '""')}"`,
    `"${getRoleLabel(u.role)}"`,
    `"${getStatusLabel(u.status)}"`,
    `"${getKycLabel(u.kycStatus)}"`,
    `"${u.trustLevel || 'Padrão'}"`,
    `"${u.did || ''}"`,
    `"${u.emailVerified ? 'Sim' : 'Não'}"`,
    `"${u.phoneVerified ? 'Sim' : 'Não'}"`,
    `"${u.mfaEnabled ? 'Sim' : 'Não'}"`,
    `"${u.passkeyCount || 0}"`,
    `"${formatDate(u.createdAt)}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `${filenamePrefix}_${dateStr}.csv`);
}

// ----------------------------------------------------------------------
// 2. EXPORT TO EXCEL (.xls Spreadsheet with Visual Styling)
// ----------------------------------------------------------------------
export function exportUsersToExcel(users: IUserItem[], filenamePrefix = 'asppibra_associados') {
  const dateStr = new Date().toISOString().slice(0, 10);
  const nowFormatted = new Date().toLocaleString('pt-BR');

  let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Associados ASPPIBRA</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; }
        .header-title { font-size: 16pt; font-weight: bold; color: #1c252e; }
        .header-sub { font-size: 10pt; color: #637381; }
        th { background-color: #004b87; color: #ffffff; font-weight: bold; border: 1px solid #003366; padding: 8px; text-align: left; }
        td { border: 1px solid #e0e0e0; padding: 6px; font-size: 10pt; vertical-align: middle; }
        .badge-active { background-color: #dcfce7; color: #15803d; font-weight: bold; text-align: center; }
        .badge-pending { background-color: #fef9c3; color: #a16207; font-weight: bold; text-align: center; }
        .badge-suspended { background-color: #fee2e2; color: #b91c1c; font-weight: bold; text-align: center; }
        .center { text-align: center; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="10" class="header-title">ASPPIBRA DAO — Relatório Oficial de Membros e Identidades</td>
        </tr>
        <tr>
          <td colspan="10" class="header-sub">Extração gerada em: ${nowFormatted} | Total de Registros: ${users.length}</td>
        </tr>
        <tr></tr>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código AspId</th>
            <th>Nome do Associado</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Função / Órgão</th>
            <th>Perfil de Acesso</th>
            <th>Situação</th>
            <th>Conformidade KYC</th>
            <th>Data de Cadastro</th>
          </tr>
        </thead>
        <tbody>
  `;

  users.forEach((u) => {
    const statusClass =
      u.status === 'active'
        ? 'badge-active'
        : u.status === 'pending'
          ? 'badge-pending'
          : 'badge-suspended';

    tableHtml += `
      <tr>
        <td class="center">${u.id || ''}</td>
        <td style="font-family: monospace;">${u.aspId || ''}</td>
        <td><b>${u.name || ''}</b></td>
        <td>${u.email || '-'}</td>
        <td>${u.phoneNumber || '-'}</td>
        <td>${u.company || 'ASPPIBRA'}</td>
        <td class="center">${getRoleLabel(u.role)}</td>
        <td class="${statusClass}">${getStatusLabel(u.status)}</td>
        <td class="center">${getKycLabel(u.kycStatus)}</td>
        <td>${formatDate(u.createdAt)}</td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  downloadBlob(blob, `${filenamePrefix}_${dateStr}.xls`);
}

// ----------------------------------------------------------------------
// 3. EXPORT TO JSON (Structured API Data Dump with Metadata)
// ----------------------------------------------------------------------
export function exportUsersToJson(users: IUserItem[], filenamePrefix = 'asppibra_associados') {
  const exportPayload = {
    metadata: {
      titulo: 'ASPPIBRA DAO — Dossiê de Identidades e Governança de Usuários',
      plataforma: 'https://app.asppibra.com',
      data_extracao_utc: new Date().toISOString(),
      total_registros: users.length,
      versao_arquitetura: 'V16 Clean Architecture (D1 / SSI W3C DID)',
    },
    usuarios: users.map((u) => ({
      id_relacional: Number(u.id),
      codigo_asppibra: u.aspId,
      did_w3c: u.did,
      nome_completo: u.name,
      email: u.email || null,
      telefone: u.phoneNumber || null,
      organizacao: u.company || 'ASPPIBRA',
      papel_rbac: u.role,
      status_conta: u.status,
      conformidade_kyc: {
        status: u.kycStatus,
        verificado: u.isVerified,
        nivel_confianca: u.trustLevel || 'Padrão',
      },
      credenciais_seguranca: {
        email_verificado: u.emailVerified,
        telefone_verificado: u.phoneVerified,
        mfa_ativado: u.mfaEnabled,
        passkeys_configuradas: u.passkeyCount || 0,
        biometria_validada: u.biometricVerified,
      },
      datas: {
        criado_em: u.createdAt || null,
        atualizado_em: u.updatedAt || null,
        ultimo_acesso: u.lastActivity || null,
      },
    })),
  };

  const jsonContent = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `${filenamePrefix}_${dateStr}.json`);
}

// ----------------------------------------------------------------------
// 4. EXPORT TO PDF (Printable Official Audit Dossier)
// ----------------------------------------------------------------------
export function exportUsersToPdf(users: IUserItem[]) {
  const nowFormatted = new Date().toLocaleString('pt-BR');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar a visualização de impressão/PDF.');
    return;
  }

  const printHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>ASPPIBRA DAO — Dossiê Oficial de Associados</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1c252e;
          margin: 0;
          padding: 20px;
          background: #fff;
          font-size: 11pt;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #004b87;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .logo-box h1 {
          margin: 0;
          font-size: 18pt;
          color: #004b87;
          letter-spacing: -0.5px;
        }
        .logo-box p {
          margin: 4px 0 0 0;
          font-size: 9pt;
          color: #637381;
        }
        .meta-box {
          text-align: right;
          font-size: 9pt;
          color: #637381;
        }
        .meta-box strong { color: #1c252e; }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .card {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 10px 14px;
          background-color: #f8fafc;
        }
        .card-label { font-size: 8.5pt; color: #64748b; text-transform: uppercase; font-weight: bold; }
        .card-value { font-size: 16pt; font-weight: bold; color: #0f172a; margin-top: 4px; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 9pt;
        }
        th {
          background-color: #f1f5f9;
          color: #334155;
          text-align: left;
          padding: 8px 10px;
          border-bottom: 2px solid #cbd5e1;
          font-weight: 700;
        }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        tr:nth-child(even) { background-color: #f8fafc; }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 8pt;
          font-weight: bold;
        }
        .badge-active { background: #dcfce7; color: #15803d; }
        .badge-pending { background: #fef9c3; color: #854d0e; }
        .badge-suspended { background: #fee2e2; color: #991b1b; }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          font-size: 8pt;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-box">
          <h1>ASPPIBRA DAO</h1>
          <p>Associação dos Proprietários e Posseiros de Imóveis no Brasil</p>
        </div>
        <div class="meta-box">
          <div>Relatório: <strong>Relação de Membros e Identidades</strong></div>
          <div>Emitido em: <strong>${nowFormatted}</strong></div>
          <div>Protocolo de Governança: <strong>#${Date.now().toString(36).toUpperCase()}</strong></div>
        </div>
      </div>

      <div class="summary-cards">
        <div class="card">
          <div class="card-label">Total Listado</div>
          <div class="card-value">${users.length}</div>
        </div>
        <div class="card">
          <div class="card-label">Ativos</div>
          <div class="card-value">${users.filter((u) => u.status === 'active').length}</div>
        </div>
        <div class="card">
          <div class="card-label">Pendentes</div>
          <div class="card-value">${users.filter((u) => u.status === 'pending').length}</div>
        </div>
        <div class="card">
          <div class="card-label">KYC Verificado</div>
          <div class="card-value">${users.filter((u) => u.isVerified || u.kycStatus === 'approved').length}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px;">ID</th>
            <th style="width: 90px;">AspId</th>
            <th>Nome do Associado</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Perfil</th>
            <th>Situação</th>
            <th>Status KYC</th>
            <th>Cadastrado em</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (u) => `
            <tr>
              <td>${u.id}</td>
              <td style="font-family: monospace; font-weight: bold;">${u.aspId || '-'}</td>
              <td><strong>${u.name}</strong></td>
              <td>${u.email || '-'}</td>
              <td>${u.phoneNumber || '-'}</td>
              <td>${getRoleLabel(u.role)}</td>
              <td><span class="badge ${u.status === 'active' ? 'badge-active' : u.status === 'pending' ? 'badge-pending' : 'badge-suspended'}">${getStatusLabel(u.status)}</span></td>
              <td>${getKycLabel(u.kycStatus)}</td>
              <td>${formatDate(u.createdAt)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <div>Documento gerado automaticamente pela Central de Governança ASPPIBRA (app.asppibra.com)</div>
        <div>Página 1 de 1 — Documento Autenticável via D1 Ledger Blockchain</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printHtml);
  printWindow.document.close();
}
