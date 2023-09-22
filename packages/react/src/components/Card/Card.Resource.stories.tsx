import { Meta, StoryObj } from "@storybook/react";

import Card, { CardProps } from "./Card";

export default {
  title: "Components/Card/Resource Card",
  component: Card,
  args: {
    options: {
      type: "resource",
      name: "Lorem Ipsum",
      creatorName: "tom.mate",
      userSrc: "https://i.pravatar.cc/300",
      updatedAt: "2 days ago",
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

export const Resource: Story = {
  render: (args: CardProps) => {
    return <Card {...args} />;
  },
};

export const WithImage: Story = {
  args: {
    options: {
      name: "Lorem Ipsum",
      imageSrc:
        "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
    },
  },
  render: (args: CardProps) => {
    return <Card {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: "Add `imageSrc` in `options` to display the current image",
      },
    },
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
            type: "resource",
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
            type: "resource",
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

export const TooltipShare: Story = {
  args: {
    ...Resource.args,
    options: {
      type: "resource",
      name: "Lorem Ipsum",
      creatorName: "tom.mate",
      userSrc: "https://i.pravatar.cc/300",
      updatedAt: "2 days ago",
      isShared: true,
    },
  },
  render: (args) => {
    const tooltips = {
      messageShared: "Tooltip Shared",
    };
    return (
      <div className="d-flex align-items-center gap-16">
        <Card {...args} tooltips={tooltips} className="flex-fill"></Card>
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
  args: {
    ...Resource.args,
    options: {
      type: "resource",
      name: "Lorem Ipsum",
      creatorName: "tom.mate",
      userSrc: "https://i.pravatar.cc/300",
      updatedAt: "2 days ago",
      isPublic: true,
    },
  },
  render: (args) => {
    const tooltips = {
      messagePublic: "Tooltip Public",
    };
    return (
      <div className="d-flex align-items-center gap-16">
        <Card {...args} tooltips={tooltips} className="flex-fill"></Card>
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
