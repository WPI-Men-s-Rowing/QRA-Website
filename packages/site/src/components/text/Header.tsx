import { ReactNode } from "react";

/**
 * Header component, used for all headers
 * @param children the text to display in the header
 * @param className classes to pass to the text itself, to provide additional styling
 */
function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className="flex flex-col w-min">
        <header
          className={`md:text-4xl text-2xl text-left text-red whitespace-nowrap ${className}`}
        >
          {children}
        </header>
        <hr className="h-px bg-divider border-0 my-[5px]" />
      </div>
    </>
  );
}

export default Header;
