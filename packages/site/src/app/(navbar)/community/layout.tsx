import JumboTron from "@/components/JumboTron";
import photo from "@public/bg.jpg";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-w-screen min-h-screen overflow-x-hidden">
        <JumboTron
          title={"QRA Community"}
          subtitle={"At the heart of what we do"}
          picture={photo}
        />
        {children}
      </div>
    </>
  );
}
