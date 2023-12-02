import { Athlete, FinishedCrew, HeatStatus, LineupSeat } from "@/types/types";
import type { Meta, StoryObj } from "@storybook/react";
import ResultCard from "./ResultCard";

/**
 * Component for a result card, providing the ability to view details on an individual race,
 * with a UI that grows/shrinks
 */
const meta = {
  title: "Components/results/ResultCard",
  component: ResultCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ResultCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Generic Athlete
 */
const Athlete1: Athlete = {
  name: "John Smith",
  seat: LineupSeat.BOW,
};
/**
 * Generic Athlete
 */
const Athlete2: Athlete = {
  name: "Jane Doe",
  seat: LineupSeat.TWO,
};
/**
 * Generic Athlete
 */
const Athlete3: Athlete = {
  name: "John Doe",
  seat: LineupSeat.THREE,
};
/**
 * Generic Athlete
 */
const Athlete4: Athlete = {
  name: "Jane Smith",
  seat: LineupSeat.FOUR,
};
/**
 * Generic Athlete
 */
const Athlete5: Athlete = {
  name: "John Smith",
  seat: LineupSeat.FIVE,
};
/**
 * Generic Athlete
 */
const Athlete6: Athlete = {
  name: "Jane Doe",
  seat: LineupSeat.SIX,
};
/**
 * Generic Athlete
 */
const Athlete7: Athlete = {
  name: "John Doe",
  seat: LineupSeat.SEVEN,
};
/**
 * Generic Athlete
 */
const Athlete8: Athlete = {
  name: "Jane Smith",
  seat: LineupSeat.STROKE,
};
/**
 * Generic Athlete
 */
const Athlete9: Athlete = {
  name: "John Smith",
  seat: LineupSeat.COX,
};

// What follows is a collection of prebuilt crews
const WPI: FinishedCrew = {
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
};
const Tufts: FinishedCrew = {
  teamName: "Tufts",
  totalTime: 99999,
  lane: 2,
  place: 1,
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
};
const Bates: FinishedCrew = {
  teamName: "Bates",
  totalTime: 99999,
  lane: 3,
  place: 2,
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
};
const MIT: FinishedCrew = {
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
};
const Harvard: FinishedCrew = {
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
};
const Brown: FinishedCrew = {
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
};
const Northeastern: FinishedCrew = {
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
};
const Dartmouth: FinishedCrew = {
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
};
const Yale: FinishedCrew = {
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
};
const Princeton: FinishedCrew = {
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
};
const Columbia: FinishedCrew = {
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
};

const Penn: FinishedCrew = {
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
};
const Cornell: FinishedCrew = {
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
};

/**
 * Generic heat
 */
export const Heat1: Story = {
  args: {
    title: "Men's Varsity 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date("2023-11-29 14:00:00"),
    host: "WPI",
    finishOrder: [
      WPI,
      Tufts,
      Bates,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  },
};

/**
 * Second generic heat
 */
export const Heat2: Story = {
  args: {
    title: "Men's 2nd Varsity 8+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Tufts",
    finishOrder: [
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
      WPI,
      Tufts,
      Bates,
    ],
  },
};

/**
 * Third generic heat
 */
export const Heat3: Story = {
  args: {
    title: "Women's Varsity 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "Bates",
    finishOrder: [
      Tufts,
      Bates,
      WPI,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  },
};

/**
 * Break in-between sessions
 */
export const Break: Story = {
  args: {
    title: "BREAK",
    status: HeatStatus.UPCOMING,
    startTime: new Date(),
    host: "WPI",
    finishOrder: [],
  },
};

/**
 * Fourth generic heat
 */
export const Heat4: Story = {
  args: {
    title: "Men's Novice 4+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "Tufts",
    finishOrder: [
      Bates,
      Tufts,
      WPI,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  },
};

/**
 * Fifth generic heat
 */
export const Heat5: Story = {
  args: {
    title: "Women's Lightweight 4+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Bates",
    finishOrder: [
      WPI,
      Bates,
      Tufts,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  },
};

/**
 * Sixth generic heat
 */
export const Heat6: Story = {
  args: {
    title: "Women's Lightweight 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "MIT",
    finishOrder: [
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
    ],
  },
};

/**
 * Seventh generic heat
 */
export const Heat7: Story = {
  args: {
    title: "Men's Lightweight 8+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Harvard",
    finishOrder: [
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
      MIT,
    ],
  },
};

/**
 * Second break
 */
export const Break2: Story = {
  args: {
    title: "BREAK",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Brown",
    finishOrder: [],
  },
};

/**
 * Eighth generic heat
 */
export const Heat8: Story = {
  args: {
    title: "Men's Freshman 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "Northeastern",
    finishOrder: [
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  },
};

/**
 * Ninth generic heat
 */
export const Heat9: Story = {
  args: {
    title: "Women's 2nd Varsity 8+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Dartmouth",
    finishOrder: [
      Dartmouth,
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
      MIT,
      Harvard,
      Brown,
      Northeastern,
    ],
  },
};
