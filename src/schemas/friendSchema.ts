import { z } from 'zod';

export const friendSchema = z.object({
    id: z.string()
});