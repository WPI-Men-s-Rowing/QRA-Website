import { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

/**
 * Component for a generic button, which is a button with default styling
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Sign-in button, colored red with background text
 */
export const SignIn: Story = {
  args: {
    className: "bg-red text-background",
    children: "Sign In",
  },
};

/**
 * Cancel button, colored background with black text
 */
export const Cancel: Story = {
  args: {
    className: "bg-background text-black border border-divider",
    children: "Cancel",
  },
};
