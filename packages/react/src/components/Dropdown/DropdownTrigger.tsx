import { Ref, forwardRef } from "react";

import { RafterUp } from "@edifice-ui/icons";

import { useDropdownContext } from "./DropdownContext";

export interface DropdownTriggerProps
  extends React.ComponentPropsWithRef<"button"> {
  /**
   * Dropdown trigger title
   */
  title: string;
  /**
   * Add an icon in dropdown trigger
   */
  icon?: React.ReactNode;
  //   /**
  //    * Set appearance
  //    */
  //   variant?: "ghost" | "outline";
  //   /**
  //    * Controlable state off dropdown trigger
  //    */
  //   state?: "default" | "hover" | "selected" | "disabled" | "focus";
  //   /**
  //    * Add an icon in dropdown trigger
  //    */
  //   icon?: React.ReactNode;
  //   /**
  //    * Button size
  //    */
  //   size?: "sm" | "md" | "lg";
  //   /**
  //    * Add a badge
  //    */
  //   badgeContent?: string | number;
  //   /**
  //    * Stretch the dropdown trigger.
  //    */
  //   grow?: boolean;
}

export type DropdownTriggerType = React.ReactElement<DropdownTriggerProps>;

const DropdownTrigger = forwardRef(
  (
    { title, icon }: DropdownTriggerProps,
    forwardRef: Ref<HTMLButtonElement>,
  ) => {
    const { triggerProps } = useDropdownContext();

    return (
      <button ref={forwardRef} {...triggerProps}>
        {icon ? icon : null}
        {title}
        <RafterUp width={16} height={16} className="dropdown-toggle-caret" />
      </button>
    );
  },
);

DropdownTrigger.displayName = "Dropdown.Trigger";

export default DropdownTrigger;
