import { Meta, StoryObj } from "@storybook/react";

import Dropzone from "./Dropzone";
import { UploadCard } from "../../multimedia";
import Files from "../../multimedia/MediaLibrary/innertabs/Files";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Dropzone> = {
  title: "Components/Dropzone",
  component: Dropzone,
  args: {
    accept: [],
    onSuccess: () => console.log("Success"),
    onError: () => console.log("Error"),
    importMessage:
      "Glissez-déposez un/des fichier(s) depuis votre appareil ou cliquez sur parcourir",
  },
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Base: Story = {};

export const Handle: Story = {
  render: (args) => {
    return <Dropzone {...args} handle={true} />;
  },
};

export const OneElement: Story = {
  render: (args) => {
    return <Dropzone {...args} multiple={false} />;
  },
};

export const MultipleElement: Story = {
  render: (args) => {
    return <Dropzone {...args} multiple={true} />;
  },
};
