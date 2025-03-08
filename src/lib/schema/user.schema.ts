import { z } from "zod";

export const userSchema = z.object({
  name: z.string()
  .min(2, { message: "Nama minimal 2 karakter" })
  .max(50, { message: "Nama maksimal 50 karakter" })
  .regex(/^[a-zA-Z\s]+$/, { message: "Nama hanya boleh huruf" }),

email: z.string()
  .email({ message: "Format email tidak valid" })
  .max(100, { message: "Email terlalu panjang" }),

username: z.string()
  .min(3, { message: "Username minimal 3 karakter" })
  .max(20, { message: "Username maksimal 20 karakter" })
  .regex(/^[a-zA-Z0-9_]+$/, { 
    message: "Username hanya boleh huruf, angka, dan underscore" 
  }),

password: z.string()
  .min(8, { message: "Password minimal 8 karakter" })
  .max(50, { message: "Password maksimal 50 karakter" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password harus mengandung huruf besar, kecil, angka, dan karakter spesial"
  }),

role: z.string()
})
