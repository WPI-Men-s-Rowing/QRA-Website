import qraLogo from "@public/qra-logo.png";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="flex flex-col gap-5 items-center">
        <div className="flex flex-row gap-[5px] items-center min-h-fit">
          <div className="h-full aspect-[210/158] relative">
            <Image src={qraLogo} fill sizes="100%" alt="QRA Logo" />
          </div>
          <h1 className="w-[250px] md:w-[350px] text-black text-base md:text-2xl">
            Quinsigamond Rowing Association
          </h1>
        </div>

        <p className="w-[300px] md:w-[420px] text-2xl md:text-4xl mx-auto">
          Maintenance is currently in-progress. Please check back in 5 minutes
        </p>
      </div>
    </div>
  );
}
