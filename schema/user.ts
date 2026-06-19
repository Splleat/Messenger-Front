import { nameSchema } from '@/schema/common';
import { z } from 'zod';

export const userProfileUpdateSchema = z.object({name: nameSchema})