import { useId } from "react";

import clsx from "clsx";

import { useDropdownContext } from "./DropdownContext";

const DropdownItem = ({ icon, onClick, children, ...restProps }: any) => {
  const { itemProps, itemRefs, isFocused } = useDropdownContext();
  const { onMenuItemClick, onMenuItemKeyDown, onMenuItemMouseEnter } =
    itemProps;

  const handleOnClick = () => {
    onMenuItemClick();
    onClick?.();
  };

  const id = useId();

  const dropdownItem = clsx("dropdown-item", {
    focus: isFocused === id,
  });

  return (
    <div
      id={id}
      role="menuitem"
      ref={(el) => (itemRefs.current[id] = el)}
      tabIndex={isFocused === id ? 0 : -1}
      className={dropdownItem}
      aria-current={isFocused === id}
      onClick={handleOnClick}
      onMouseEnter={onMenuItemMouseEnter}
      onKeyDown={(event) => onMenuItemKeyDown(event, onClick)}
      {...restProps}
    >
      <div className="d-flex gap-8 align-items-center">
        {icon}
        {children}
      </div>
    </div>
  );
};

DropdownItem.displayName = "Dropdown.Item";

export default DropdownItem;
