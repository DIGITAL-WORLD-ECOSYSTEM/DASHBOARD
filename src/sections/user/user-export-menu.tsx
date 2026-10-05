import type { IUserItem } from 'src/types/user';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import {
  exportUsersToCsv,
  exportUsersToPdf,
  exportUsersToJson,
  exportUsersToExcel,
} from './utils/export-users';

// ----------------------------------------------------------------------

type Props = {
  users: IUserItem[];
  variant?: 'button' | 'icon';
  scopeLabel?: string;
  disabled?: boolean;
};

export function UserExportMenu({
  users,
  variant = 'button',
  scopeLabel,
  disabled = false,
}: Props) {
  const popover = usePopover();

  const handleExport = (format: 'CSV' | 'XLSX' | 'JSON' | 'PDF') => {
    popover.onClose();

    if (!users || users.length === 0) {
      toast.warning('Nenhum usuário disponível para exportação.');
      return;
    }

    try {
      switch (format) {
        case 'CSV':
          exportUsersToCsv(users);
          toast.success(`Exportação CSV concluída (${users.length} registros).`);
          break;
        case 'XLSX':
          exportUsersToExcel(users);
          toast.success(`Planilha Excel gerada (${users.length} registros).`);
          break;
        case 'JSON':
          exportUsersToJson(users);
          toast.success(`Arquivo JSON estruturado gerado (${users.length} registros).`);
          break;
        case 'PDF':
          exportUsersToPdf(users);
          toast.success(`Dossiê PDF pronto para visualização e impressão.`);
          break;
        default:
          break;
      }
    } catch (err: any) {
      console.error('Erro na exportação:', err);
      toast.error('Erro ao gerar arquivo para exportação.');
    }
  };

  const triggerButton =
    variant === 'icon' ? (
      <Tooltip title={scopeLabel || 'Exportar Usuários'}>
        <span>
          <IconButton
            color="primary"
            onClick={popover.onOpen}
            disabled={disabled || users.length === 0}
            sx={{ bgcolor: 'action.hover' }}
          >
            <Iconify icon="solar:export-bold" />
          </IconButton>
        </span>
      </Tooltip>
    ) : (
      <Button
        variant="outlined"
        color="inherit"
        disabled={disabled || users.length === 0}
        onClick={popover.onOpen}
        startIcon={<Iconify icon="solar:export-bold" />}
        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
      >
        Exportar
      </Button>
    );

  return (
    <>
      {triggerButton}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <Box sx={{ p: 1.5, pb: 1, borderBottom: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="subtitle2" noWrap>
            Opções de Exportação
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {scopeLabel || `${users.length} registros selecionados`}
          </Typography>
        </Box>

        <MenuList sx={{ p: 0.5 }}>
          <Typography
            variant="overline"
            sx={{ px: 1.5, py: 0.5, color: 'text.disabled', display: 'block', fontSize: 10 }}
          >
            Planilhas & Análise
          </Typography>

          <MenuItem onClick={() => handleExport('XLSX')} sx={{ gap: 1.5 }}>
            <Iconify icon={'vscode-icons:file-type-excel' as any} width={20} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Planilha Excel (.xls)</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Formatada com cores e estilos
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={() => handleExport('CSV')} sx={{ gap: 1.5 }}>
            <Iconify icon={'solar:file-text-bold' as any} width={20} sx={{ color: 'info.main' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Arquivo CSV (.csv)</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Universal com delimitador padrão BR
              </Typography>
            </Box>
          </MenuItem>

          <Typography
            variant="overline"
            sx={{ px: 1.5, py: 0.5, color: 'text.disabled', display: 'block', fontSize: 10, mt: 0.5 }}
          >
            Auditoria & Governança
          </Typography>

          <MenuItem onClick={() => handleExport('PDF')} sx={{ gap: 1.5 }}>
            <Iconify icon={'vscode-icons:file-type-pdf2' as any} width={20} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Relatório Oficial (.pdf)</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Dossiê diagramado para impressão
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={() => handleExport('JSON')} sx={{ gap: 1.5 }}>
            <Iconify icon={'vscode-icons:file-type-json' as any} width={20} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Estrutura de Dados (.json)</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Dump completo com DIDs e metadados
              </Typography>
            </Box>
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
