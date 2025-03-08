import { z } from 'zod';

/**
 * Sign-in form validation schema
 */
export const signInSchema = z.object({
  login: z.string()
    .min(5, 'Username must be at least 5 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

/**
 * Sign-up form validation schema
 */
export const signUpSchema = z
  .object({
    login: z.string()
      .min(5, 'Username must be at least 5 characters')
      .max(50, 'Username cannot exceed 50 characters'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z.string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Password reset form validation schema
 */
export const passwordResetSchema = z
  .object({
    login: z.string()
      .min(5, 'Username must be at least 5 characters')
      .max(50, 'Username cannot exceed 50 characters'),
    currentPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    newPassword: z.string()
      .min(8, 'New password must be at least 8 characters')
      .max(100, 'New password cannot exceed 100 characters'),
    confirmNewPassword: z.string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }); 