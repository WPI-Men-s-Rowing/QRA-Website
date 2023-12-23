import { ReactNode } from "react";

/**
 * Header component, used for all headers
 * @param children the text to display in the header
 * @constructor
 */
function Header({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="lg:text-4xl text-3xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
        {children}
      </div>
    </>
  );
}

export default Header;
