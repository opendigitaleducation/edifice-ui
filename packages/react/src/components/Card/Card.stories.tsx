import { Meta, StoryObj } from "@storybook/react";

import Card, { CardProps } from "./Card";
import FolderCard from "./FolderCard";
import ResourceCard from "./ResourceCard";

export default {
  title: "Components/Card",
  component: Card,
  args: {
    app: {
      icon: "blog",
      address: "",
      display: false,
      displayName: "",
      isExternal: false,
      name: "Blog",
      scope: [],
    },
    onOpen: () => console.log("open"),
    onSelect: () => console.log("select"),
  },
} as Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const Base: Story = {
  render: (args: CardProps) => {
    return (
      <Card {...args}>
        <ResourceCard />
      </Card>
    );
  },
};

export const CardFolder: Story = {
  render: (args: CardProps) => {
    return (
      <Card {...args}>
        <FolderCard />
      </Card>
    );
  },
};
