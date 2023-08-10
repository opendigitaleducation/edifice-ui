import { Meta, StoryObj } from "@storybook/react";
import Toolbar from "../../components/Toolbar/Toolbar";
import {
  AlignLeft,
  Attachment,
  BulletList,
  Landscape,
  Link,
  Mic,
  RecordVideo,
  Smiley,
  TextBold,
  TextColor,
  TextHighlight,
  TextItalic,
  TextSize,
  TextTypo,
  TextUnderline,
} from "@edifice-ui/icons";

const data = [
  {
    action: () => console.log("on click"),
    icon: <Landscape />,
    label: "image",
    name: "image",
    className: "widget-image",
  },
  {
    action: () => console.log("on click"),
    icon: <RecordVideo />,
    label: "video",
    name: "video",
    className: "widget-video",
  },
  {
    action: () => console.log("on click"),
    icon: <Mic />,
    label: "audio",
    name: "audio",
    className: "widget-audio",
  },
  {
    action: () => console.log("on click"),
    icon: <Attachment />,
    label: "attachment",
    name: "attachment",
    className: "widget-attachment",
  },
  {
    type: "divider",
  },
  {
    action: () => console.log("on click"),
    icon: <TextTypo />,
    label: "typo",
    name: "typo",
  },
  {
    action: () => console.log("on click"),
    icon: <TextSize />,
    label: "size",
    name: "size",
  },
  {
    action: () => console.log("on click"),
    icon: <TextColor />,
    label: "color",
    name: "color",
  },
  {
    action: () => console.log("on click"),
    icon: <TextHighlight />,
    label: "highlight",
    name: "highlight",
  },
  {
    type: "divider",
  },
  {
    action: () => console.log("on click"),
    icon: <TextBold />,
    label: "bold",
    name: "bold",
    isActive: false,
  },
  {
    action: () => console.log("on click"),
    icon: <TextItalic />,
    label: "italic",
    name: "italic",
  },
  {
    action: () => console.log("on click"),
    icon: <TextUnderline />,
    label: "underline",
    name: "underline",
  },
  {
    type: "divider",
  },
  {
    action: () => console.log("on click"),
    icon: <Smiley />,
    label: "emoji",
    name: "emoji",
  },
  {
    action: () => console.log("on click"),
    icon: <Link />,
    label: "linker",
    name: "linker",
  },
  {
    type: "divider",
  },
  {
    action: () => console.log("on click"),
    icon: <BulletList />,
    label: "list",
    name: "list",
  },
  {
    action: () => console.log("on click"),
    icon: <AlignLeft />,
    label: "alignment",
    name: "alignment",
  },
];

const meta: Meta<typeof Toolbar> = {
  title: "Tiptap/EditorToolbar",
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component: "EditorToolbar extends the Toolbar Component",
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
    data,
    variant: "no-shadow",
  },
  decorators: [(Story) => <div style={{ height: "600px" }}>{Story()}</div>],
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Base: Story = {
  render: (args) => {
    return <Toolbar {...args} />;
  },
};
