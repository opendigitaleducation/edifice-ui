import { Meta, StoryObj } from "@storybook/react";

import List, { ListProps } from "./List";
import { RefAttributes } from "react";

type Item = {
  _id: string;
  name: string;
  eType: string;
  owner: string;
};

const meta: Meta<typeof List<Item>> = {
  title: "Components/List",
  component: List<Item>,
  args: {
    items: [
      {
        _id: "file1",
        name: "File 1",
        eType: "file",
        owner: "John",
      },
      {
        _id: "file2",
        name: "File 2",
        eType: "file",
        owner: "Sarah",
      },
      {
        _id: "file3",
        name: "File 3",
        eType: "file",
        owner: "Connor",
      },
    ] as Item[],
  },
};

export default meta;

type Story = StoryObj<typeof List<Item>>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args: ListProps<Item> & RefAttributes<HTMLDivElement>) => {
    function cardRenderer(item: Item, index: number) {
      return (
        <>
          A card with index={index} for {item?.name}
        </>
      );
    }
    function rowRenderer(item: Item, index: number) {
      return (
        <>
          A row with index={index} for {item?.name}
        </>
      );
    }
    return (
      <List keyField="_id" items={args.items} cardRenderer={cardRenderer} />
    );
  },
};
