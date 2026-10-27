import z from 'zod';

export const registerSchema = z.strictObject({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
  age: z.number().min(0),
});