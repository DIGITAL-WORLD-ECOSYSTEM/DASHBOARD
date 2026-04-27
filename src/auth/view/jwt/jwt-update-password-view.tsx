import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { FormResendCode } from '../../components/form-resend-code';

// ----------------------------------------------------------------------

export type UpdatePasswordSchemaType = z.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, { message: 'O código é obrigatório!' })
      .min(6, { message: 'O código deve ter pelo menos 6 caracteres!' }),
    email: schemaUtils.email(),
    password: z
      .string()
      .min(1, { message: 'A senha é obrigatória!' })
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
    confirmPassword: z.string().min(1, { message: 'A confirmação de senha é obrigatória!' }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: 'As senhas não coincidem!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

const NEON_GREEN = '#00E5BC';

export function JwtUpdatePasswordView() {
  const showPassword = useBoolean();

  const defaultValues: UpdatePasswordSchemaType = {
    code: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
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

      <Box sx={{ p: 2, border: `1px dashed rgba(0, 229, 188, 0.2)`, borderRadius: 1 }}>
        <Typography variant="caption" sx={{ color: NEON_GREEN, mb: 1, display: 'block' }}>CÓDIGO DE VERIFICAÇÃO</Typography>
        <Field.Code name="code" />
      </Box>

      <Field.Text
        name="password"
        label="Nova Senha"
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
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirmar Nova Senha"
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
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
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
        ATUALIZAR SENHA
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
           <SentIcon sx={{ width: 64, height: 64, color: NEON_GREEN, filter: `drop-shadow(0 0 10px ${NEON_GREEN})` }} />
        </Box>
        <Typography variant="h5" sx={{ color: NEON_GREEN, mb: 1, fontWeight: 'bold' }}>
          SOLICITAÇÃO ENVIADA!
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          Enviamos um código de confirmação de 6 dígitos para o seu e-mail. Por favor, insira o código abaixo para redefinir sua senha.
        </Typography>
      </Box>

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

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
