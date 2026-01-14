"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { cache } from "react";
import { authService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
// import { decrypt } from './session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const token = (await cookies()).get("accessToken")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId, token: token  };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const {
      data: user, // Rename 'data' to 'user' for clarity
      isLoading, // Boolean indicating the query is currently fetching for the first time
      isFetching, // Boolean indicating the query is fetching in the background
      error, // Error object if the request fails
      isSuccess, // Boolean indicating a successful query
    } = useQuery({
      queryKey: ["user", session?.userId], // Unique key that changes if userId changes
      queryFn: () => authService.getById(String(session?.userId)), // The function that fetches the data
      enabled: !!session?.userId, // Optional: only run the query if userId is truthy
    });
    // const data = await db.query.users.findMany({
    //   where: eq(users.id, session.userId),
    //   // Explicitly return the columns you need rather than the whole user object
    //   columns: {
    //     id: true,
    //     name: true,
    //     email: true,
    //   },
    // })

    // const user = data;

    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
