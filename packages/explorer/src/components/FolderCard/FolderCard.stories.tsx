import { Meta, StoryObj } from "@storybook/react";

import FolderCard from "./FolderCard";
import { useState } from "react";

const meta: Meta<typeof FolderCard> = {
  title: "Components/Card/Folder Card",
  component: FolderCard,
  args: {
    name: "Folder's name",
    app: {
      icon: "blog",
      address: "",
      display: false,
      displayName: "",
      isExternal: false,
      name: "Blog",
      scope: [],
    },
    isSelectable: true,
    isSelected: false,
    onClick: () => {},
    onSelect: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof FolderCard>;

export const Base: Story = {
  render: (args) => {
    return <FolderCard {...args} />;
  },
};

export const ClickOnFolder: Story = {
  render: (args) => {
    const handleOnClick = () => {
      console.log("click");
    };
    return <FolderCard {...args} onClick={handleOnClick} />;
  },
};

export const IsSelectable: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);

    const handleOnSelect = () => {
      setSelected((prev) => !prev);
    };
    return (
      <FolderCard {...args} isSelected={selected} onSelect={handleOnSelect} />
    );
  },
};

export const SelectedState: Story = {
  render: (args) => {
    return <FolderCard {...args} isSelected={true} />;
  },
};
