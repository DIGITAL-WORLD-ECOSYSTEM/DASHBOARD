import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';

import { FormResendCode } from '../../components/form-resend-code';

// ----------------------------------------------------------------------

const NEON_GREEN = '#00E5BC';

export function JwtVerifyView() {
  return (
    <Box
      sx={{
        p: 4,
        width: 1,
        borderRadius: 2,
        backgroundColor: '#0A0D10',
        border: `1px solid ${NEON_GREEN}`,
        boxShadow: `0 0 15px rgba(0, 229, 188, 0.3)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
           <EmailInboxIcon sx={{ width: 96, height: 96, color: NEON_GREEN, filter: `drop-shadow(0 0 10px ${NEON_GREEN})` }} />
        </Box>
        <Typography variant="h5" sx={{ color: NEON_GREEN, mb: 1, fontWeight: 'bold' }}>
          VERIFIQUE SEU E-MAIL
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          Enviamos um link de confirmação para o seu endereço de e-mail. Por favor, siga as instruções para ativar sua conta.
        </Typography>
      </Box>

      <Button
        fullWidth
        size="large"
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        variant="outlined"
        sx={{
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          letterSpacing: 2,
          color: '#FFF',
          borderColor: NEON_GREEN,
          boxShadow: `0 0 10px ${NEON_GREEN}`,
          '&:hover': {
            borderColor: NEON_GREEN,
            backgroundColor: 'rgba(0, 229, 188, 0.1)',
            boxShadow: `0 0 20px ${NEON_GREEN}`,
          }
        }}
      >
        IR PARA O LOGIN
      </Button>

      <FormResendCode onResendCode={() => {}} value={0} disabled={false} sx={{ color: NEON_GREEN, '& .MuiButton-root': { color: NEON_GREEN, fontWeight: 'bold' } }} />

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link 
          component={RouterLink} 
          href={paths.auth.jwt.signIn} 
          sx={{ color: NEON_GREEN, fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" />
          VOLTAR PARA O LOGIN
        </Link>
      </Box>
    </Box>
  );
}
