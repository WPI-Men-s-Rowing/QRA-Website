import {Route, Routes} from "react-router-dom";
import Home from "./Home.tsx";
import Regattas from "./Regattas.tsx";
import Community from "./Community.tsx";
import ResultsDetails from "./ResultsDetails.tsx";

function App() {

    return (
        <>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="results" element={<ResultsDetails/>}>
                        <Route path=":raceID" element={<ResultsDetails/>}/>
                    </Route>
                    <Route path="regattas" element={<Regattas/>}/>
                    <Route path="community" element={<Community/>}/>
                </Routes>
            </div>
        </>
    )
}

export default App
