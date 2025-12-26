import { z } from 'zod';

export const SignupSchema = z.object({
  userName: z.string(),
  password: z.string().min(6).max(60),
});

export type SignupFormData = z.infer<typeof SignupSchema>;
