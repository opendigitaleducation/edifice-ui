import { useId } from "react";

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
  const { itemProps, itemRefs, isFocused } = useDropdownContext();
  const { onMenuItemKeyDown, onMenuItemMouseEnter } = itemProps;

  const id = useId();

  const checked = model.includes(value);

  const checkboxProps = {
    value,
    model,
    checked,
    readOnly: true,
  };

  const dropdownCheckboxItem = clsx("dropdown-item c-pointer", {
    focus: isFocused === id,
  });

  return (
    <div
      id={id}
      ref={(el) => (itemRefs.current[id] = el)}
      role="menuitemcheckbox"
      aria-checked={checked}
      onMouseUp={() => onChange(value)}
      onKeyDown={(event) => onMenuItemKeyDown(event, () => onChange(value))}
      onMouseEnter={onMenuItemMouseEnter}
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

DropdownCheckboxItem.displayName = "Dropdown.CheckboxItem";

export default DropdownCheckboxItem;
