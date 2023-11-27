import Navbar from "./compontents/navbar.tsx";
import JumboTron from "./compontents/jumbotron.tsx";
import Shortcuts from "./compontents/shortcuts.tsx";
import About from "./compontents/about.tsx";
import bg from "./assets/bg.png";

function Home() {

    return (
        <>
            <div
                className="min-w-screen min-h-screen overflow-x-hidden scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
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
