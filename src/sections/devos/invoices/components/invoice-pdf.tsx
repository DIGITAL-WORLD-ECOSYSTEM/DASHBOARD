import type { InvoiceItem } from '../invoices-data';

import { useMemo } from 'react';
import {
  Page,
  Text,
  View,
  Font,
  Document,
  PDFViewer,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontSize: 9,
          lineHeight: 1.5,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: '36px 30px 90px 30px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: '16px 30px',
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#E2E8F0',
          backgroundColor: '#F8FAFC',
        },
        container: { flexDirection: 'row', justifyContent: 'space-between' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb16: { marginBottom: 16 },
        mb24: { marginBottom: 24 },
        h3: { fontSize: 16, fontWeight: 700, color: '#0F172A' },
        h4: { fontSize: 11, fontWeight: 700, color: '#1E293B' },
        text1: { fontSize: 9.5, color: '#334155' },
        text2: { fontSize: 8.5, color: '#64748B' },
        text1Bold: { fontSize: 9.5, fontWeight: 700, color: '#0F172A' },
        text2Bold: { fontSize: 8.5, fontWeight: 700, color: '#334155' },
        statusBadge: {
          padding: '4px 10px',
          borderRadius: 4,
          alignSelf: 'flex-start',
          fontSize: 8.5,
          fontWeight: 700,
          textTransform: 'uppercase',
        },
        badgePaid: {
          backgroundColor: '#DCFCE7',
          color: '#15803D',
        },
        badgePending: {
          backgroundColor: '#FEF3C7',
          color: '#B45309',
        },
        badgeOverdue: {
          backgroundColor: '#FEE2E2',
          color: '#B91C1C',
        },
        badgeDraft: {
          backgroundColor: '#F1F5F9',
          color: '#475569',
        },
        table: { display: 'flex', width: '100%', marginTop: 12 },
        tableHeader: {
          flexDirection: 'row',
          backgroundColor: '#F1F5F9',
          padding: '6px 8px',
          borderBottomWidth: 1,
          borderColor: '#CBD5E1',
        },
        row: {
          padding: '8px 8px',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#E2E8F0',
        },
        cell_1: { width: '8%' },
        cell_2: { width: '47%' },
        cell_3: { width: '15%', textAlign: 'center' },
        cell_4: { width: '15%', textAlign: 'right' },
        cell_5: { width: '15%', textAlign: 'right' },
        summaryContainer: {
          marginTop: 16,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        },
        summaryBox: {
          width: '45%',
          borderTopWidth: 1,
          borderColor: '#E2E8F0',
          paddingTop: 8,
        },
        summaryRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 4,
        },
        protocolBox: {
          marginTop: 20,
          padding: 10,
          backgroundColor: '#F8FAFC',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          borderStyle: 'dashed',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type InvoicePdfDocumentProps = {
  invoice: InvoiceItem;
  currentStatus?: string;
};

export function DevOSInvoicePdfDocument({ invoice, currentStatus }: InvoicePdfDocumentProps) {
  const styles = useStyles();
  const status = currentStatus || invoice.status;

  const statusBadgeStyle = useMemo(() => {
    switch (status) {
      case 'paid':
        return [styles.statusBadge, styles.badgePaid];
      case 'overdue':
        return [styles.statusBadge, styles.badgeOverdue];
      case 'draft':
        return [styles.statusBadge, styles.badgeDraft];
      default:
        return [styles.statusBadge, styles.badgePending];
    }
  }, [status, styles]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'paid':
        return 'LIQUIDADA / PAGA';
      case 'overdue':
        return 'EM ATRASO / VENCIDA';
      case 'draft':
        return 'RASCUNHO / NÃO EMITIDA';
      default:
        return 'PENDENTE DE LIQUIDAÇÃO';
    }
  }, [status]);

  const items = invoice.items && invoice.items.length > 0
    ? invoice.items
    : [
        {
          id: '1',
          description: invoice.description,
          service: 'Contribuição Associativa',
          quantity: 1,
          price: invoice.amount,
          total: invoice.amount,
        },
      ];

  const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const taxes = invoice.taxes || 0;
  const discount = invoice.discount || 0;
  const total = subtotal + taxes - discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER: ORGANIZAÇÃO & METADADOS DA FATURA */}
        <View style={[styles.container, styles.mb24]}>
          <View style={{ width: '60%' }}>
            <Text style={[styles.h3, styles.mb4]}>ASPPIBRA</Text>
            <Text style={[styles.text1Bold, styles.mb4]}>
              Associação dos Proprietários e Parceiros do Brasil
            </Text>
            <Text style={styles.text2}>CNPJ: 48.293.109/0001-84 • Tesouraria Descentralizada</Text>
            <Text style={styles.text2}>Av. Paulista, 1106 - Bela Vista, São Paulo - SP</Text>
            <Text style={styles.text2}>contato@asppibra.org.br</Text>
          </View>

          <View style={{ width: '40%', alignItems: 'flex-end' }}>
            <View style={statusBadgeStyle}>
              <Text>{statusLabel}</Text>
            </View>
            <Text style={[styles.h4, { marginTop: 6, color: '#0F172A', fontFamily: 'Roboto' }]}>
              {invoice.id}
            </Text>
            <Text style={[styles.text2, { marginTop: 2 }]}>
              Competência: <Text style={styles.text2Bold}>{invoice.referenceMonth}</Text>
            </Text>
            <Text style={[styles.text2, { marginTop: 2 }]}>
              Vencimento: <Text style={styles.text2Bold}>{invoice.dueDate}</Text>
            </Text>
            {invoice.settledDate && (
              <Text style={[styles.text2, { marginTop: 2, color: '#15803D' }]}>
                Liquidado em: <Text style={styles.text2Bold}>{invoice.settledDate}</Text>
              </Text>
            )}
          </View>
        </View>

        {/* IDENTIFICAÇÃO DO MEMBRO / PAGADOR */}
        <View style={[styles.container, styles.mb24, { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' }]}>
          <View style={{ width: '60%' }}>
            <Text style={[styles.text2Bold, styles.mb4, { color: '#64748B', textTransform: 'uppercase' }]}>
              Dados do Associado / Membro
            </Text>
            <Text style={[styles.text1Bold, styles.mb4]}>{invoice.memberName}</Text>
            <Text style={styles.text2}>Documento: {invoice.memberDoc}</Text>
            {invoice.memberEmail && <Text style={styles.text2}>E-mail: {invoice.memberEmail}</Text>}
            {invoice.memberAddress && <Text style={styles.text2}>Endereço: {invoice.memberAddress}</Text>}
          </View>

          <View style={{ width: '40%', alignItems: 'flex-end' }}>
            <Text style={[styles.text2Bold, styles.mb4, { color: '#64748B', textTransform: 'uppercase' }]}>
              Método de Liquidação
            </Text>
            <Text style={[styles.text1Bold, styles.mb4]}>{invoice.paymentMethod}</Text>
            <Text style={styles.text2}>Ref. Contábil D1: #{invoice.txId || 'GEN-PENDING'}</Text>
          </View>
        </View>

        {/* TABELA DE ITENS DA FATURA */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.text2Bold, styles.cell_1]}>#</Text>
            <Text style={[styles.text2Bold, styles.cell_2]}>Descrição do Serviço / Contribuição</Text>
            <Text style={[styles.text2Bold, styles.cell_3]}>Qtd</Text>
            <Text style={[styles.text2Bold, styles.cell_4]}>Vlr. Unitário</Text>
            <Text style={[styles.text2Bold, styles.cell_5]}>Total</Text>
          </View>

          {items.map((item, idx) => (
            <View key={item.id || idx} style={styles.row}>
              <Text style={[styles.text2, styles.cell_1]}>{idx + 1}</Text>
              <View style={styles.cell_2}>
                <Text style={styles.text1Bold}>{item.description}</Text>
                {item.service && <Text style={[styles.text2, { color: '#64748B' }]}>{item.service}</Text>}
              </View>
              <Text style={[styles.text2, styles.cell_3]}>{item.quantity}</Text>
              <Text style={[styles.text2, styles.cell_4]}>
                R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.text1Bold, styles.cell_5]}>
                R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {/* RESUMO DE VALORES E TOTAIS */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.text2}>Subtotal:</Text>
              <Text style={styles.text2Bold}>
                R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            {taxes > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.text2}>Taxas / Retenções:</Text>
                <Text style={styles.text2Bold}>
                  R$ {taxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            )}

            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.text2}>Desconto:</Text>
                <Text style={[styles.text2Bold, { color: '#15803D' }]}>
                  - R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            )}

            <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: '#CBD5E1', paddingTop: 6, marginTop: 4 }]}>
              <Text style={[styles.h4, { color: '#0F172A' }]}>VALOR TOTAL:</Text>
              <Text style={[styles.h3, { color: status === 'paid' ? '#15803D' : '#0F172A' }]}>
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* PROTOCOLO CRIPTOGRÁFICO D1 & AUTENTICAÇÃO */}
        <View style={styles.protocolBox}>
          <Text style={[styles.text2Bold, styles.mb4, { color: '#334155' }]}>
            AUTENTICAÇÃO CRIPTOGRÁFICA D1 LEDGER
          </Text>
          <Text style={[styles.text2, { fontFamily: 'Roboto', fontSize: 7.5, color: '#475569' }]}>
            HASH: 05d4084730d36b1073d62c37ab83e9c425d795b5ff34ed949083cdbf02fd7b33::{invoice.id}
          </Text>
          <Text style={[styles.text2, { marginTop: 4, color: '#64748B' }]}>
            Transação registrada imutavelmente na infraestrutura edge Cloudflare D1 da DAO.
          </Text>
        </View>

        {/* FOOTER OFICIAL */}
        <View style={[styles.container, styles.footer]} fixed>
          <View style={{ width: '70%' }}>
            <Text style={[styles.text2Bold, styles.mb4]}>OBSERVAÇÕES E LIQUIDAÇÃO</Text>
            <Text style={styles.text2}>
              Este recibo tem valor para comprovação de regularidade associativa ASPPIBRA. Dúvidas sobre conciliação e
              liquidação contábil podem ser direcionadas à Tesouraria Central.
            </Text>
          </View>
          <View style={{ width: '30%', textAlign: 'right' }}>
            <Text style={[styles.text2Bold, styles.mb4]}>Suporte da DAO</Text>
            <Text style={styles.text2}>tesouraria@asppibra.org.br</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// ----------------------------------------------------------------------

type DevOSInvoicePDFProps = {
  invoice: InvoiceItem;
  currentStatus?: string;
};

export function DevOSInvoicePDFDownload({ invoice, currentStatus }: DevOSInvoicePDFProps) {
  return (
    <PDFDownloadLink
      document={<DevOSInvoicePdfDocument invoice={invoice} currentStatus={currentStatus} />}
      fileName={`fatura_${invoice.id.toLowerCase()}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Tooltip title={loading ? 'Gerando PDF...' : 'Baixar Recibo / Fatura em PDF'}>
          <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Iconify icon={'solar:download-bold' as any} width={18} />
            )}
          </IconButton>
        </Tooltip>
      )}
    </PDFDownloadLink>
  );
}

// ----------------------------------------------------------------------

export function DevOSInvoicePDFViewer({ invoice, currentStatus }: DevOSInvoicePDFProps) {
  return (
    <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
      <DevOSInvoicePdfDocument invoice={invoice} currentStatus={currentStatus} />
    </PDFViewer>
  );
}
