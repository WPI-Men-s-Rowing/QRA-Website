import { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

/**
 * Component for a text header, used throughout the application
 */
const meta: Meta<typeof Header> = {
  title: "Components/text/Header",
  component: Header,
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Header that says regattas
 */
export const Regattas: Story = {
  args: {
    children: ["Regattas"],
  },
};

/**
 * Header that says About Us
 */
export const AboutUs: Story = {
  args: {
    children: ["About Us"],
  },
};
