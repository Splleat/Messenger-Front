import { z } from 'zod';

export const nameSchema = z.string()
    .min(2, { message: '최소 2자 이상 입력해야 합니다.'})
    .max(20, { message: '최대 20자 이하로 입력해야 합니다.'});

export const idSchema = z.string()
    .min(1, { message: '아이디는 필수 입력 사항입니다.'});