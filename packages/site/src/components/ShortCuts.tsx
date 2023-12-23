import Header from "@/components/text/Header.tsx";
import Link from "next/link";

/**
 * Component which creates links section on the homepage
 */
function ShortCuts() {
  return (
    <>
      <div className="h-auto w-auto p-5">
        <Header>Shortcuts</Header>
        <ol className="list-disc p-5 lg:text-2xl text-xl">
          <li>
            <Link href={""}>Link</Link>
          </li>
          <li>
            <Link href={""}>Link</Link>
          </li>
          <li>
            <Link href={""}>Link</Link>
          </li>
        </ol>
      </div>
    </>
  );
}

export default ShortCuts;
