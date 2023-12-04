import { Athlete, LineupSeat } from "@/types/types";
import { Meta, StoryObj } from "@storybook/react";
import LineupPopOver from "./LineupPopOver";

/**
 * Component for a result card, meant to be used in the race results display page
 */
const meta: Meta<typeof LineupPopOver> = {
  title: "Components/results/popover/LineupPopOver",
  component: LineupPopOver,
  tags: ["autodocs"],
} satisfies Meta<typeof LineupPopOver>;

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

/**
 * Story for a lineup pop over that is visible
 */
export const VisiblePopOver: Story = {
  args: {
    isVisible: true,
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
 * Story for a lineup pop over that is hidden
 */
export const HiddenPopOver: Story = {
  args: {
    isVisible: false,
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
