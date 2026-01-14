"use server";
import { SignJWT, jwtVerify } from "jose";
// import { RegisterForm } from "@/lib/schemas/auth";
import { cookies } from "next/headers";
// import { UserData } from "@/services/user.service";
import { UserData, LoginResponse } from "@/services/auth.service";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: UserData) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}
export async function createSession(param: LoginResponse) {
  console.log(param)
  // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const expiresAt = new Date(param.expiredAt);
  const userId = param.userInfo.id;
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("accessToken", param.accessToken);
  cookieStore.set("refreshToken", param.accessToken);
}
export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
