import Header from "@/components/text/Header.tsx";

function Community() {
  return (
    <>
      <div className="flex flex-col p-5 gap-4">
        <Header>Donahue Rowing Center Parking</Header>
        <div className="lg:text-2xl text-xl flex flex-col gap-5">
          <strong>
            THERE IS NO PARKING AT THE US POST OFFICE FACILITY ACROSS FROM THE
            DRC. IF YOU PARK THERE YOU WILL BE TOWED.
          </strong>
          <p>
            Visitor parking for races hosted at the DRC is on the street north
            of the DRC. No parking is allowed south of the DRC property line.
          </p>
          <p>
            Parking in the paved DRC lot is for coaches & scullers only (passes
            to be given out). School vans & buses must park in boat ramp lot.
          </p>
          <p>
            Visiting crews must park trailers, vans, buses in boat ramp lot and
            must use portable toilets provided.
          </p>
          <p>
            Visiting crews may set up tents for spectators only along the fence
            at the south end of the DRC property.
          </p>
        </div>
      </div>
    </>
  );
}

export default Community;
