import type { BoxProps } from '@mui/material/Box';

import { useCallback } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  item: {
    id: string;
    cardType: string;
    balance: number;
    cardHolder: string;
    cardNumber: string;
    cardValid: string;
  };
};

export function BankingCurrentBalance({ item, sx, ...other }: Props) {
  const showCurrency = useBoolean();
  const menuActions = usePopover();

  const handleDelete = useCallback(() => {
    menuActions.onClose();
    console.info('DELETE', item.id);
  }, [item.id, menuActions]);

  const handleEdit = useCallback(() => {
    menuActions.onClose();
    console.info('EDIT', item.id);
  }, [item.id, menuActions]);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Excluir
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [`url(${CONFIG.assetsDir}/assets/background/background-4.jpg)`],
          }),
          mb: 2,
          borderRadius: 2,
          position: 'relative',
          color: 'common.white',
          '&::before, &::after': {
            left: 0,
            right: 0,
            mx: '28px',
            zIndex: -2,
            height: 40,
            bottom: -16,
            content: "''",
            opacity: 0.16,
            borderRadius: 1.5,
            bgcolor: 'grey.500',
            position: 'absolute',
          },
          '&::after': { mx: '16px', bottom: -8, opacity: 0.32 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ p: 3, width: 1, height: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top Row: Balance & Icons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Box sx={{ mb: 0.5, typography: 'subtitle2', opacity: 0.7, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>
              Saldo atual
            </Box>
            <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ typography: 'h4', fontFamily: 'var(--font-orbitron), sans-serif', letterSpacing: 1 }}>
                {showCurrency.value ? '********' : fCurrency(item.balance)}
              </Box>
              <IconButton size="small" color="inherit" onClick={showCurrency.onToggle} sx={{ opacity: 0.48 }}>
                <Iconify icon={showCurrency.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </Box>
          </div>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Iconify icon={"solar:wireless-charge-bold" as any} sx={{ width: 28, height: 28, opacity: 0.6, transform: 'rotate(90deg)' }} />
            <IconButton color="inherit" onClick={menuActions.onOpen} sx={{ opacity: 0.48, mr: -1 }}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </Box>

        {/* Middle Row: Chip & Card Number */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Iconify 
            icon={"solar:sim-card-bold" as any} 
            sx={{ 
              width: 40, 
              height: 40, 
              color: '#FFD700', 
              opacity: 0.85, 
              transform: 'rotate(90deg)',
              filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.4))'
            }} 
          />
          <Box
            sx={{
              typography: 'h5',
              fontFamily: 'monospace',
              letterSpacing: 6,
              textShadow: '0px 2px 4px rgba(0,0,0,0.6)',
              opacity: 0.9,
            }}
          >
            {item.cardNumber}
          </Box>
        </Box>

        {/* Bottom Row: Details & Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
          <Box sx={{ gap: 4, display: 'flex', typography: 'subtitle1' }}>
            <div>
              <Box sx={{ mb: 0.5, opacity: 0.6, typography: 'caption', textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.5 }}>
                {item.cardType === 'blockchain' ? 'Titular da conta' : 'Titular do cartão'}
              </Box>
              <Box component="span" sx={{ textTransform: 'uppercase', fontFamily: 'monospace', fontSize: 14, letterSpacing: 1, textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}>
                {item.cardHolder}
              </Box>
            </div>
            <div>
              <Box sx={{ mb: 0.5, opacity: 0.6, typography: 'caption', textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.5 }}>
                {item.cardType === 'blockchain' ? 'Rede' : 'Validade'}
              </Box>
              <Box component="span" sx={{ fontFamily: 'monospace', fontSize: 14, letterSpacing: 1, textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}>
                {item.cardValid}
              </Box>
            </div>
          </Box>

          <Box
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              display: 'inline-flex',
              bgcolor: 'common.white',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            {item.cardType === 'visa' && <Iconify width={36} height="auto" icon="payments:visa" />}
            {item.cardType === 'mastercard' && (
              <Iconify width={36} height="auto" icon="payments:mastercard" />
            )}
            {item.cardType === 'blockchain' && (
              <Iconify width={36} height="auto" icon="solar:atom-bold-duotone" sx={{ color: 'primary.main' }} />
            )}
          </Box>
        </Box>
      </Box>

      {renderMenuActions()}
    </Box>
  );
}
