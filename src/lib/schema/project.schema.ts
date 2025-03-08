import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Nama proyek minimal 2 karakter"),
  description: z.string().optional(),
  ownerId: z.number().int("ID pemilik harus bilangan bulat").optional(),
  memberIds: z.array(z.number().int()).optional()
})