import { Meta, StoryObj } from "@storybook/react";

import Card from "./Card";

export default {
  title: "Components/Card/Folder Card",
  component: Card,
  args: {
    options: {
      type: "folder",
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
    isLoading: false,
    onOpen: () => console.log("open"),
    onSelect: () => console.log("select"),
  },
} as Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const Folder: Story = {
  render: (args) => {
    return <Card {...args} />;
  },
};

export const LoadingStatus: Story = {
  args: {
    isLoading: true,
  },
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-16">
        <Card
          {...args}
          options={{
            type: "folder",
            name: "Lorem Ipsum",
            imageSrc:
              "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
          }}
          className="flex-fill"
        />
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "Card Component accepts an `isLoading` prop to show loading status.",
      },
    },
  },
};

export const SelectedState: Story = {
  args: {
    isSelected: true,
  },
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-16">
        <Card
          {...args}
          options={{
            type: "folder",
            name: "Lorem Ipsum",
            imageSrc:
              "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
          }}
          className="flex-fill"
        />
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "Prop `isSelected` is used when any action can be performed with the ActionBar Component.",
      },
    },
  },
};
