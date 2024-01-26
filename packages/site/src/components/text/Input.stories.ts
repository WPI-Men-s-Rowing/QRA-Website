import { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";

/**
 * Component for a text input box, used throughout the application
 */
const meta: Meta<typeof Input> = {
  title: "Components/text/Input",
  tags: ["autodocs"],
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Input that says username
 */
export const Username: Story = {
  args: {
    placeholder: "Username",
  },
};

/**
 * Input that says password and is of type password
 */
export const Password: Story = {
  args: {
    placeholder: "Password",
    type: "password",
  },
};
