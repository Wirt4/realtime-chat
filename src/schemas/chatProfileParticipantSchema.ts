import { z } from 'zod';

export const chatProfileParticpantSchema = z.object({
    participants: z.array(z.string())
});
