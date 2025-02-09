import { z } from 'zod'

export const idToRemoveSchema = z.object({ idToRemove: z.string() });
