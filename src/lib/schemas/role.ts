import { z } from "zod";

// receive Schema
export const createRoleSchema = z.object({
  role_name: z
    .string()
    .min(1, "กรุณากรอกข้อมูล")
    .min(3, "ต้องมีอย่างน้อย 3 ตัวอักษร")
    ,
  
});

export type createRoleForm = z.infer<typeof createRoleSchema>;