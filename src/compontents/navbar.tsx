import qraLogo from "../assets/qraLogo.png";
import regattaIcon from "../assets/icons/regattaIcon.svg";
import homeIcon from "../assets/icons/homeIcon.svg";
import communityIcon from "../assets/icons/communityIcon.svg";
import {Link} from "react-router-dom";


function Navbar() {
    return (
        <>
            <nav
                className="w-full top-0 z-10 bg-gray-500 backdrop-filter backdrop-blur-lg bg-opacity-30 p-2 absolute">
                <div className="mx-auto">
                    <div className="flex items-center justify-between h-16">
                        <img className="w-[72px] h-[54.17px]" src={qraLogo} alt="QRA Logo"/>
                        <div className="flex flex-row gap-10 text-gray-900">
                            <Link to={"/"} className="flex flex-row text-white items-center gap-2 text-opacity-50">
                                <img src={homeIcon} alt="Home Icon" className="w-[40px] h-[40px]"/>
                                Home
                            </Link>
                            <Link to={"/regattas"}
                                  className="flex flex-row text-white items-center gap-2 text-opacity-50">
                                <img src={regattaIcon} alt="Regatta Icon" className="w-[40px] h-[40px]"/>
                                Regattas
                            </Link>
                            <Link to={"/community"}
                                  className="flex flex-row text-white items-center gap-2 text-opacity-50">
                                <img src={communityIcon} alt="Home Icon" className="w-[40px] h-[40px]"/>
                                Community
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
