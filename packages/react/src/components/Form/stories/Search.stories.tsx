import { Search } from "@edifice-ui/icons";
import { Meta, StoryObj } from "@storybook/react";
import SearchButton from "../../Button/SearchButton";

import { FormControl } from "../../index";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof FormControl> = {
  title: "Forms/Search",
  component: FormControl,
  parameters: {
    docs: {
      description: {
        component:
          "The Search Bar is the composition of FormControl, Input and SearchButton components. Adding the `input-group` class to the FormControl component will add the right style. All components have access to all their expected props.",
      },
    },
  },
  argTypes: {
    status: {
      options: ["valid", "invalid"],
      control: { type: "select" },
    },
  },
  args: {
    id: "search",
    isOptional: false,
    isReadOnly: false,
    isRequired: false,
    status: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof FormControl>;

const Template = (args: any) => (
  <FormControl id={args.id} status={args.status} className="input-group">
    <FormControl.Input
      type="search"
      placeholder="Placeholder text"
      size="md"
      noValidationIcon
    />
    <SearchButton type="submit" aria-label="search" icon={<Search />} />
  </FormControl>
);

export const Base: Story = {
  render: Template,
};

export const Large: Story = {
  render: (args) => {
    return (
      <FormControl id="large-search" className="input-group">
        <FormControl.Input
          type="search"
          placeholder="Placeholder text"
          size="lg"
          noValidationIcon
        />
        <SearchButton type="submit" aria-label="search" icon={<Search />} />
      </FormControl>
    );
  },
};
