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
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Base: Story = {
  render: (args) => <Toolbar {...args} />,
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

export const WithDropdownAction: Story = {
  render: (args) => <Toolbar {...args} />,
  decorators: [(Story) => <div style={{ height: "300px" }}>{Story()}</div>],
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
        hasDropdown: true,
        content: () => (
          <div>
            <div onClick={() => console.log("click 1")}>Write something...</div>
            <div onClick={() => console.log("click 2")}>Edit something...</div>
          </div>
        ),
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

export const WithoutShadowDropdownAction: Story = {
  render: (args) => <Toolbar {...args} />,
  decorators: [(Story) => <div style={{ height: "300px" }}>{Story()}</div>],
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
        hasDropdown: true,
        content: () => (
          <div>
            <div onClick={() => console.log("click 1")}>Write something...</div>
            <div onClick={() => console.log("click 2")}>Edit something...</div>
          </div>
        ),
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
