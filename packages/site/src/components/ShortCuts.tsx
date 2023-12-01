import Link from "next/link";

/**
 * Component which creates links section on the homepage
 */
function ShortCuts() {
  return (
    <>
      <div className="h-auto w-auto p-5">
        <div className="text-4xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
          Shortcuts
        </div>
        <ol className="list-disc p-5 text-2xl">
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
