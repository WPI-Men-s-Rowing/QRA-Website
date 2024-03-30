"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

/**
 * Client component that acts as a back-button, navigating to the previous page
 * @param children the children to render inside the button
 */
export default function BackButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Button
      className="bg-background text-black border border-divider"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
