import { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";
import ResourceCard from "./ResourceCard";

const meta: Meta<typeof ResourceCard> = {
  title: "Components/Card/Resource Card",
  component: ResourceCard,
  args: {
    resource: {
      name: "File's name",
      creatorName: "Stéphane Loison",
      creatorId: "123",
      public: false,
      rights: [],
      thumbnail:
        "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
    },
    time: "2 days ago",
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
};

export default meta;
type Story = StoryObj<typeof ResourceCard>;

export const Base: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);
    const handleOnClick = () => {
      setSelected((prev) => !prev);
    };
    const handleOnSelect = () => {
      setSelected((prev) => !prev);
    };
    return (
      <ResourceCard
        {...args}
        isSelectable={true}
        isSelected={selected}
        onClick={handleOnClick}
        onSelect={handleOnSelect}
      />
    );
  },
};

export const ResourceIsShared: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);
    const handleOnClick = () => {
      setSelected((prev) => !prev);
    };
    const handleOnSelect = () => {
      setSelected((prev) => !prev);
    };
    return (
      <ResourceCard
        {...args}
        isSelectable={true}
        isSelected={selected}
        onClick={handleOnClick}
        onSelect={handleOnSelect}
      />
    );
  },
  args: {
    resource: {
      name: "File's name",
      creatorName: "Stéphane Loison",
      creatorId: "123",
      public: false,
      rights: ["123", "246"],
      thumbnail:
        "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
    },
  },
};

export const ResourceIsPublic: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);
    const handleOnClick = () => {
      setSelected((prev) => !prev);
    };
    const handleOnSelect = () => {
      setSelected((prev) => !prev);
    };
    return (
      <ResourceCard
        {...args}
        isSelectable={true}
        isSelected={selected}
        onClick={handleOnClick}
        onSelect={handleOnSelect}
      />
    );
  },
  args: {
    resource: {
      name: "File's name",
      creatorName: "Stéphane Loison",
      creatorId: "123",
      public: true,
      rights: [],
      thumbnail:
        "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
    },
  },
};

export const IsSelectable: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);
    const handleOnClick = () => {
      setSelected((prev) => !prev);
    };
    const handleOnSelect = () => {
      setSelected((prev) => !prev);
    };
    return (
      <ResourceCard
        {...args}
        isSelectable={true}
        isSelected={selected}
        onClick={handleOnClick}
        onSelect={handleOnSelect}
      />
    );
  },
};

export const SelectedState: Story = {
  render: (args) => {
    return <ResourceCard {...args} isSelectable={true} isSelected={true} />;
  },
};
