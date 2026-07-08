import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';
import { useMockedUser } from 'src/auth/hooks';

// Mocks Data
import { 
  _homeAnnouncements, 
  _homeFeeds, 
  _activeProjects, 
  _opportunities, 
  _weeklyRecognitions 
} from 'src/_mock/_home';

// Novos Componentes da Comunidade
import { AppCommunicationCarousel } from '../app-communication-carousel';
import { AppPriorityAlerts } from '../app-priority-alerts';
import { AppMyActions } from '../app-my-actions';
import { AppOnboarding } from '../app-onboarding';
import { AppCommunityFeed } from '../app-community-feed';

import { AppChatHubSummary } from '../app-chat-hub-summary';
import { AppGovernanceHighlight } from '../app-governance-highlight';
import { AppActiveProjects } from '../app-active-projects';
import { AppOpportunities } from '../app-opportunities';
import { AppUpcomingEvents } from '../app-upcoming-events';
import { AppWeeklyRecognition } from '../app-weekly-recognition';
import { AppNetworkGrowth, AppEcosystemNumbers } from '../app-ecosystem-numbers';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();
  const theme = useTheme();

  // Exemplo de Role Based Dashboard Rendering
  // admin, user, partner, etc.
  const role = user?.role || 'user';
  
  const isAdmin = role === 'admin';
  const isPartner = role === 'partner';
  const isMember = role === 'user';

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* CAROUSEL INSTITUCIONAL (100% da largura útil) */}
        <Grid size={{ xs: 12 }}>
          <AppCommunicationCarousel list={_homeAnnouncements} />
        </Grid>

        {/* COLUNA ESQUERDA (Principal 8/12) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            
            {/* Alertas Prioritários */}
            <AppPriorityAlerts />

            {/* Ações Pendentes */}
            {isMember && <AppMyActions />}
            {isAdmin && <AppMyActions />} {/* Admin poderia ver aprovações aqui */}

            {/* Primeiros Passos / Onboarding */}
            {isMember && <AppOnboarding />}

            {/* Feed Institucional */}
            <AppCommunityFeed list={_homeFeeds} />

          </Box>
        </Grid>

        {/* COLUNA DIREITA (Secundária 4/12) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            
            {/* Parceiros priorizam Oportunidades no topo */}
            {isPartner && <AppOpportunities list={_opportunities} />}

            {/* Ecossistema e Rede */}
            <AppEcosystemNumbers />
            <AppNetworkGrowth />

            {/* Destaques e Chat */}
            <AppGovernanceHighlight />
            <AppChatHubSummary />

            {/* Projetos */}
            <AppActiveProjects list={_activeProjects} />

            {/* Eventos e Reconhecimentos */}
            <AppUpcomingEvents />
            <AppWeeklyRecognition list={_weeklyRecognitions} />
            
            {/* Oportunidades (para Membros não parceiros fica mais embaixo) */}
            {!isPartner && <AppOpportunities list={_opportunities} />}
            
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
