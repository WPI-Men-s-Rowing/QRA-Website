import type { Meta, StoryObj } from "@storybook/react";
import ShortCuts from "./ShortCuts";

/**
 * Component for the links on the homepage
 */
const meta = {
    title: "Components/ShortCuts",
    component: ShortCuts,
    tags: ["autodocs"],
  } satisfies Meta<typeof ShortCuts>;
  
  export default meta;
  
  type Story = StoryObj<typeof meta>;

  /**
   * Default configuration of the homepage links
   */
  export const Default: Story = {
  };