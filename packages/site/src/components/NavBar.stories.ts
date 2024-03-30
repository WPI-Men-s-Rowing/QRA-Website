import type { Meta, StoryObj } from "@storybook/react";
import NavBar from "./NavBar";

/**
 * Component for the NavBar, displays the system wide nav-bar
 */
const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar",
  component: NavBar,
  tags: ["autodocs"],
} satisfies Meta<typeof NavBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The system navigation bar
 */
export const Default: Story = {};
