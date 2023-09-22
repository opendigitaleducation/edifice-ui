import { Meta, StoryObj } from "@storybook/react";

import Card, { CardProps } from "./Card";

export default {
  title: "Components/Card/Base",
  component: Card,
  args: {
    options: {
      name: "Lorem Ipsum",
    },
    isLoading: false,
    onOpen: () => console.log("open"),
    onSelect: () => console.log("select"),
  },
} as Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const Base: Story = {
  render: (args: CardProps) => {
    return <Card {...args} />;
  },
};

export const WithAppIcon: Story = {
  args: {
    options: {
      name: "Lorem Ipsum",
    },
    app: {
      icon: "blog",
      address: "",
      display: false,
      displayName: "",
      isExternal: false,
      name: "Blog",
      scope: [],
    },
  },

  render: (args: CardProps) => {
    return <Card {...args} />;
  },
};
