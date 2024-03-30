import type { Meta, StoryObj } from "@storybook/react";
import Footer from "./Footer";

/**
 * Component for the footer, displays the system wide footer
 */
const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The system footer bar
 */
export const Default: Story = {};
