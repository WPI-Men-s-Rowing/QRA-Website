import background from "@public/bg.png";
import qraLogo from "@public/qra-logo.png";
import Image from "next/image";
import Link from "next/link";

export default function AdminLogin() {
  return (
    <div className="w-full h-full">
      <Image src={background} alt={""} fill className="object-contain" />
      <div className="self-center justify-self-center rounded-[10px] p-2.5 flex flex-col space-y-5 bg-background">
        <div className="flex flex-col space-y-2.5">
          <div className="flex flex-row space-x-[5px] justify-center">
            <Image src={qraLogo} alt={"QRA Logo"} width={54} height={40.63} />
            <h2 className="font-bold text-base text-black w-min">
              Quinsigamond Rowing Association
            </h2>
          </div>

          <div className="flex flex-col space-x-[5px]">
            <h1 className="text-2xl text-red underline underline-offset-[5px] decoration-divider decoration-1">
              Administrator Login
            </h1>
            <sub className="text-black text-[10px] opacity-50">
              Looking for coaches login? See{" "}
              <Link href={"/"} className="text-blue underline">
                Coaches Login
              </Link>
            </sub>
          </div>
        </div>

        <div className="flex flex-col space-y-2.5"></div>
      </div>
    </div>
  );
}
