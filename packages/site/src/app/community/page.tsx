import JumboTron from "@/components/JumboTron";
import photo from "@public/bg.jpg";
import Header from "@/components/text/Header.tsx";

function Community() {

    return (
        <>
            <div className="min-w-screen min-h-screen overflow-x-hidden">
                <JumboTron
                    title={"Community"}
                    subtitle={""}
                    picture={photo}
                />
                <Header>
                    Lake Schedule
                </Header>
            </div>
        </>
    );
}

export default Community;
