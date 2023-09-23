import { Meta, StoryObj } from "@storybook/react";

import Dropdown from "./Dropdown";
import { Edit, Copy, Cut, Print, Delete } from "@edifice-ui/icons";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdowns/DropdownItem",
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: "25em" }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component: "Use `Dropdown.Item` when binding to a specific action",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Base: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger label="Action menu" />
        <Dropdown.Menu>
          <Dropdown.Item icon={<Edit />} onClick={() => alert("edit")}>
            Edit
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item icon={<Copy />} onClick={() => alert("copy")}>
            Copy
          </Dropdown.Item>
          <Dropdown.Item icon={<Cut />} onClick={() => alert("cut")}>
            Cut
          </Dropdown.Item>
          <Dropdown.Item icon={<Print />} onClick={() => alert("print")}>
            Print
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item icon={<Delete />} onClick={() => alert("delete")}>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};
