import { z } from 'zod';
import { idSchema, nameSchema } from '@/schema/common';

export const groupCreateSchema = z.object({ groupName: nameSchema });
export const channelCreateSchema = z.object({ channelName: nameSchema });
export const inviteSchema = z.object({ targetId: idSchema })