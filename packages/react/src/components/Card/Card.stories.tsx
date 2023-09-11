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
    userSrc: "https://i.pravatar.cc/300",
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
  render: () => {
    return (
      <Card>
        <FolderCard />
      </Card>
    );
  },
};

export const CardWithImage: Story = {
  args: {
    imageSrc:
      "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
  },

  parameters: {
    docs: {
      description: {
        story:
          "If `resourceSrc` is provided, Card Component shows the actual image.",
      },
    },
  },

  render: (args: CardProps) => {
    return (
      <Card {...args}>
        <ResourceCard />
      </Card>
    );
  },
};

export const Variant: Story = {
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-16">
        <Card {...args} className="flex-fill">
          <ResourceCard />
        </Card>
        <Card className="flex-fill">
          <FolderCard />
        </Card>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "If `isFolder` props is set to true, Component will be a folder card. Otherwise, it is a resource card.",
      },
    },
  },
};

export const LoadingStatus: Story = {
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-16">
        <Card isLoading className="flex-fill">
          <ResourceCard />
        </Card>
        <Card isLoading className="flex-fill">
          <FolderCard />
        </Card>
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
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-16">
        <Card isSelected className="flex-fill">
          <ResourceCard />
        </Card>
        <Card isSelected className="flex-fill">
          <FolderCard />
        </Card>
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

export const TooltipShare: Story = {
  render: (args) => {
    const message = "Tooltip Shared";
    return (
      <div className="d-flex align-items-center gap-16">
        <Card messageShared={message} isShared className="flex-fill">
          <ResourceCard />
        </Card>
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story: "Card Component tooltip with picto shared",
      },
    },
  },
};

export const TooltipPublic: Story = {
  render: (args) => {
    const message = "Tooltip Public";
    return (
      <div className="d-flex align-items-center gap-16">
        <Card messagePublic={message} isPublic className="flex-fill">
          <ResourceCard />
        </Card>
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story: "Card Component tooltip with picto public",
      },
    },
  },
};
