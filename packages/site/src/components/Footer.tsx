import qraLogo from "@public/qra-logo.png";
import sportsGraphicsLogo from "@public/sports-graphics-logo.png";
import Image from "next/image";

/**
 * Component representing the system footer
 */
export default function Footer() {
  return (
    <footer>
      <div className="w-full p-2.5 bg-tertiary justify-between items-center inline-flex">
        <div className="flex-col justify-start items-start gap-[5px] inline-flex text-background">
          <small className="text-[10px] font-normal">
            &#169; {new Date().getFullYear()} Quinsigamond Rowing Association,
            Inc.
          </small>
          <div className="justify-start items-start gap-[5px] inline-flex">
            <small className="text-[10px] font-normal">
              Photos courtesy of
            </small>
            <a
              className="text-[#3385FF] text-[10px] font-normal underline"
              href={"https://sportsgraphics.com"}
            >
              SportGraphics.com
            </a>
          </div>
          <small className="self-stretch text-[10px] font-normal">
            Website developed by Bob Nyce, Ian Wright, and Emerson Shatouhy
          </small>
        </div>
        <div className="flex-col justify-start items-start gap-2.5 inline-flex">
          <Image
            className="w-[39px] h-[29.34px]"
            src={qraLogo}
            alt={"QRA Logo"}
          />
          <Image
            className="w-[37.41px] h-[29.34px]"
            src={sportsGraphicsLogo}
            alt={"Sports Graphics Logo"}
          />
        </div>
      </div>
    </footer>
  );
}
