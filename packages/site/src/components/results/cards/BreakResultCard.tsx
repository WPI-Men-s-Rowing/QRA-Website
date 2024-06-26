/**
 * Interface representing the props in a result card
 */
interface ResultCardProps {
  /**
   * The title of the regatta
   */
  title: string;
  /**
   * The regatta's start time
   */
  startTime: Date;
}

/**
 * Component that crates a result card showing the results of an individual race
 * @param props the properties defining the result card
 */
function BreakResultCard(props: ResultCardProps) {
  return (
    <>
      <div
        className={`transition-all duration-700 lg:w-[405px] w-full h-[413px] px-[15px] pt-2.5 pb-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 inline-flex`}
      >
        <div className="self-stretch h-full flex-col justify-center items-center gap-[5px] flex">
          <div className="text-3xl font-bold text-red">{props.title}</div>
          <div className="flex w-auto flex-row text-zinc-800">
            <div className="">Scheduled:</div>
            <div className="font-bold">
              {props.startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BreakResultCard;
