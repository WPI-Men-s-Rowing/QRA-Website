import About from "@/components/About";
import JumboTron from "@/components/JumboTron";
import photo from "@public/bg.jpg";

function Community() {
  return (
    <>
      <div className="min-w-screen min-h-screen overflow-x-hidden">
        <JumboTron
          title={"QRA Community"}
          subtitle={"At the heart of what we do"}
          picture={photo}
        />
        <About />
      </div>
    </>
  );
}

export default Community;
