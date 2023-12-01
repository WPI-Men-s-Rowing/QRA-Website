import type { Meta, StoryObj } from "@storybook/react";
import JumboTron from "./JumboTron";

/**
 * Component for the JumboTron, displays an image with some text
 */
const meta = {
  title: "Components/JumboTron",
  component: JumboTron,
  tags: ["autodocs"],
} satisfies Meta<typeof JumboTron>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Home page configuration
 */
export const HomePage: Story = {
  args: {
    title: "Quinsigamond Rowing Association, Inc.",
    subtitle: "Lake Quinsigamond, Massachusetts",
    picture: "/donahue.png",
  },
};

/**
 * Regattas page configuration
 */
export const RegattasPage: Story = {
  args: {
    title: "QRA Regattas",
    subtitle: "Hosting quality racing since 1857",
    picture: "/photo.png",
  },
};
