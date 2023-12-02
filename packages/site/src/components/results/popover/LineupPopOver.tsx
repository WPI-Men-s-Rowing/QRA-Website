"use client";

import {Athlete} from "@/types/types.ts";

/**
 * Interface representing the props in a result card
 */
interface LineupCardProps {
    lineup: Athlete[];
    isVisible: boolean;
}

/**
 * Component that crates a popover showing the lineup of an individual crew
 * @param props the properties defining the result card
 */
function LineupPopOver(props: LineupCardProps) {
    return (
        <>
            {props.isVisible && (
                <div
                    className={"relative group inline-block"}>
                    {props.lineup.map((athlete) => {
                        return (
                            <div className={"flex flex-row gap-2.5 text-xs"}>
                                <div>{athlete.seat}</div>
                                <div>{athlete.name}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default LineupPopOver;
