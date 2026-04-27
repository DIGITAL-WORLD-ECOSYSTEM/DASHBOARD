import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';


// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: schemaUtils.email(),
});

// ----------------------------------------------------------------------

const NEON_GREEN = '#00E5BC';

export function JwtResetPasswordView() {
  const defaultValues: ResetPasswordSchemaType = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="E-mail de Recuperação"
        placeholder="usuario@mundodigital.com"
        autoFocus
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
        ENVIAR SOLICITAÇÃO
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
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
           <PasswordIcon sx={{ width: 64, height: 64, color: NEON_GREEN, filter: `drop-shadow(0 0 10px ${NEON_GREEN})` }} />
        </Box>
        <Typography variant="h5" sx={{ color: NEON_GREEN, mb: 1, fontWeight: 'bold' }}>
          ESQUECEU A SENHA?
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          Insira o e-mail associado à sua conta e enviaremos um link de recuperação.
        </Typography>
      </Box>

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

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
