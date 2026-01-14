import { z } from "zod";

// receive Schema
export const createUserSchema = z.object({
  username: z
    .string()
    .min(1, "กรุณากรอกชื่อผู้ใช้")
    .min(3, "ต้องมีอย่างน้อย 3 ตัวอักษร"),
  first_name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  last_name: z
    .string()
    .min(1, "กรุณากรอกนามสกุล")
    .min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  mobile: z.string().min(1, 'กรุณากรอกอีเมล'),
  newPassword: z
    .string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/[A-Z]/, "ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่อย่างน้อย 1 ตัว")
    .regex(/[a-z]/, "ต้องมีตัวอักษรภาษาอังกฤษตัวเล็กอย่างน้อย 1 ตัว")
    .regex(/[0-9]/, "ต้องมีตัวเลขอย่างน้อย 1 ตัว"),
  confirmNewPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่"),
});

export type createUserForm = z.infer<typeof createUserSchema>;
