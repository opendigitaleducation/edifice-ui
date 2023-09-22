import { useState } from "react";

import { Meta, StoryObj } from "@storybook/react";

import SelectList, { SelectListProps } from "./SelectList";
import { Headphone, Block, Lock } from "@edifice-ui/icons";

const meta: Meta<typeof SelectList> = {
  title: "Components/SelectList",
  component: SelectList,
  argTypes: {
    hideCheckbox: { control: "boolean" },
    onChange: { control: false },
    model: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof SelectList>;

export const Base: Story = {
  render: (args: SelectListProps) => {
    const [listModel, setListModel] = useState<(string | number)[]>([]);

    return (
      <div>
        <SelectList
          options={args.options}
          hideCheckbox={args.hideCheckbox}
          model={listModel}
          onChange={(model) => setListModel(model)}
        />
        <div className="my-32 p-8 bg-light">
          Selected options : {listModel.map((item) => item + ", ")}
        </div>
      </div>
    );
  },

  args: {
    options: [
      {
        value: "disable",
        label: "Disable",
        icon: Block,
      },
      {
        value: "audio",
        label: "Enable audio conference",
        icon: Headphone,
      },
      {
        value: "secure_mode",
        label: "Secure mode",
        icon: Lock,
      },
    ],
  },
};
