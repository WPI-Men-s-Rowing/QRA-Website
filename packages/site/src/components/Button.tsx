import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

/**
 * Component representing a button with some default styling applied
 * @param props props to pass to the button. This is all normal button properties + children
 */
export default function Button(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { children: React.ReactNode },
) {
  return (
    <button
      {...props}
      className={`px-2.5 text-center py-[5px] md:py-[10px] w-full rounded-full text-base md:text-2xl hover:brightness-110 ${props.className}`}
    >
      {props.children}
    </button>
  );
}
