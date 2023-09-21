import { useId, useMemo } from "react";

import DropdownCheckboxItem from "./DropdownCheckboxItem";
import { DropdownContext } from "./DropdownContext";
import DropdownItem from "./DropdownItem";
import DropdownMenu from "./DropdownMenu";
import DropdownRadioItem from "./DropdownRadioItem";
import DropdownSeparator from "./DropdownSeparator";
import DropdownTrigger from "./DropdownTrigger";
import { useDropdown } from "./useDropdown";
import { useClickOutside } from "../../hooks";

const Root = ({ children }: any) => {
  const {
    visible,
    triggerRef,
    menuRef,
    selectedItem,
    onTriggerClick,
    onTriggerKeyDown,
    onMenuItemKeyDown,
    onMenuKeyDown,
    onMenuItemClick,
    setVisible,
  } = useDropdown();

  /* Unique Dropdown Id */
  const id = useId();

  /* TriggerProps to spread to any Trigger Component */
  const triggerProps = useMemo(
    () => ({
      ref: triggerRef,
      id: `dropdown-toggle-${id}`,
      "aria-haspopup": "menu",
      "aria-controls": `dropdown-${id}`,
      "aria-expanded": visible ? true : false,
      className: `dropdown-toggle ${visible ? "selected" : ""}`,
      onClick: onTriggerClick,
      onKeyDown: onTriggerKeyDown,
    }),
    [id, onTriggerClick, onTriggerKeyDown, triggerRef, visible],
  );

  /* MenuProps to spread to any Menu Component */
  const menuProps = useMemo(
    () => ({
      ref: menuRef,
      // onKeyDown: onMenuKeyDown,
      tabIndex: -1,
      className: "dropdown-menu bg-white shadow rounded-4 py-12 px-8",
      "aria-labelledby": `dropdown-toggle-${id}`,
      "aria-activedescendant": selectedItem?.id,
      style: { display: visible ? "flex" : "none" },
    }),
    [id, menuRef, selectedItem?.id, visible],
  );

  /* ItemProps to spread to any Item Component */
  const itemProps = useMemo(
    () => ({
      onMenuItemClick,
      onMenuItemKeyDown,
    }),
    [onMenuItemClick, onMenuItemKeyDown],
  );

  /* Ref to close dropdown when clicking outside */
  const ref = useClickOutside(() => setVisible(false));

  const value = useMemo(
    () => ({
      id,
      visible,
      triggerProps,
      menuProps,
      itemProps,
      selectedItem,
    }),
    [id, visible, triggerProps, menuProps, itemProps, selectedItem],
  );

  return (
    <DropdownContext.Provider value={value}>
      <div ref={ref} className="dropdown">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

Root.displayName = "Dropdown";

/* Compound Components */
const Dropdown = Object.assign(Root, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  CheckboxItem: DropdownCheckboxItem,
  RadioItem: DropdownRadioItem,
});

export default Dropdown;
