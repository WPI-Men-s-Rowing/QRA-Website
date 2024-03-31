"use server";

import { auth } from "@/lib/utils/auth";
import { LuciaError } from "lucia";
import * as context from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function init() {
  // This is a little bit of jank that fixes a Next.JS issue.
  // For some reason, this file is thought of as a client file (despite the use server directive) unless
  // this is called from a server component, in which case is everything is fine. Kinda terrible, but it works
}

/**
 * Asynchronous server action to attempt to login. Redirects and sets the appropriate cookie
 * if successful, otherwise, returns a serialized object containing the error message
 * @param formData the form data to use in reading the email and password
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

    throw e;
  }
}

/**
 * Action to log the user out
 */
export default async function logout() {
  // Check if user is authenticated
  const authRequest = auth.handleRequest("POST", context);
  const session = await authRequest.validate();

  // If the user is not authorized
  if (!session) {
    // We can't log them out, so don't
    throw new Error("Cannot log out a user who is not authorized");
  }

  // Make sure to invalidate the current session
  await auth.invalidateSession(session.sessionId);

  // Create and set a blank session cookie
  const sessionCookie = auth.createSessionCookie(null);
  cookies().set(sessionCookie);

  redirect("/");
}
