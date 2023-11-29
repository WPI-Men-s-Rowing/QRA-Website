// Regatta Types
export interface Regatta {
    name: string;
    date: Date;
    uuid: string;
    status: RegattaStatus;
    heats: Heat[];
    location: string;
}

export interface Heat {
    title: string;
    startTime: Date;
    status: HeatStatus;
    finishOrder: FinishedCrew[];
    host: string;
}

export interface FinishedCrew {
    teamName: string;
    totalTime: number;
    lane: number;
    place: number;
    margin: number;
    splitTimes?: number[];
}


// Enums
export enum HeatStatus {
    UPCOMING = "UPCOMING",
    ACTIVE = "ACTIVE",
    UNOFFICIAL = "UNOFFICIAL",
    OFFICIAL = "OFFICIAL"
}

export enum RegattaStatus {
    UPCOMING = "UPCOMING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}