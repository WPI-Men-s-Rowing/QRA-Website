import { ReactNode } from "react";

/**
 * Header component, used for all headers
 * @param children the text to display in the header
 * @constructor
 */
function Header({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="lg:text-4xl text-3xl text-left text-red underline underline-offset-[5px] decoration-divider decoration-1">
        {children}
      </header>
    </>
  );
}

export default Header;
