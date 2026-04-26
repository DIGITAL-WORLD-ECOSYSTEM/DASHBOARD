import * as z from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { fIsAfter } from 'src/utils/format-time';

import { schemaUtils } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type FieldsSchemaType = z.infer<typeof FieldsSchema>;

export const FieldsSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: 'Full name is required!' })
      .min(6, { message: 'Mininum 6 characters!' })
      .max(32, { message: 'Maximum 32 characters!' }),
    email: schemaUtils.email(),
    age: schemaUtils.nullableInput(
      z.coerce
        .number()
        .int()
        .min(1, { message: 'Age is required!' })
        .min(18, { message: 'Age must be between 18 and 80' })
        .max(80, { message: 'Age must be between 18 and 80' }),
      { message: 'Age is required!' }
    ),
    price: schemaUtils.nullableInput(
      z.coerce.number().min(1, { message: 'Price is required!' }).optional(),
      { message: 'Price is required!' }
    ),
    quantity: schemaUtils.nullableInput(
      z.coerce
        .number()
        .min(1, { message: 'Quantity is required!' })
        .max(99, { message: 'Quantity must be between 1 and 99' }),
      { message: 'Quantity is required!' }
    ),
    // phone
    phoneNumber: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
    // code
    code: z
      .string()
      .min(1, { message: 'Code is required!' })
      .min(6, { message: 'Code must be at least 6 characters!' }),
    // date
    startDate: schemaUtils.date({ message: { required: 'Start date is required!' } }),
    endDate: schemaUtils.date({ message: { required: 'End date is required!' } }),
    // password
    password: z
      .string()
      .min(1, { message: 'Password is required!' })
      .min(6, { message: 'Password is too short!' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required!' }),
    // autocomplete
    singleAutocomplete: schemaUtils.nullableInput(z.custom<{ value: string; label: string }>(), {
      message: 'Autocomplete is required!',
    }),
    multiAutocomplete: z.array(z.object({ value: z.string(), label: z.string() })).min(2, {
      message: 'Must have at least 2 items!',
    }),
    // country
    singleCountry: z.string().min(1, { message: 'Single country is required!' }),
    multiCountry: z.string().array().min(2, { message: 'Must have at least 2 items!' }),
    // select
    singleSelect: z.string().min(1, { message: 'Single select is required!' }),
    multiSelect: z.string().array().min(2, { message: 'Must have at least 2 items!' }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  })
  .refine((val) => !fIsAfter(val.startDate, val.endDate), {
    message: 'End date cannot be earlier than start date!',
    path: ['endDate'],
  });

// ----------------------------------------------------------------------

export type ControlsSchemaType = z.infer<typeof ControlsSchema>;

export const ControlsSchema = z.object({
  // rating
  rating: z.number().min(1, { message: 'Rating is required!' }),
  // radio
  radioGroup: z.string().min(1, { message: 'Choose at least one option!' }),
  // checkbox
  checkbox: schemaUtils.boolean({ message: 'Checkbox is required!' }),
  multiCheckbox: z.string().array().min(1, { message: 'Choose at least one option!' }),
  // switch
  switch: schemaUtils.boolean({ message: 'Switch is required!' }),
  multiSwitch: z.string().array().min(1, { message: 'Choose at least one option!' }),
  // slider
  slider: z.number().min(10, { message: 'Mininum value is >= 10' }),
  sliderRange: schemaUtils.sliderRange({
    min: 20,
    max: 80,
  }),
});

// ----------------------------------------------------------------------

export type OtherSchemaType = z.infer<typeof OtherSchema>;

export const OtherSchema = z.object({
  editor: z
    .string()
    .min(100, { message: 'Content must be at least 100 characters' })
    .max(500, { message: 'Content must be less than 500 characters' })
    .refine(
      (val) => {
        const cleanedValue = val.trim();
        return cleanedValue !== '' && cleanedValue !== '<p></p>';
      },
      { message: 'Content is required!' }
    ),
  singleUpload: schemaUtils.file({ message: 'Single upload is required!' }),
  multiUpload: schemaUtils.files({ message: 'Multi upload is required!' }).min(2, {
    message: 'Must have at least 2 items!',
  }),
});
