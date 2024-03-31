import JumboTron from "@/components/JumboTron";
import photo from "@public/bg.jpg";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-w-screen min-h-screen overflow-x-hidden">
        <JumboTron title={"Community"} subtitle={""} picture={photo} />
        {children}
      </div>
    </>
  );
}
