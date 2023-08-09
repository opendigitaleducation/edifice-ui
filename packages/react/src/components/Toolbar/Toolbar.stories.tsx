import { Meta, StoryObj } from "@storybook/react";

import Toolbar from "./Toolbar";
import { RecordVideo, Save, Write, Plus, Delete } from "@edifice-ui/icons";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Toolbar> = {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
  argTypes: {
    variant: {
      options: ["default", "no-shadow"],
      control: { type: "select" },
    },
    isBlock: { control: "boolean" },
    align: {
      options: ["left", "center", "space", "right"],
      control: { type: "select" },
    },
  },
  args: {
    data: [
      {
        action: () => console.log("on click"),
        icon: <RecordVideo />,
        label: "record",
        name: "record",
      },
      {
        action: () => console.log("on click"),
        icon: <Save />,
        label: "save",
        name: "save",
      },
      {
        type: "divider",
      },
      {
        action: () => console.log("on click"),
        icon: <Write />,
        label: "write",
        name: "write",
      },
      {
        action: () => console.log("on click"),
        icon: <Delete />,
        label: "delete",
        name: "delete",
      },
    ],
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Base: Story = {
  render: (args) => <Toolbar {...args} />,
};

export const Empty: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    data: [],
  },
};

export const WithDivider: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    data: [
      {
        action: () => console.log("on click"),
        icon: <RecordVideo />,
        label: "record",
        name: "record",
      },
      {
        action: () => console.log("on click"),
        icon: <Save />,
        label: "save",
        name: "save",
      },
      {
        type: "divider",
      },
      {
        action: () => console.log("on click"),
        icon: <Write />,
        label: "write",
        name: "write",
      },
      {
        action: () => console.log("on click"),
        icon: <Delete />,
        label: "delete",
        name: "delete",
      },
    ] as any,
  },
};

export const WithPrimaryAction: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    data: [
      {
        action: () => console.log("on click"),
        icon: <Save />,
        label: "save",
        name: "save",
      },
      {
        action: () => console.log("on click"),
        icon: <Write />,
        label: "write",
        name: "write",
      },
      {
        action: () => console.log("on click"),
        icon: <Plus />,
        label: "plus",
        name: "plus",
        type: "primary",
      },
    ],
  },
};

export const WithoutShadow: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    data: [
      {
        action: () => console.log("on click"),
        icon: <RecordVideo />,
        label: "record",
        name: "record",
      },
      {
        action: () => console.log("on click"),
        icon: <Write />,
        label: "write",
        name: "write",
      },
    ],
    variant: "no-shadow",
  },
};

export const WithoutShadowButDivider: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    data: [
      {
        action: () => console.log("on click"),
        icon: <RecordVideo />,
        label: "record",
        name: "record",
      },
      {
        type: "divider",
      },
      {
        action: () => console.log("on click"),
        icon: <Write />,
        label: "write",
        name: "write",
      },
    ],
    variant: "no-shadow",
  },
};

export const WithoutShadowButPrimaryAction: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    variant: "no-shadow",
    data: [
      {
        action: () => console.log("on click"),
        icon: <Save />,
        label: "save",
        name: "save",
      },
      {
        action: () => console.log("on click"),
        icon: <Write />,
        label: "write",
        name: "write",
      },
      {
        action: () => console.log("on click"),
        icon: <Plus />,
        label: "plus",
        name: "plus",
        type: "primary",
      },
    ],
  },
};
