import { useId } from "react";

import clsx from "clsx";

import { useDropdownContext } from "./DropdownContext";
import { Radio } from "../Radio";

/* const DropdownItem = ({
  option,
  onClick,
}: {
  option: any;
  onClick?: () => void;
}) => { */
const DropdownRadioItem = ({ children, value, model, onChange }: any) => {
  const { selectedItem } = useDropdownContext();

  const id = useId();

  const checked = value === model;

  const radioProps = {
    value,
    model,
    checked,
    readOnly: true,
  };

  const dropdownRadioItem = clsx("dropdown-item c-pointer", {
    active: value === model || selectedItem?.id === id,
  });

  return (
    <div
      id={id}
      role="menuitemradio"
      aria-checked={value === model}
      onMouseUp={() => onChange(value)}
      tabIndex={value === model ? 0 : -1}
      className={dropdownRadioItem}
    >
      <div className="d-flex gap-8 align-items-center justify-content-between position-relative">
        {children}
        <Radio
          {...radioProps}
          className="position-absolute start-0 end-0 top-0 bottom-0 opacity-0"
        />
      </div>
    </div>
  );
};

DropdownRadioItem.displayName = "DropdownRadioItem";

export default DropdownRadioItem;
