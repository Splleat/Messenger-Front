import { z } from 'zod';
import { FormState } from '@/types/common';

export function validateFormData<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    formData: FormData
): { success : true; data: z.infer<z.ZodObject<T>> } | { success: false; state: FormState } {
    const rawData = Object.fromEntries(formData);
    const parsed = schema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            state: { error: parsed.error.issues[0].message },
        }
    }

    return { success: true, data: parsed.data };
}