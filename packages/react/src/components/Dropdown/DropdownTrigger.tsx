import { Ref, forwardRef } from "react";

import { RafterUp } from "@edifice-ui/icons";
import clsx from "clsx";

import { useDropdownContext } from "./DropdownContext";

export interface DropdownTriggerProps
  extends React.ComponentPropsWithRef<"button"> {
  /**
   * Dropdown trigger title
   */
  label?: string;
  /**
   * Add an icon in dropdown trigger
   */
  icon?: React.ReactNode;
  /**
   * Add a badge
   */
  badgeContent?: string | number;
  /**
   * Set appearance
   */
  variant?: "ghost";
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Disabled Trigger
   * */
  disabled?: boolean;
}

export type DropdownTriggerType = React.ReactElement<DropdownTriggerProps>;

const DropdownTrigger = forwardRef(
  (
    {
      label,
      icon,
      variant,
      disabled = false,
      size,
      badgeContent,
    }: DropdownTriggerProps,
    forwardRef: Ref<HTMLButtonElement>,
  ) => {
    const { triggerProps } = useDropdownContext();
    const { className, ...restProps } = triggerProps;

    const dropdownTrigger = clsx(size, variant, className);

    return (
      <button
        ref={forwardRef}
        className={dropdownTrigger}
        disabled={disabled}
        {...restProps}
      >
        {icon ? icon : null}
        {label}
        {badgeContent ? (
          <div>
            <span className="badge text-bg-secondary rounded-pill">
              {badgeContent}
            </span>
          </div>
        ) : (
          <RafterUp width={16} height={16} className="dropdown-toggle-caret" />
        )}
      </button>
    );
  },
);

DropdownTrigger.displayName = "Dropdown.Trigger";

export default DropdownTrigger;
