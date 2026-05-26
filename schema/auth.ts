import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email('올바른 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

export const registerSchema = z.object({
    email: z.email('올바른 이메일을 입력하세요'),
    name: z
        .string()
        .min(2, '이름은 2자 이상이어야 합니다.')
        .max(50, '이름은 50자 이하여야 합니다.'),
    password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
        .max(72, '비밀번호는 72자 이하여야 합니다.'),
});
