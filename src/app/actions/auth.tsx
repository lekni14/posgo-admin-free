import { RegisterSchema, RegisterForm, LoginForm } from "@/lib/schemas/auth";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signup(state: RegisterForm, formData: FormData) {
  // Validate form fields
  const validatedFields = RegisterSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Prepare data for insertion into database
  const { firstName, lastName, email, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
  //   const data = await db
  //     .insert(users)
  //     .values({
  //       name,
  //       email,
  //       password: hashedPassword,
  //     })
  //     .returning({ id: users.id });

  const user: never[] = [];

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }
  // 4. Create user session
  await createSession(user.id);
  // 5. Redirect user
  redirect("/profile");
}
export async function signin(state: LoginForm, formData: FormData) {
  // Validate form fields
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Prepare data for insertion into database
  const { username,  password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
  //   const data = await db
  //     .insert(users)
  //     .values({
  //       name,
  //       email,
  //       password: hashedPassword,
  //     })
  //     .returning({ id: users.id });

  const user: never[] = [];

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }
  // 4. Create user session
  await createSession(user.id);
  // 5. Redirect user
  redirect("/profile");
}
export async function logout() {
  await deleteSession();
  redirect("/login");
}
