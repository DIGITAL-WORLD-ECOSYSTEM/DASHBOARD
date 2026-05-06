import type { TextFieldProps } from '@mui/material/TextField';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

type Multiple = boolean | undefined;
type DisableClearable = boolean | undefined;
type FreeSolo = boolean | undefined;

type ExcludedProps = 'renderInput';

export type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, Multiple, DisableClearable, FreeSolo>,
  ExcludedProps
>;

export type RHFAutocompleteProps = AutocompleteBaseProps & {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  slotProps?: AutocompleteBaseProps['slotProps'] & {
    textField?: Partial<TextFieldProps>;
  };
};

export function RHFAutocomplete({
  name,
  label,
  slotProps,
  helperText,
  placeholder,
  ...other
}: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  const { textField, ...otherSlotProps } = slotProps ?? {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { ref, ...fieldProps } = field;

        return (
          <Autocomplete
            {...fieldProps}
            id={`${name}-rhf-autocomplete`}
            onChange={(event, newValue) => field.onChange(newValue)}
            onBlur={(event) => field.onBlur()}
            renderInput={(params) => (
              <TextField
                {...params}
                {...textField}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message ?? helperText}
                inputRef={ref}
                slotProps={{
                  ...textField?.slotProps,
                  htmlInput: {
                    ...textField?.slotProps?.htmlInput,
                    autoComplete: 'new-password',
                  },
                }}
              />
            )}
            slotProps={{
              ...otherSlotProps,
              chip: {
                size: 'small',
                variant: 'soft',
                ...otherSlotProps?.chip,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
