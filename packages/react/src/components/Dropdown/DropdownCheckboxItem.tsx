import { useEffect, useId } from "react";

import clsx from "clsx";

import { useDropdownContext } from "./DropdownContext";
import { Checkbox } from "../Checkbox";

/* const DropdownItem = ({
  option,
  onClick,
}: {
  option: any;
  onClick?: () => void;
}) => { */
const DropdownCheckboxItem = ({ children, value, model, onChange }: any) => {
  const { selectedItem, itemProps } = useDropdownContext();
  const { onMenuItemClick, onMenuItemKeyDown } = itemProps;

  const id = useId();

  const checked = model.includes(value);

  const checkboxProps = {
    value,
    model,
    checked,
    readOnly: true,
  };

  const dropdownCheckboxItem = clsx("dropdown-item c-pointer", {
    active: value === model || selectedItem?.id === id || checked,
  });

  return (
    <div
      id={id}
      role="menuitemcheckbox"
      aria-checked={checked}
      onMouseUp={() => onChange(value)}
      /* onKeyDown={(event) => {
        event.key === "Enter" && console.log("enter");
        onMenuItemKeyDown();
      }} */
      onKeyDown={onMenuItemKeyDown}
      tabIndex={value === model ? 0 : -1}
      className={dropdownCheckboxItem}
    >
      <div className="d-flex gap-8 align-items-center justify-content-between position-relative">
        {children}
        <Checkbox {...checkboxProps} />
      </div>
    </div>
  );
};

DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

export default DropdownCheckboxItem;
