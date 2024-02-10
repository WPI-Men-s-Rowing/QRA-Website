import { auth } from "@/lib/utils/auth";
import background from "@public/bg.png";
import * as context from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

/**
 * Admin login page. Validates to see if the user is logged in, and if they are, redirects to the admin page
 */
export default async function AdminLogin() {
  // Check if the user is already logged in, and if they are
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (session) {
    redirect("/admin"); // Redirect to the admin page
  }

  return (
    <div className="min-h-fit w-full h-full relative">
      <Image
        src={background}
        alt={""}
        fill
        className="object-cover z-[-1] brightness-50 absolute top-0 bottom-0 left-0 right-0"
      />
      <LoginForm />
    </div>
  );
}
