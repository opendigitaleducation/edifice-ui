import { Meta, StoryObj } from "@storybook/react";
import Library, { LibraryProps } from "./Library";
import React from "react";

const meta: Meta<typeof Library> = {
  title: "Components/Library",
  component: Library,
  parameters: {
    docs: {
      description: {
        component: "Component library",
      },
    },
  },
  args: {
    text: "Découvrez plein d'activités à réutiliser dans la bibliothèque !",
    textButton: "Découvrir",
    src: "/assets/themes/edifice-bootstrap/images/image-library-one.svg",
    alt: "Découvrir la bibliothèque",
    url: "#",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Library>;

export const LibraryOne: Story = {
  render: (args: LibraryProps) => <Library {...args} />,
};

export const LibraryNeo: Story = {
  args: {
    src: "/assets/themes/edifice-bootstrap/images/image-library-neo.svg",
  },
};
