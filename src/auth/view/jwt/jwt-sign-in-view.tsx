import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { signInWithWeb3, signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignInSchema = z.object({
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'A senha é obrigatória!' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

const NEON_GREEN = '#00E5BC';

export function JwtSignInView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const handleWeb3Login = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Instale a MetaMask para continuar.');
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      await signInWithWeb3(address);
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    const { serverUrl } = CONFIG;
    window.location.href = `${serverUrl}/api/core/identity/oauth/${provider}/login`;
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text 
        name="email" 
        label="E-mail" 
        placeholder="usuario@mundodigital.com"
        slotProps={{ 
          inputLabel: { shrink: true, sx: { color: NEON_GREEN } },
          input: {
            sx: {
              borderRadius: 1,
              '& fieldset': { borderColor: 'rgba(0, 229, 188, 0.2)' },
              '&:hover fieldset': { borderColor: `${NEON_GREEN} !important` },
              '&.Mui-focused fieldset': { borderColor: `${NEON_GREEN} !important` },
            }
          }
        }} 
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="password"
          label="Senha"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true, sx: { color: NEON_GREEN } },
            input: {
              sx: {
                borderRadius: 1,
                '& fieldset': { borderColor: 'rgba(0, 229, 188, 0.2)' },
                '&:hover fieldset': { borderColor: `${NEON_GREEN} !important` },
                '&.Mui-focused fieldset': { borderColor: `${NEON_GREEN} !important` },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end" sx={{ color: NEON_GREEN }}>
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: 'grey.500' }}>
          Novo na DAO?{' '}
          <Link component={RouterLink} href={paths.auth.jwt.signUp} sx={{ color: NEON_GREEN, fontWeight: 'bold', textDecoration: 'none' }}>
            SOLICITAR
          </Link>
        </Typography>
        <Link
          component={RouterLink}
          href="#"
          variant="caption"
          sx={{ color: NEON_GREEN, fontWeight: 'bold', textDecoration: 'none' }}
        >
          ESQUECEU A SENHA?
        </Link>
      </Box>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="outlined"
        loading={isSubmitting}
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
        ENTRAR NO PORTAL
      </Button>
    </Box>
  );

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
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <Divider sx={{ my: 2, '&::before, &::after': { borderColor: 'grey.800' } }}>
        <Typography variant="caption" sx={{ color: 'grey.500', letterSpacing: 2, fontWeight: 'bold' }}>
          OU CONTINUE COM
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleSocialLogin('google')}
          startIcon={<Iconify icon={"logos:google-icon" as any} />}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleSocialLogin('github')}
          startIcon={<Iconify icon={"logos:github-icon" as any} />}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          GitHub
        </Button>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleWeb3Login}
        startIcon={<Iconify icon={"logos:metamask-icon" as any} />}
        sx={{ 
          color: NEON_GREEN, 
          borderColor: NEON_GREEN,
          '&:hover': {
            borderColor: NEON_GREEN,
            backgroundColor: 'rgba(0, 229, 188, 0.05)',
          }
        }}
      >
        WEB3 WALLET (SIWE)
      </Button>
    </Box>
  );
}
