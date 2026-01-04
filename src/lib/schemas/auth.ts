import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, 'กรุณากรอกชื่อผู้ใช้หรืออีเมล').min(3, 'ต้องมีอย่างน้อย 3 ตัวอักษร'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน').min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

export type LoginForm = z.infer<typeof loginSchema>;

// Registration Schema
export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, 'กรุณากรอกชื่อ').min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุล').min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'),
    email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z
      .string()
      .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      .regex(/[A-Z]/, 'ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่อย่างน้อย 1 ตัว')
      .regex(/[a-z]/, 'ต้องมีตัวอักษรภาษาอังกฤษตัวเล็กอย่างน้อย 1 ตัว')
      .regex(/[0-9]/, 'ต้องมีตัวเลขอย่างน้อย 1 ตัว'),
    confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  });

export type RegisterForm = z.infer<typeof RegisterSchema>;

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
});

export type PasswordResetForm = z.infer<typeof passwordResetSchema>;

// New Password Schema
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      .regex(/[A-Z]/, 'ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่อย่างน้อย 1 ตัว')
      .regex(/[a-z]/, 'ต้องมีตัวอักษรภาษาอังกฤษตัวเล็กอย่างน้อย 1 ตัว')
      .regex(/[0-9]/, 'ต้องมีตัวเลขอย่างน้อย 1 ตัว'),
    confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  });

export type NewPasswordForm = z.infer<typeof newPasswordSchema>;

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อ').min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล').min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'),
  email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
});

export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
    newPassword: z
      .string()
      .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      .regex(/[A-Z]/, 'ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่อย่างน้อย 1 ตัว')
      .regex(/[a-z]/, 'ต้องมีตัวอักษรภาษาอังกฤษตัวเล็กอย่างน้อย 1 ตัว')
      .regex(/[0-9]/, 'ต้องมีตัวเลขอย่างน้อย 1 ตัว'),
    confirmNewPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่านใหม่'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'รหัสผ่านใหม่ไม่ตรงกัน',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
