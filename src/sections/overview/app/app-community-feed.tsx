import type { FeedItem } from 'src/types/home';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { fToNow } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  list: FeedItem[];
};

export function AppCommunityFeed({ title, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title || 'Feed Institucional'} sx={{ mb: 2 }} />

      <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
        {list.map((item) => (
          <FeedItemView key={item.id} item={item} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

function FeedItemView({ item }: { item: FeedItem }) {
  const getIcon = () => {
    switch (item.type) {
      case 'announcement':
        return { icon: 'solar:megaphone-bold', color: 'info.main' };
      case 'event':
        return { icon: 'solar:calendar-bold', color: 'warning.main' };
      case 'proposal':
        return { icon: 'solar:archive-bold', color: 'primary.main' };
      case 'project':
        return { icon: 'solar:rocket-bold', color: 'success.main' };
      case 'achievement':
        return { icon: 'solar:medal-star-bold', color: 'warning.dark' };
      case 'partnership':
        return { icon: 'solar:hand-shake-bold', color: 'secondary.main' };
      default:
        return { icon: 'solar:bell-bing-bold', color: 'text.secondary' };
    }
  };

  const { icon, color } = getIcon();

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Avatar sx={{ bgcolor: 'background.neutral', color }}>
        <Iconify icon={icon as any} width={24} />
      </Avatar>

      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{item.title}</Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {item.content}
        </Typography>

        <Stack direction="row" spacing={1} sx={{  alignItems: "center" ,  mt: 1  }}>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {fToNow(item.createdAt)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            •
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'fontWeightBold' }}>
            {item.authorName || 'Equipe Institucional'}
          </Typography>
        </Stack>

        {item.actionLabel && (
          <Box sx={{ mt: 1 }}>
            <Button size="small" variant="soft" color="inherit">
              {item.actionLabel}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
