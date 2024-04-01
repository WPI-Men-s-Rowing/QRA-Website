"use server";
import LakeSchedule from "@/components/schedule/LakeSchedule.tsx";
import Header from "@/components/text/Header.tsx";
import { getRegattasSummary } from "@/lib/utils/regattas/get-regattas-summary.ts";

async function Regattas() {
  const data = await getRegattasSummary();
  console.log(data);
  return (
    <div className="flex p-5 flex-col">
      <Header>Lake Schedule</Header>
      <div className="text-base font-normal text-subtext">
        All information is provided by the host school, and is subject to change
        without notice. Please contact the host school for any additional
        details
      </div>
      Search:
      <input
        className="w-full h-[39px] px-2.5 py-[5px] bg-zinc-100 rounded-[50px] border border-zinc-800 border-opacity-20 justify-start items-center gap-2.5 inline-flex"
        placeholder={"Search by date, team, or event"}
      />
      <hr className=" h-px bg-divider border-0 my-[5px]" />
      <LakeSchedule regattas={data} />
    </div>
  );
}

export default Regattas;
