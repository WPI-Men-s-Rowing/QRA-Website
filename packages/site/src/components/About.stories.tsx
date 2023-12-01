import type { Meta, StoryObj } from "@storybook/react";
import About from "./About";

/**
 * Component for the homepage about section
 */
const meta = {
    title: "Components/About",
    component: About,
    tags: ["autodocs"],
  } satisfies Meta<typeof About>;
  
  export default meta;
  
  type Story = StoryObj<typeof meta>;

  /**
   * Default configuration of the about section
   */
  export const Default: Story = {
  };