import { RegattaStatus } from "@/types/types";
import type { Meta, StoryObj } from "@storybook/react";
import RaceCard from "./RaceCard";

/**
 * Component for a race card, providing navigation information to a race details page
 */
const meta: Meta<typeof RaceCard> = {
  title: "Components/results/RaceCard",
  component: RaceCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto w-min">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Generic regatta case
 */
export const TestRegatta: Story = {
  args: {
    name: "Another Regatta",
    uuid: "1234",
    status: RegattaStatus.UPCOMING,
    startTime: new Date(),
  },
};

/**
 * Second generic regatta case
 */
export const TestRegatta2: Story = {
  args: {
    name: "Quinsigamond Snake Regatta",
    uuid: "1234",
    status: RegattaStatus.ACTIVE,
    startTime: new Date("12/1/2024"),
  },
};

/**
 * Third generic regatta case
 */
export const TestRegatta3: Story = {
  args: {
    name: "WPI Inivitational",
    uuid: "1234",
    status: RegattaStatus.FINISHED,
    startTime: new Date("12/12/2025"),
  },
};
