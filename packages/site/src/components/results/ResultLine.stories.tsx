import {Meta, StoryObj} from "@storybook/react";
import ResultLine from "./ResultLine";
import {Athlete, LineupSeat} from "@/types/types.ts";

/**
 * Component for a singular line within a result card, displaying details on the finish of a singular crew
 */
const meta = {
    title: "Components/results/ResultLine",
    component: ResultLine,
    args: {
        // Default expanded to false for all
        expanded: false,
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ResultLine>;

export default meta;

type Story = StoryObj<typeof meta>;
/**
 * Generic Athlete
 */
const Athlete1: Athlete = {
    name: "John Smith",
    seat: LineupSeat.BOW,
}
/**
 * Generic Athlete
 */
const Athlete2: Athlete = {
    name: "Jane Doe",
    seat: LineupSeat.TWO,
}
/**
 * Generic Athlete
 */
const Athlete3: Athlete = {
    name: "John Doe",
    seat: LineupSeat.THREE,
}
/**
 * Generic Athlete
 */
const Athlete4: Athlete = {
    name: "Jane Smith",
    seat: LineupSeat.FOUR,
}
/**
 * Generic Athlete
 */
const Athlete5: Athlete = {
    name: "John Smith",
    seat: LineupSeat.FIVE,
}
/**
 * Generic Athlete
 */
const Athlete6: Athlete = {
    name: "Jane Doe",
    seat: LineupSeat.SIX,
}
/**
 * Generic Athlete
 */
const Athlete7: Athlete = {
    name: "John Doe",
    seat: LineupSeat.SEVEN,
}
/**
 * Generic Athlete
 */
const Athlete8: Athlete = {
    name: "Jane Smith",
    seat: LineupSeat.STROKE,
}
/**
 * Generic Athlete
 */
const Athlete9: Athlete = {
    name: "John Smith",
    seat: LineupSeat.COX,
}


/**
 * Generic WPI crew finish
 */
export const WPI: Story = {
    args: {
        teamName: "WPI",
        totalTime: 99999,
        lane: 1,
        place: 0,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};

/**
 * Generic Tufts crew finish (expanded)
 */
export const TuftsExpanded: Story = {
    args: {
        teamName: "Tufts",
        totalTime: 99999,
        lane: 2,
        place: 1,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        expanded: true,
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};
/**
 * Generic Bates crew finish (expanded)
 */
export const BatesExpanded: Story = {
    args: {
        teamName: "Bates",
        totalTime: 99999,
        lane: 3,
        place: 2,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        expanded: true,
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};
/**
 * Generic MIT crew finish
 */
export const MIT: Story = {
    args: {
        teamName: "MIT",
        totalTime: 99999,
        lane: 4,
        place: 3,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};
/**
 * Generic Harvard crew finish
 */
export const Harvard: Story = {
    args: {
        teamName: "Harvard",
        totalTime: 99999,
        lane: 5,
        place: 4,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};
/**
 * Generic Brown crew finish
 */
export const Brown: Story = {
    args: {
        teamName: "Brown",
        totalTime: 99999,
        lane: 6,
        place: 5,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};
/**
 * Generic Northeastern crew finish
 */
export const Northeastern: Story = {
    args: {
        teamName: "Northeastern",
        totalTime: 99999,
        lane: 7,
        place: 6,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};
/**
 * Generic Dartmouth crew finish
 */
export const Dartmouth: Story = {
    args: {
        teamName: "Dartmouth",
        totalTime: 99999,
        lane: 8,
        place: 7,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};

/**
 * Generic Yale crew finish
 */
export const Yale: Story = {
    args: {
        teamName: "Yale",
        totalTime: 99999,
        lane: 9,
        place: 8,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};

/**
 * Generic Princeton crew finish
 */
export const Princeton: Story = {
    args: {
        teamName: "Princeton",
        totalTime: 99999,
        lane: 10,
        place: 9,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};

/**
 * Generic Columbia crew finish
 */
export const Columbia: Story = {
    args: {
        teamName: "Columbia",
        totalTime: 99999,
        lane: 11,
        place: 10,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};

/**
 * Generic Penn crew finish
 */
export const Penn: Story = {
    args: {
        teamName: "Penn",
        totalTime: 99999,
        lane: 12,
        place: 11,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};

/**
 * Generic Cornell crew finish
 */
export const Cornell: Story = {
    args: {
        teamName: "Cornell",
        totalTime: 99999,
        lane: 13,
        place: 12,
        margin: 0,
        splitTimes: [99999, 99999, 99999],
        lineup: [
            Athlete1,
            Athlete2,
            Athlete3,
            Athlete4,
            Athlete5,
            Athlete6,
            Athlete7,
            Athlete8,
            Athlete9,
        ],
    },
};
