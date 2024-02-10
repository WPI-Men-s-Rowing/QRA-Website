"use server";

import { auth } from "@/lib/utils/auth";
import { LuciaError } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Asynchronous server action to attempt to login. Redirects and sets the appropriate cookie
 * if successful, otherwise, returns a serialized object containing the error message
 * @param formData
 * @returns a serialized JSON object containing the form error, when appropriate
 */
export async function login(_: unknown, formData: FormData) {
  // Get the username and password from the form data
  const email = formData.get("email");
  const password = formData.get("password");

  // basic check
  if (typeof email !== "string" || email.length < 1 || email.length > 31) {
    return {
      message: "Incorrect email or password",
    };
  }
  if (
    typeof password !== "string" ||
    password.length < 1 ||
    password.length > 255
  ) {
    return {
      message: "Incorrect email or password",
    };
  }
  try {
    // find user by key
    // and validate password
    const key = await auth.useKey("email", email.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    // Get the cookie
    const sessionCookie = auth.createSessionCookie(session);
    cookies().set(sessionCookie); // Store the session cookie

    // Redirect to the admin page
    redirect("/admin");
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist
      // or invalid password
      return {
        message: "Incorrect email or password",
      };
    }

    return {
      message: "An unknown error occurred",
    };
  }
}
