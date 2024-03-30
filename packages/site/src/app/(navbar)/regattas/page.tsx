import RecentResults from "@/components/results/regattalist/RecentResults.tsx";
import UpcomingRegattas from "@/components/results/regattalist/UpcomingRegattas.tsx";
import Header from "@/components/text/Header.tsx";
import { Regatta, RegattaStatus } from "@/types/types";

function Regattas() {
  const testRegatta: Regatta = {
    name: "Another Regatta",
    date: new Date(),
    uuid: "1234",
    location: "Lake Quinsigamond",
    status: RegattaStatus.ACTIVE,
    heats: [],
  };
  const testRegatta2: Regatta = {
    name: "Quinsigamond Snake Regatta",
    date: new Date(1638415609),
    uuid: "1234",
    location: "Lake Quinsigamond",
    status: RegattaStatus.FINISHED,
    heats: [],
  };

  const testRegatta3: Regatta = {
    name: "WPI Invitational",
    date: new Date(1640908800000),
    uuid: "1234",
    location: "Lake Quinsigamond",
    status: RegattaStatus.UPCOMING,
    heats: [],
  };
  const regattas: Regatta[] = [testRegatta, testRegatta2, testRegatta3];

  return (
    <div className="flex p-5 gap-4 lg:flex-row flex-col">
      <div className="flex flex-col lg:w-3/4">
        <Header>Overview</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <p>
            Competitive rowing teams first came to Lake Quinsigamond in 1857.
            Finding the lake ideal for such crew meets, avid rowers established
            boating clubs on the lake&apos;s shores, the first being the
            Quinsigamond Boating Club. More boating clubs and races followed,
            and soon many colleges (both local and abroad) held meets on the
            lake. Beginning in 1895, local high schools held crew races on the
            lake. In 1952, the lake played host to the National Olympic rowing
            trials.
          </p>
          <p>
            Lake Quinsigamond is currently considered the fourth best natural
            body of water for rowing in the world. The lake has played host
            other national regattas such as the US Nationals in 1979 and the US
            Masters Nationals in 2005.
          </p>
          <p>
            There is racing taking place on the lake every weekend from late
            March through the end of May. Many of these are duel races, hosted
            by local schools.
          </p>
          <p>
            Additionally, at least six championship regattas are held on the
            lake each year, including the Big East Championship, Patriot League
            Championship, Women&apos;s Eastern Sprints Regatta, New England
            Rowing Championship, Men&apos;s Eastern Sprints Regatta, New England
            Interscholastic Rowing Association Regatta, and National
            Invitational Rowing Championship.
          </p>
          <p>
            The QRA also offers timing support to regattas held elsewhere in the
            nation.
          </p>
        </div>
      </div>
      <div className="lg:order-last order-first">
        <RecentResults
          Regattas={regattas.filter(
            (regatta) => regatta.status != RegattaStatus.UPCOMING,
          )}
        />
        <UpcomingRegattas
          Regattas={regattas.filter(
            (regatta) => regatta.status == RegattaStatus.UPCOMING,
          )}
        />
      </div>
    </div>
  );
}

export default Regattas;
