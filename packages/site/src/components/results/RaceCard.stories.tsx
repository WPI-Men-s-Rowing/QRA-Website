import type { Meta, StoryObj } from "@storybook/react";
import RaceCard from "./RaceCard";
import { RegattaStatus } from "@/types/types";

/**
 * Component for a race card, providing navigation information to a race details page
 */
const meta = {
  title: "Components/results/RaceCard",
  component: RaceCard,
  tags: ["autodocs"],
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
  }
};

/**
 * Second generic regatta case
 */
export const TestRegatta2: Story = {
  args: {
    name: "Quinsigamond Snake Regatta",
    uuid: "1234",
    status: RegattaStatus.ACTIVE,
  }
};

/**
 * Third generic regatta case
 */
export const TestRegatta3: Story = {
  args: {
    name: "WPI Inivitational",
    uuid: "1234",
    status: RegattaStatus.FINISHED
  }
};
