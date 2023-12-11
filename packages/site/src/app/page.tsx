import About from "@/components/About";
import JumboTron from "@/components/JumboTron";
import ShortCuts from "@/components/ShortCuts";
import donahue from "@public/donahue.jpg";
import {Regatta, RegattaStatus} from "@/types/types.ts";
import RecentResults from "@/components/results/regattalist/RecentResults.tsx";

function Home() {
    const testRegatta2: Regatta = {
        name: "Quinsigamond Snake Regatta",
        date: new Date(1638415609),
        uuid: "1234",
        location: "Lake Quinsigamond",
        status: RegattaStatus.FINISHED,
        heats: [],
    };
    const regattas: Regatta[] = [testRegatta2];

    return (
        <>
            <div className="">
                <JumboTron
                    title={"Quinsigamond Rowing Association, Inc."}
                    subtitle={"Lake Quinsigamond, Massachusetts"}
                    picture={donahue}
                />
                <div className="flex lg:flex-row flex-col w-full">
                    <ShortCuts/>
                    <About/>
                    <RecentResults Regattas={regattas}/>
                </div>
            </div>
        </>
    );
}

export default Home;
