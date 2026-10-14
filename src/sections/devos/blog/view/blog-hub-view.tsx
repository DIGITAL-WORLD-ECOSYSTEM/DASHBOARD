import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { PostListView, PostCreateView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export function BlogHubView() {
  const [currentTab, setCurrentTab] = useState<'posts' | 'create'>('posts');

  return (
    <Stack spacing={2.5}>
      {/* 1. CABEÇALHO */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Central de Conteúdo & Blog Institucional
          </Typography>
          <Chip
            label="COMUNICAÇÃO & EDITORIAL"
            size="small"
            color="primary"
            variant="soft"
            sx={{ fontWeight: 800, fontSize: '0.68rem' }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gestão editorial, publicação de notícias, artigos institucionais e comunicados oficiais da DAO.
        </Typography>
      </Box>

      {/* 2. NAVEGAÇÃO POR ABAS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              minHeight: 44,
              fontWeight: 700,
              fontSize: '0.85rem',
            },
          }}
        >
          <Tab
            value="posts"
            icon={<Iconify icon={'solar:document-text-bold' as any} width={20} />}
            iconPosition="start"
            label="Artigos Publicados"
          />
          <Tab
            value="create"
            icon={<Iconify icon={'solar:pen-new-square-bold' as any} width={20} />}
            iconPosition="start"
            label="Novo Artigo"
          />
        </Tabs>
      </Box>

      {/* 3. CONTEÚDO DINÂMICO */}
      {currentTab === 'posts' && <PostListView />}
      {currentTab === 'create' && <PostCreateView />}
    </Stack>
  );
}
