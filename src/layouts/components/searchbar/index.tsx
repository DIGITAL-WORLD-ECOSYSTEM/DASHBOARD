import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

import { ResultItem } from './result-item';
import { applyFilter, flattenNavSections } from './utils';

// ----------------------------------------------------------------------

export type SearchbarProps = BoxProps & {
  data?: NavSectionProps['data'];
};

const breakpoint: Breakpoint = 'sm';

export function Searchbar({ data: navItems = [], sx, ...other }: SearchbarProps) {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up(breakpoint));

  const { value: open, onFalse: onClose, onTrue: onOpen, onToggle } = useBoolean();
  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = useCallback(() => {
    onClose();
    setSearchQuery('');
  }, [onClose]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onToggle();
        setSearchQuery('');
      }
    },
    [onToggle]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const formattedNavItems = flattenNavSections(navItems);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: formattedNavItems,
        query: searchQuery,
      }),
    [formattedNavItems, searchQuery]
  );

  const notFound = searchQuery && !dataFiltered.length;

  const renderButton = () => (
    <Box
      onClick={onOpen}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          [theme.breakpoints.up(breakpoint)]: {
            pl: 0.85,
            pr: 1.15,
            py: 0.45,
            borderRadius: 1.5,
            cursor: 'pointer',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            border: '1px solid rgba(145, 158, 171, 0.24)',
            boxShadow: [
              '0 3px 8px -1px rgba(15, 23, 42, 0.08)',
              'inset 0 1.5px 0 #ffffff',
              'inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
            ].join(', '),
            transition: theme.transitions.create(
              ['background', 'border-color', 'box-shadow', 'transform'],
              {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }
            ),
            '&:hover': {
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
              borderColor: 'rgba(0, 167, 111, 0.45)',
              boxShadow: [
                '0 6px 16px -2px rgba(0, 167, 111, 0.22)',
                'inset 0 1.5px 0 #ffffff',
              ].join(', '),
              transform: 'translateY(-1.5px)',
              '& .search-icon': {
                color: 'primary.main',
              },
            },
            '&:active': {
              transform: 'translateY(1px)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            ...theme.applyStyles('dark', {
              background:
                'linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow:
                '0 3px 8px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              '&:hover': {
                borderColor: 'rgba(0, 255, 127, 0.5)',
                boxShadow:
                  '0 0 14px rgba(0, 255, 127, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              },
              '&:active': {
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
              },
            }),
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component={smUp ? 'span' : IconButton}
        className="search-icon"
        sx={{
          [theme.breakpoints.up(breakpoint)]: {
            p: 0.75,
            display: 'inline-flex',
            color: 'text.secondary',
            transition: theme.transitions.create('color', { duration: '150ms' }),
          },
        }}
      >
        <Iconify icon="eva:search-fill" width={18} />
      </Box>

      <Label
        sx={{
          color: 'text.primary',
          cursor: 'inherit',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
          fontSize: 10,
          fontWeight: 800,
          fontFamily: 'var(--font-orbitron), "Orbitron", monospace',
          letterSpacing: 0.5,
          border: '1px solid rgba(145, 158, 171, 0.3)',
          boxShadow: '0 2px 0 #CBD5E1, 0 3px 5px rgba(0, 0, 0, 0.1), inset 0 1px 0 #ffffff',
          borderRadius: 0.75,
          height: 20,
          px: 0.8,
          display: { xs: 'none', [breakpoint]: 'inline-flex' },
          ...theme.applyStyles('dark', {
            background:
              'linear-gradient(180deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow:
              '0 2px 0 #0f172a, 0 3px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }),
        }}
      >
        ⌘K
      </Label>
    </Box>
  );

  const renderResults = () => (
    <MenuList
      disablePadding
      sx={{
        [`& .${menuItemClasses.root}`]: {
          p: 0,
          mb: 0,
          '&:hover': { bgcolor: 'transparent' },
        },
      }}
    >
      {dataFiltered.map((item) => {
        const matchesTitle = match(item.title, searchQuery, { insideWords: true });
        const partsTitle = parse(item.title, matchesTitle);

        const matchesPath = match(item.path, searchQuery, { insideWords: true });
        const partsPath = parse(item.path, matchesPath);

        return (
          <MenuItem disableRipple key={`${item.title}${item.path}`}>
            <ResultItem
              path={partsPath}
              title={partsTitle}
              href={item.path}
              labels={item.group.split('.')}
              onClick={handleClose}
            />
          </MenuItem>
        );
      })}
    </MenuList>
  );

  return (
    <>
      {renderButton()}

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        transitionDuration={{ enter: theme.transitions.duration.shortest, exit: 100 }}
        sx={[
          {
            [`& .${dialogClasses.paper}`]: { mt: 15, overflow: 'unset' },
            [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' },
          },
        ]}
      >
        <InputBase
          fullWidth
          autoFocus={open}
          placeholder="Pesquisar..."
          value={searchQuery}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" width={24} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
          inputProps={{ id: 'search-input' }}
          sx={{
            p: 3,
            borderBottom: `solid 1px ${theme.vars.palette.divider}`,
            [`& .${inputBaseClasses.input}`]: { typography: 'h6' },
          }}
        />

        {notFound ? (
          <SearchNotFound query={searchQuery} sx={{ py: 15, px: 2.5 }} />
        ) : (
          <Scrollbar sx={{ p: 2.5, height: 400 }}>{renderResults()}</Scrollbar>
        )}
      </Dialog>
    </>
  );
}
