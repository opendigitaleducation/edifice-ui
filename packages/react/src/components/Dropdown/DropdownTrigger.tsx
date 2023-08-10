import { forwardRef, Ref } from "react";

import { RafterUp } from "@edifice-ui/icons";
import clsx from "clsx";

export interface DropdownTriggerProps
  extends React.ComponentPropsWithRef<"button"> {
  /**
   * Dropdown trigger title
   */
  title: string;
  /**
   * Set appearance
   */
  variant?: "ghost" | "outline";
  /**
   * Controlable state off dropdown trigger
   */
  state?: "default" | "hover" | "selected" | "disabled" | "focus";
  /**
   * Add an icon in dropdown trigger
   */
  icon?: React.ReactNode;
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Add a badge
   */
  badgeContent?: string | number;
  /**
   * Stretch the dropdown trigger.
   */
  grow?: boolean;
}

export type DropdownTriggerType = React.ReactElement<DropdownTriggerProps>;

const DropdownTrigger = forwardRef(
  (
    {
      title = "",
      state,
      variant,
      icon,
      size = "md",
      grow = false,
      badgeContent,
      ...props
    }: DropdownTriggerProps,
    ref: Ref<HTMLButtonElement>,
  ) => {
    const classNames = clsx(
      "dropdown-trigger",
      state,
      size,
      variant,
      grow && "flex-grow-1 justify-content-between",
    );

    return (
      <button ref={ref} className={classNames} {...props} type="button">
        {icon && <div className="dropdown-trigger-icon">{icon}</div>}
        <div>{title}</div>
        {badgeContent ? (
          <div>
            <span className="badge text-bg-secondary  rounded-pill">
              {badgeContent}
            </span>
          </div>
        ) : (
          <div className="dropdown-trigger-carret-icon">
            {<RafterUp width={16} height={16} />}
          </div>
        )}
      </button>
    );
  },
);

DropdownTrigger.displayName = "DropdownTrigger";

export default DropdownTrigger;
