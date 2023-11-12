import {useParams} from "react-router-dom";

function ResultsDetails() {
    const {raceID} = useParams()
    return (
        <>
            <div className="ResultsDetails">
                <h1>Results Details: ${raceID}</h1>
            </div>
        </>
    )
}

export default ResultsDetails
