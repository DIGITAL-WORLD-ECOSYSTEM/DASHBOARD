import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IUserItem, IUserTableFilters } from 'src/types/user';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IUserTableFilters>;
  options?: {
    roles?: string[];
    kycStatus?: string[];
  };
  filteredUsers?: IUserItem[];
};

export function UserTableToolbar({ filters, onResetPage }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  return (
    <Box
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <TextField
        fullWidth
        value={currentFilters.name}
        onChange={handleFilterName}
        placeholder="Pesquisar nome, e-mail ou ASP-ID..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
