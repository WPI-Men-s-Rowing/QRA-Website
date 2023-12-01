import JumboTron from "@/components/JumboTron";
import RaceCard from "@/components/results/RaceCard";
import { Regatta, RegattaStatus } from "@/types/types";
import photo from "@public/photo.png";

function Regattas() {
  const testRegatta: Regatta = {
    name: "Another Regatta",
    date: new Date(),
    uuid: "1234",
    location: "Lake Quinsigamond",
    status: RegattaStatus.UPCOMING,
    heats: [],
  };
  const testRegatta2: Regatta = {
    name: "Quinsigamond Snake Regatta",
    date: new Date(),
    uuid: "1234",
    location: "Lake Quinsigamond",
    status: RegattaStatus.ACTIVE,
    heats: [],
  };

  const testRegatta3: Regatta = {
    name: "WPI Invitational",
    date: new Date(),
    uuid: "1234",
    location: "Lake Quinsigamond",
    status: RegattaStatus.FINISHED,
    heats: [],
  };
  const regattas: Regatta[] = [testRegatta, testRegatta2, testRegatta3];

  return (
    <>
      <div className="min-w-screen min-h-screen overflow-x-hidden">
        <JumboTron
          title={"QRA Regattas"}
          subtitle={"Lake Quinsigamond, Massachusetts"}
          picture={photo}
        />
        <div className="flex flex-row p-5 gap-4">
          <div className="flex flex-col w-3/4">
            <div className="text-4xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
              Overview
            </div>
            <div className="text-2xl">
              Competitive rowing teams first came to Lake Quinsigamond in 1857.
              Finding the lake ideal for such crew meets, avid rowers
              established boating clubs on the lake&apos;s shores, the first
              being the Quinsigamond Boating Club. More boating clubs and races
              followed, and soon many colleges (both local and abroad) held
              meets on the lake. Beginning in 1895, local high schools held crew
              races on the lake. In 1952, the lake played host to the National
              Olympic rowing trials.
              <br />
              Lake Quinsigamond is currently considered the fourth best natural
              body of water for rowing in the world. The lake has played host
              other national regattas such as the US Nationals in 1979 and the
              US Masters Nationals in 2005.
              <br />
              There is racing taking place on the lake every weekend from late
              March through the end of May. Many of these are duel races, hosted
              by local schools.
              <br />
              Additionally, at least six championship regattas are held on the
              lake each year, including the Big East Championship, Patriot
              League Championship, New England Fours Regatta, New England Rowing
              Championship, Men&apos;s Eastern Sprints Regatta and New England
              Interscholastic Rowing Association Regatta.
              <br />
              The QRA also offers timing support to regattas held elsewhere in
              the nation.
            </div>
          </div>
          <div className="w-auto flex flex-col gap-5">
            <div className="text-4xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
              Recent Results
            </div>
            {regattas.map((regatta) => {
              return (
                <RaceCard
                  uuid={regatta.uuid}
                  name={regatta.name}
                  status={regatta.status}
                  key={regatta.uuid}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Regattas;
