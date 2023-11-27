import ResultCard from "./compontents/results/resultcard.tsx";


function ResultsDetails() {
    return (
        <>
            <div
                className="text-4xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
                Regatta Name on Date
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row justify-start gap-4 flex-wrap p-2">
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                    <ResultCard EventName={"Men's Varsity 8+"} EventStatus={"Official"} EventTime={"11:00"}/>
                </div>
            </div>
        </>
    )
}

export default ResultsDetails
