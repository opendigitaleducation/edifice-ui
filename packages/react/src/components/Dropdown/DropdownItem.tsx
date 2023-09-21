import { useId } from "react";

import clsx from "clsx";

import { useDropdownContext } from "./DropdownContext";

const DropdownItem = ({ icon, onClick, children, ...restProps }: any) => {
  const { selectedItem, itemProps } = useDropdownContext();

  const { onMenuItemClick, onMenuItemKeyDown } = itemProps;

  const handleOnClick = () => {
    onMenuItemClick();
    onClick?.();
  };

  const id = useId();

  const dropdownItem = clsx("dropdown-item", {
    active: selectedItem?.id === id,
  });

  return (
    <div
      id={id}
      role="menuitem"
      // ref={(el) => (itemsRef.current[i] = el)}
      tabIndex={selectedItem?.id === id ? 0 : -1}
      className={dropdownItem}
      aria-current={selectedItem?.id === id}
      onClick={handleOnClick}
      onKeyDown={onMenuItemKeyDown}
      {...restProps}
    >
      <div className="d-flex gap-8 align-items-center">
        {icon}
        {children}
      </div>
    </div>
  );
};

DropdownItem.displayName = "DropdownItem";

export default DropdownItem;
