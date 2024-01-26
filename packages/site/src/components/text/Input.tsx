"use client";

import eyeOff from "@public/icons/eye-off.svg";
import eye from "@public/icons/eye.svg";
import Image, { StaticImageData } from "next/image";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";

/**
 * Component for a styled input box, to be used throughout the application
 * @param props props for an input box, same as could be passed to a non-styled input
 */
export default function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  const [showPassword, setShowPassword] = useState(false); // By default, set password to be hidden. This doesn't matter for non-password entries

  return (
    <div className={`flex flex-col ${props.className}`}>
      <p className="text-black text-[10px] md:text-base">
        {props.placeholder}:
      </p>
      <div className="flex flex-row">
        <input
          {...props}
          type={
            showPassword
              ? "text"
              : props.type /* Force to text to show password when show password is set */
          }
          className="w-full border rounded-full border-divider bg-secondary 
      placeholder-subtext text-black text-base md:text-xl pl-[10px] md:pl-[15px] py-[5px] md:py-[10px] focus:outline-none focus:border-black caret-black"
        />
        {props.type === "password" && (
          /* Only show the password toggle possibility if type is password */ /* This looks a little better with extra padding. Aditionally,
          setting the dimensions in the div makes sizing work a lot better/easier*/
          <div className="w-[21.96px] h-[16px] md:w-[43.92px] md:h-[32px] absolute self-center right-[20px]">
            <Image
              alt={showPassword ? "Hide Password" : "Show Password"}
              fill={true}
              sizes="100%"
              className="w-full h-auto"
              src={
                /* Set image type as appropriate */
                showPassword
                  ? (eyeOff as StaticImageData)
                  : (eye as StaticImageData)
              }
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
