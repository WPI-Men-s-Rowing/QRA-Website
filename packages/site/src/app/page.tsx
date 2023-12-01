import About from "@/components/About";
import JumboTron from "@/components/JumboTron";
import ShortCuts from "@/components/ShortCuts";

function Home() {
  return (
    <>
      <div className="">
        <JumboTron
          title={"Quinsigamond Rowing Association, Inc."}
          subtitle={"Lake Quinsigamond, Massachusetts"}
          picture={"/donahue.jpg"}
        />
        <div className="flex flex-row ">
          <ShortCuts />
          <About />
        </div>
      </div>
    </>
  );
}

export default Home;