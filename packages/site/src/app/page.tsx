import About from "@/components/About";
import JumboTron from "@/components/JumboTron";
import ShortCuts from "@/components/ShortCuts";
import donahue from "@public/donahue.jpg";

function Home() {
  return (
    <>
      <div className="">
        <JumboTron
          title={"Quinsigamond Rowing Association, Inc."}
          subtitle={"Lake Quinsigamond, Massachusetts"}
          picture={donahue}
        />
        <div className="flex lg:flex-row flex-col">
          <ShortCuts />
          <About />
        </div>
      </div>
    </>
  );
}

export default Home;
