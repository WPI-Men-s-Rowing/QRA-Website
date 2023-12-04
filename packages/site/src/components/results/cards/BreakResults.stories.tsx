import type { Meta, StoryObj } from "@storybook/react";
import BreakResultCard from "./BreakResultCard";

/**
 * Component for a break result card, meant to be used in the race results display page
 */
const meta: Meta<typeof BreakResultCard> = {
  title: "Components/results/cards/BreakResultCard",
  component: BreakResultCard,
  tags: ["autodocs"],
} satisfies Meta<typeof BreakResultCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Break Card made by WPI
 */
export const WPIBreakCard: Story = {
  args: {
    title: "WPI Break",
    startTime: new Date(),
  },
};

/**
 * Break Card made by Clark
 */
export const ClarkBreakCard: Story = {
  args: {
    title: "Clark Break",
    startTime: new Date("12/1/2024"),
  },
};
