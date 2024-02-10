"use client";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/text/Header";
import Input from "@/components/text/Input";
import qraLogo from "@public/qra-logo.png";
import Image from "next/image";
import Link from "next/link";
import { useFormState } from "react-dom";
import { login } from "./actions";

/**
 * Client component representing the login form. This is kept here, so that the page can use server-side stuff (such as redirecting if the user is logged in)
 */
export default function LoginForm() {
  // Form state handler, so we can retrieve form errors
  const [state, formAction] = useFormState(login, { message: "" });

  return (
    <div className="min-h-fit w-full h-full relative flex justify-center items-center">
      {/* Div that displays the login error message when appropriate*/}
      {state.message !== "" && (
        <div className="absolute top-5 right-0 mx-2.5 my-2.5 bg-red text-secondary rounded-[10px] text-base md:text-2xl">
          {state.message}
        </div>
      )}

      <form
        action={formAction}
        className="rounded-[10px] p-2.5 md:p-[15px] flex flex-col gap-5 bg-background h-fit w-min"
      >
        <div className="flex flex-col space-y-2.5">
          <div className="flex flex-row space-x-[5px] items-center max-w-full">
            <div className="min-w-[54px] min-h-[40.63px] md:min-w-[81px] md:min-h-[60.94px]">
              <Image
                src={qraLogo}
                alt={"QRA Logo"}
                sizes="100%"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <h2 className="font-bold text-base md:text-2xl text-black">
              Quinsigamond Rowing Association
            </h2>
          </div>

          <div className="flex flex-col">
            <Header>Administrator Login</Header>
            <p className="text-black text-[10px] md:text-base opacity-50 whitespace-nowrap">
              Looking for coaches login? See{" "}
              <Link
                href={"/"}
                className="text-blue underline whitespace-nowrap"
              >
                Coaches Login
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-2.5">
          <Input
            autoComplete="on"
            spellCheck={false}
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            required
          />
          <Input
            autoComplete="on"
            spellCheck={false}
            placeholder="Password"
            id="password"
            type="password"
            name="password"
            required
          />
        </div>

        <div className="flex flex-col space-y-2.5">
          <Link
            href={`/admin/login/forgot-password`}
            className="text-[10px] md:text-base text-blue underline"
          >
            Forgot Password?
          </Link>
          <BackButton>Cancel</BackButton>
          <Button className="bg-red text-background" formAction="submit">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
