import type { IUserItem } from 'src/types/user';

import * as z from 'zod';
import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { endpoints } from 'src/lib/axios';
import { USER_STATUS_OPTIONS } from 'src/_mock';
import { updateCitizen } from 'src/actions/identity';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = z.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório!' }),
  email: schemaUtils.email(),
  phoneNumber: z
    .string()
    .refine((val) => !val || !val.startsWith('+') || isValidPhoneNumber(val), {
      message: 'Número de telefone inválido!',
    })
    .optional()
    .or(z.literal('')),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  company: z.string().min(1, { message: 'Organização/Cargo é obrigatório!' }),
  role: z.string().min(1, { message: 'Função é obrigatória!' }),
  status: z.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: IUserItem;
};

export function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const defaultValues: UserQuickEditSchemaType = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    status: '',
    company: '',
    role: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        if (!currentUser) return;

        const nameParts = data.name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const payload = {
          firstName,
          lastName,
          cargoOsc: data.company,
          phoneNumber: data.phoneNumber || '',
          nacionalidade: data.country || 'Brasileira',
          role: data.role || 'citizen',
          kycStatus: data.status === 'active' ? 'approved' : data.status === 'rejected' ? 'rejected' : 'pending',
        };

        const updatePromise = updateCitizen(currentUser.id, payload);

        toast.promise(updatePromise, {
          loading: 'Atualizando...',
          success: 'Perfil atualizado com sucesso!',
          error: 'Erro ao atualizar o perfil.',
        });

        await updatePromise;

        await mutate(endpoints.platform.identity.list);
        onClose();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Erro ao salvar no servidor.');
      }
    },
    (errors) => {
      console.error('Validation errors:', errors);
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const error = errors[firstErrorKey as keyof typeof errors];
        toast.error(`Erro de Validação (${firstErrorKey}): ${error?.message}`);
      }
    }
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Edição Rápida</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Perfil de cidadão ativo e registrado na rede soberana da DAO
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status da Conta">
              {USER_STATUS_OPTIONS.map((status) => {
                let label = status.label;
                if (status.value === 'active') label = 'Ativo';
                if (status.value === 'pending') label = 'Pendente';
                if (status.value === 'banned') label = 'Bloqueado';
                if (status.value === 'rejected') label = 'Rejeitado';
                return (
                  <MenuItem key={status.value} value={status.value}>
                    {label}
                  </MenuItem>
                );
              })}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="name" label="Nome Completo" />
            <Field.Text name="email" label="Endereço de E-mail" disabled />
            <Field.Phone name="phoneNumber" label="Número de Telefone" />

            <Field.CountrySelect
              fullWidth
              name="country"
              label="Nacionalidade/País"
              placeholder="Escolha um país"
            />

            <Field.Text name="state" label="Estado/Região" />
            <Field.Text name="city" label="Cidade" />
            <Field.Text name="address" label="Endereço" />
            <Field.Text name="zipCode" label="CEP" />
            <Field.Text name="company" label="Organização/Cargo" />
            <Field.Text name="role" label="Função (role)" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
