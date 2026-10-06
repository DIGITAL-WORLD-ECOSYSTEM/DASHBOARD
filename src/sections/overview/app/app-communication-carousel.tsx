import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import type { HomeAnnouncement } from 'src/types/home';

import { useMemo } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

const PRIORITY_WEIGHT = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

type Props = CardProps & {
  list: HomeAnnouncement[];
};

export function AppCommunicationCarousel({ list, sx, ...other }: Props) {
  const carousel = useCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 6000 })]);

  // Motor de Lógica: Filtra vencidos e ordena por prioridade
  const activeAnnouncements = useMemo(() => {
    const now = new Date().getTime();

    const valid = list.filter((item) => {
      if (!item.published) return false;
      const start = new Date(item.startsAt).getTime();
      const end = new Date(item.endsAt).getTime();
      return now >= start && now <= end;
    });

    return valid.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  }, [list]);

  if (!activeAnnouncements.length) return null;

  return (
    <Card
      sx={[
        (theme) => ({
          bgcolor: 'common.black',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: [
            '0 24px 60px -12px rgba(15, 23, 42, 0.25)',
            '0 8px 24px -4px rgba(15, 23, 42, 0.12)',
            'inset 0 1.5px 0 rgba(255, 255, 255, 0.6)',
            'inset 0 -1.5px 0 rgba(0, 0, 0, 0.3)',
          ].join(', '),

          // ✨ REFLEXO GLOSSY DIAGONAL 3D (WET GLASS SHEEN)
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            borderRadius: 'inherit',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 10,
          },

          // 💡 FILETE INFERIOR HOLOGRÁFICO
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background:
              'linear-gradient(90deg, rgba(0, 167, 111, 0.65) 0%, rgba(255, 255, 255, 0.2) 35%, rgba(0, 210, 255, 0.6) 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          },

          ...theme.applyStyles('dark', {
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: [
              '0 24px 64px -12px rgba(0, 0, 0, 0.85)',
              'inset 0 1.5px 0 rgba(255, 255, 255, 0.25)',
            ].join(', '),
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <CarouselDotButtons
        scrollSnaps={carousel.dots.scrollSnaps}
        selectedIndex={carousel.dots.selectedIndex}
        onClickDot={carousel.dots.onClickDot}
        sx={{
          top: 16,
          left: 16,
          position: 'absolute',
          color: 'primary.light',
          zIndex: 12,
        }}
      />

      <CarouselArrowBasicButtons
        {...carousel.arrows}
        options={carousel.options}
        sx={{
          top: 12,
          right: 12,
          position: 'absolute',
          color: 'common.white',
          zIndex: 12,
          p: 0.5,
          borderRadius: 1.5,
          backdropFilter: 'blur(12px)',
          bgcolor: 'rgba(15, 23, 42, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        }}
      />

      <Carousel carousel={carousel}>
        {activeAnnouncements.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = BoxProps & {
  item: HomeAnnouncement;
};

function CarouselItem({ item, sx, ...other }: CarouselItemProps) {
  const isCritical = item.priority === 'critical';

  // Fallback image based on priority if no image provided
  const coverUrl = item.image || `${CONFIG.assetsDir}/assets/background/background-5.webp`;

  return (
    <Box
      sx={[
        {
          width: 1,
          position: 'relative',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          gap: 2,
          width: 1,
          bottom: 0,
          zIndex: 9,
          display: 'flex',
          position: 'absolute',
          color: 'common.white',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Typography
          variant="overline"
          sx={(theme) => ({
            px: 1.25,
            py: 0.5,
            borderRadius: 1.25,
            fontWeight: 800,
            letterSpacing: 1,
            color: isCritical ? '#ff5630' : theme.palette.text.primary,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(248, 250, 252, 0.72) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15), inset 0 1.5px 0 #ffffff',
            ...theme.applyStyles('dark', {
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: isCritical ? '#ff5630' : '#ffffff',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }),
          })}
        >
          {isCritical ? '🚨 URGENTE' : '📰 COMUNICADO'}
        </Typography>

        <Typography variant="h4" sx={{ whiteSpace: 'pre-line', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
          {item.title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.88, maxWidth: 520, textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}>
          {item.description}
        </Typography>

        {item.actionLabel && (
          <Button
            component={RouterLink}
            href={item.actionRoute || '#'}
            variant="contained"
            color={isCritical ? 'error' : 'primary'}
            sx={{
              mt: 1,
              px: 2.75,
              py: 1,
              borderRadius: 1.5,
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: (theme) => [
                isCritical
                  ? '0 8px 24px -4px rgba(255, 86, 48, 0.55)'
                  : '0 8px 24px -4px rgba(0, 167, 111, 0.55)',
                'inset 0 1.5px 0 rgba(255, 255, 255, 0.4)',
                'inset 0 -1.5px 0 rgba(0, 0, 0, 0.2)',
              ].join(', '),
              transition: (theme) =>
                theme.transitions.create(['transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
              '&:hover': {
                transform: 'translateY(-2px) scale(1.03)',
                boxShadow: isCritical
                  ? '0 12px 30px -4px rgba(255, 86, 48, 0.7), inset 0 1.5px 0 rgba(255, 255, 255, 0.5)'
                  : '0 12px 30px -4px rgba(0, 167, 111, 0.7), inset 0 1.5px 0 rgba(255, 255, 255, 0.5)',
              },
              '&:active': {
                transform: 'translateY(1px)',
              },
            }}
          >
            {item.actionLabel}
          </Button>
        )}
      </Box>

      <Image
        alt={item.title}
        src={coverUrl}
        slotProps={{
          overlay: {
            sx: (theme) => ({
              backgroundImage: `linear-gradient(to bottom, transparent 0%, ${
                isCritical ? theme.vars.palette.error.darker : theme.vars.palette.common.black
              } 90%)`,
              opacity: isCritical ? 0.9 : 0.8,
            }),
          },
        }}
        sx={{ width: 1, height: { xs: 320, xl: 360 } }}
      />
    </Box>
  );
}
