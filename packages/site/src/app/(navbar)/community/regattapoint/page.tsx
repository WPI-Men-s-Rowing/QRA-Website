import Header from "@/components/text/Header.tsx";

function Community() {
  return (
    <>
      <div className="flex flex-col p-5 gap-4">
        <Header>Regatta Point Parking</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <p>
            Parking inside the park for competitors and spectators is not
            allowed during major regattas.
          </p>
          <p>
            Competitors and spectators should park in the lots closest to the
            starting line (to the left as you come in the gate).
          </p>
          <p>
            The spaces closest to the lake are reserved for Vans with boats or
            boat trailers.
          </p>
        </div>
        <Header>Regatta Point Rigging</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <p>
            Launching is not allowed from the awards dock in front of the
            Sailing Office.
          </p>
          <p>
            Launching from the shore is prohibited due to the presence of
            foreign objects in the shallows.
          </p>
          <p>
            Coaches and rowers are expected to act with courtesy and common
            sense.
          </p>
        </div>
        <Header>Regatta Point Launching</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <p>
            Launching is not allowed from the awards dock in front of the
            Sailing Office.
          </p>
          <p>
            Launching from the shore is prohibited due to the presence of
            foreign objects in the shallows.
          </p>
          <p>
            Coaches and rowers are expected to act with courtesy and common
            sense.
          </p>
        </div>
        <Header>Regatta Point Restrooms</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <p>
            Restrooms are available in the main building. Additional temporary
            facilities are available during the spring racing season.
          </p>
        </div>
        <Header>Regatta Point Trash</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <p>
            Trash recepticles are provided throughout the park and large
            dumpster are available during the large regattas. Visiting crews are
            asked to clean up after themselves and depsit trash in the dumpsters
            provided inside the park.
          </p>
        </div>
        <Header>Community Sailing</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <p>
            See Regatta Point Community Sailing for details on community sailing
            opportunities.
          </p>
        </div>
      </div>
    </>
  );
}

export default Community;
