import qraLogo from "@public/qra-logo.png";
import DOMPurify from "dompurify";
import Image from "next/image";
import useSWR from "swr";

interface TeamIconProps {
  teamName: string;
}

/**
 * Component for team icons
 */
export default function TeamIcon({ teamName }: TeamIconProps) {
  const { data } = useSWR<string>(
    // This defers to the local route which gets image data
    `/teams/${teamName}/icon`,
    async (url: string) =>
      // Now we sanitize the image data (just to be safe)
      DOMPurify.sanitize(
        // Then we fetch it as simple text
        (await (await fetch(url)).text()).replace(
          // This looks really complicated but is super simple - it replaces the first instance of width and height with 28px each,
          // so the SVGs fit as expected
          /width="\d+(px)?" height="\d+(px)?"/m,
          `width="28px" height="28px"`,
        ),
      ),
  );
  return (
    <>
      {data?.toString().includes("svg") ? ( // Set to QRA logo if the schools logo doesn't exist
        <div
          dangerouslySetInnerHTML={{
            __html: data ?? "",
          }}
        />
      ) : (
        <Image src={qraLogo} alt="QRA Logo" className="w-[42px] h-[30px]" />
      )}
    </>
  );
}
