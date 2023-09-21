import { Meta, StoryObj } from "@storybook/react";

import Dropdown from "./Dropdown";
import {
  Block,
  Copy,
  Cut,
  Delete,
  Edit,
  Filter,
  Headphone,
  Image,
  Print,
} from "@edifice-ui/icons";
import { DropdownMenuOptions } from "./DropdownMenu";
import SelectMenu from "./SelectMenu";
import { useEffect, useState } from "react";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdowns/Base",
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: "400px" }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const options: DropdownMenuOptions[] = [
  {
    id: "1",
    icon: <Image width={22} height={22} />,
    label: "Action label",
    action: () => console.log("click"),
  },
  {
    id: "2",
    icon: <Image width={22} height={22} />,
    label: "Action label",
    action: () => console.log("click"),
  },
  {
    id: "3",
    icon: <Image width={22} height={22} />,
    label: "Action label",
    action: () => console.log("click"),
  },
  {
    id: "4",
    icon: <Image width={22} height={22} />,
    label: "Action label",
    action: () => console.log("click"),
  },
  {
    id: "5",
    icon: <Image width={22} height={22} />,
    label: "Action label",
    action: () => console.log("click"),
  },
  {
    id: "6",
    icon: <Image width={22} height={22} />,
    label: "Action label",
    action: () => console.log("click"),
  },
];

export const Base: Story = {
  render: (args) => {
    return (
      <Dropdown options={options}>
        <Dropdown.Trigger title="Dropdown" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => alert("click")}>
            Dropdown Item
          </Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

export const WithIcon: Story = {
  render: (args) => {
    return (
      <Dropdown options={options}>
        <Dropdown.Trigger title="Dropdown" icon={<Filter />} />
        <Dropdown.Menu>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`Dropdown.Trigger` accepts a prop `icon`",
      },
    },
  },
};

export const ActionMenu: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger title="Action menu" />
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
  parameters: {
    docs: {
      description: {
        story: "Dropdown.Trigger accepts a prop `icon`",
      },
    },
  },
};

export const CheckboxGroup: Story = {
  render: (args) => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<
      (string | number)[]
    >([]);

    const handleMultiCheckbox = (value: string | number) => {
      let checked = [...selectedCheckboxes];
      const findIndex = checked.findIndex(
        (item: string): boolean => item === value,
      );

      if (!selectedCheckboxes.includes(value)) {
        checked = [...selectedCheckboxes, value];
      } else {
        checked = selectedCheckboxes.filter(
          (item: string, index: number) => index !== findIndex,
        );
      }

      setSelectedCheckboxes(checked);
    };

    const checkboxOptions = [
      { label: "Choice 1", value: 1 },
      { label: "Choice 2", value: 2 },
      { label: "Choice 3", value: 3 },
    ];

    return (
      <Dropdown>
        <Dropdown.Trigger title="Dropdown" icon={<Filter />} />
        <Dropdown.Menu>
          {checkboxOptions.map((option, index) => (
            <Dropdown.CheckboxItem
              key={index}
              value={option.value}
              model={selectedCheckboxes}
              onChange={() => handleMultiCheckbox(option.value)}
            >
              {option.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

/* export const ItemCheckbox: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<
      (string | number)[]
    >([]);

    const handleOnChangeRadio = (value: string) => {
      setValue(value);
    };

    const handleMultiCheckbox = (value: string | number) => {
      let checked = [...selectedCheckboxes];
      const findIndex = checked.findIndex(
        (item: string): boolean => item === value,
      );

      if (!selectedCheckboxes.includes(value)) {
        checked = [...selectedCheckboxes, value];
      } else {
        checked = selectedCheckboxes.filter(
          (item: string, index: number) => index !== findIndex,
        );
      }

      setSelectedCheckboxes(checked);
    };

    const radioOptions = [
      {
        label: "Classe préparatoire",
        value: "CP",
      },
      {
        label: "Cours élémentaire 1",
        value: "CM1",
      },
      {
        label: "Cours élémentaire 2",
        value: "CM2",
      },
    ];

    const checkboxOptions = [
      { label: "Choice 1", value: 1 },
      { label: "Choice 2", value: 2 },
      { label: "Choice 3", value: 3 },
    ];

    return (
      <Dropdown>
        <Dropdown.Trigger title="Dropdown" icon={<Filter />} />
        <Dropdown.Menu>
          <Dropdown.Item
            icon={<Image width={22} height={22} />}
            onClick={() => console.log("click")}
          >
            Action label
          </Dropdown.Item>
          <Dropdown.Separator />
          {radioOptions.map((option, index) => (
            <Dropdown.RadioItem
              key={index}
              value={option.value}
              model={value}
              onChange={() => handleOnChangeRadio(option.value)}
            >
              {option.label}
            </Dropdown.RadioItem>
          ))}
          <Dropdown.Separator />
          {checkboxOptions.map((option, index) => (
            <Dropdown.CheckboxItem
              key={index}
              value={option.value}
              model={selectedCheckboxes}
              onChange={() => handleMultiCheckbox(option.value)}
            >
              {option.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
}; */
