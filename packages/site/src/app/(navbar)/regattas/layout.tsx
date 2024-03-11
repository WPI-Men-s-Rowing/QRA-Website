import JumboTron from "@/components/JumboTron";
import photo from "@public/photo.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-w-screen min-h-screen overflow-x-hidden">
        <JumboTron
          title={"Regattas"}
          subtitle={"Hosting quality"}
          picture={photo}
        />
        {children}
      </div>
    </>
  );
}
