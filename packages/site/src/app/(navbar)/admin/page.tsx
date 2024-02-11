"use server";

import Button from "@/components/Button";
import { auth } from "@/lib/utils/auth";
import * as context from "next/headers";
import { redirect } from "next/navigation";

/**
 * Component representing the admin home-screen. A middleware should verify that the user is logged in
 */
export default async function AdminPage() {
  // Check if the user is not logged in, and if they aren't
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) {
    redirect("/admin/login"); // Redirect to the login page
  }

  return (
    <div className="h-[1000px] justify-center items-center flex flex-col">
      <p>Welcome, Admin!</p>
      <form>
        <Button className="bg-red text-background">Log Out</Button>
      </form>
    </div>
  );
}
