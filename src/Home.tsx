import Navbar from "./compontents/navbar.tsx";
import Shortcuts from "./compontents/shortcuts.tsx";
import About from "./compontents/about.tsx";
import JumboTron from "./compontents/jumbotron.tsx";
import bg from "./assets/donahue.jpg";

function Home() {

    return (
        <>
            <div
                className="">
                <Navbar/>
                <JumboTron title={"Quinsigamond Rowing Association, Inc."}
                           subtitle={"Lake Quinsigamond, Massachusetts"}
                           picture={bg}
                />
                <div className="flex flex-row ">
                    <Shortcuts/>
                    <About/>
                </div>
            </div>
        </>
    )
}

export default Home
