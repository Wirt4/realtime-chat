import { z } from 'zod';

const senderHeaderSchema = z.object({
    id: z.string(),
    sender: z.string()
});

type SenderHeader = z.infer<typeof senderHeaderSchema>;

export { senderHeaderSchema, type SenderHeader };
