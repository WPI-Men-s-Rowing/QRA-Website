import qraLogo from "../assets/qraLogo.png";
import homeIcon from "../assets/icons/Home Icon.svg"
import communityIcon from "../assets/icons/Community Icon.svg"
import regattaIcon from "../assets/icons/Regattas Icon.svg"
import {Link} from "react-router-dom";

function Navbar() {
    return (
        <>
            <div
                className="w-full h-auto px-2.5 py-5 bg-gradient-to-b from-black justify-between items-center inline-flex absolute">
                <img className="w-[72px] h-[54.17px]" src={qraLogo} alt="QRA Logo"/>
                <div className="justify-evenly gap-20 flex flex-row text-white text-xl">
                    <Link to={"/"}>
                        <div className="flex flex-row text-white items-center gap-2">
                            <div>
                                <img src={homeIcon} alt="Home Icon" className="w-[40px] h-[40px]"/>
                            </div>
                            About
                        </div>
                    </Link>
                    <Link to={"/regattas"}>
                        <div className="flex flex-row text-white items-center gap-2 text-opacity-50">
                            <div>
                                <img src={regattaIcon} alt="Home Icon" className="w-[40px] h-[40px]"/>
                            </div>
                            Regattas
                        </div>
                    </Link>
                    <Link to={"/community"}>
                        <div className="flex flex-row text-white items-center gap-2 text-opacity-50">

                            <div>
                                <img src={communityIcon} alt="Home Icon" className="w-[40px] h-[40px]"/>
                            </div>
                            Community
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Navbar
