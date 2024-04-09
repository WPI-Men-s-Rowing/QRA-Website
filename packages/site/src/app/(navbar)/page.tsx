import JumboTron from "@/components/JumboTron";
import RecentResults from "@/components/results/regattalist/RecentResults.tsx";
import Header from "@/components/text/Header";
import { Regatta } from "@/lib/utils/regattas/types";
import donahue from "@public/donahue.jpg";
import Link from "next/link";

function Home() {
  const testRegatta2: Regatta = {
    name: "Quinsigamond Snake Regatta",
    startDate: new Date(1638415609),
    regattaId: "1234",
    type: "head",
    distance: 5000,
    endDate: new Date(1638515609),
    host: "QRA",
    rampClosed: true,
    participantDescription: "Snake Schools",
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
          <div className="h-auto w-auto p-5">
            <Header>Shortcuts</Header>
            <ol className="list-disc p-5 lg:text-2xl text-xl">
              <li>
                <Link href={""}>Link</Link>
              </li>
              <li>
                <Link href={""}>Link</Link>
              </li>
              <li>
                <Link href={""}>Link</Link>
              </li>
            </ol>
          </div>
          <div className="h-auto w-auto p-5 space-y-5">
            <Header>About Us</Header>
            <p className="lg:text-2xl lg:w-3/4 text-xl text-left text-black border-amber-50">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id
              tortor non quam sodales semper sed sit amet ex. Pellentesque
              eleifend, est quis hendrerit hendrerit, est urna fringilla massa,
              nec rutrum magna mauris vitae felis. Maecenas fermentum nunc
              turpis, ut consectetur tortor tincidunt id. Maecenas faucibus
              tempus mauris non egestas. Nunc ornare, eros at rhoncus tincidunt,
              nibh sem bibendum nisi, ut scelerisque nunc eros quis mauris.
              Fusce eget lectus eu nulla fringilla eleifend sit amet non libero.
              Aenean vehicula neque nec mauris semper scelerisque. Duis finibus
              purus eu diam tincidunt facilisis a eu metus. Sed in mauris vel
              orci tincidunt gravida eu sit amet eros. In hac habitasse platea
              dictumst. Aliquam sollicitudin metus nisi, sed eleifend lectus
              faucibus sit amet.
            </p>
          </div>
          <RecentResults regattas={regattas} />
        </div>
      </div>
    </>
  );
}

export default Home;
