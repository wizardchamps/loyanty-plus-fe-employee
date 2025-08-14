import * as yup from 'yup'

export const basicInfoSchema = yup.object({
  name: yup
    .string()
    .required('Store name is required')
    .min(2, 'Store name must be at least 2 characters')
    .max(100, 'Store name must be less than 100 characters'),
  address: yup
    .string()
    .required('Store address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
  image: yup
    .mixed()
    .nullable()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true
      return value instanceof File ? value.size <= 5 * 1024 * 1024 : true
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true
      return value instanceof File ? value.type.startsWith('image/') : true
    })
})

export const loyaltySettingsSchema = yup.object({
  moneyPerPoint: yup
    .number()
    .required('Money per point is required')
    .positive('Money per point must be a positive number')
    .min(0.01, 'Minimum value is 0.01')
    .max(1000, 'Maximum value is 1000')
    .typeError('Money per point must be a valid number'),
  rounding: yup
    .boolean()
    .required('Rounding setting is required')
})

export type BasicInfoFormData = yup.InferType<typeof basicInfoSchema>
export type LoyaltySettingsFormData = yup.InferType<typeof loyaltySettingsSchema>

// New schemas for Create Transaction page
export const customerCodeSchema = yup.object({
  customerCode: yup
    .string()
    .required('Customer code is required')
    .min(4, 'Customer code must be at least 4 characters')
    .max(50, 'Customer code must be less than 50 characters')
})

// Transaction type enum
export enum TransactionType {
  EARN = 'earn',
  REDEEM = 'redeem'
}

export const transactionInfoSchema = yup.object({
  type: yup
    .string()
    .oneOf(Object.values(TransactionType), 'Invalid transaction type')
    .required('Transaction type is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be a positive number')
    .typeError('Amount must be a valid number'),
  description: yup
    .string()
    .max(250, 'Description must be less than 250 characters')
    .required('Description is required'),
  externalTransactionId: yup
    .string()
    .max(100, 'External transaction ID must be less than 100 characters')
    .optional()
    .nullable(),
})

export type CustomerCodeFormData = yup.InferType<typeof customerCodeSchema>
export type TransactionInfoFormData = yup.InferType<typeof transactionInfoSchema>
