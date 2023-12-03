import Link from "next/link";

/**
 * Component which creates links section on the homepage
 */
function ShortCuts() {
    return (
        <>
            <div className="h-auto w-auto p-5">
                <div
                    className="lg:text-4xl text-3xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
                    Shortcuts
                </div>
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
