import { Ref, forwardRef } from "react";
import React from "react";

import { useDropdownContext } from "./DropdownContext";

export type DropdownMenuOptions =
  | {
      id: string;
      /**
       * Object type
       */
      type?: undefined;
      /**
       * Icon component
       */
      icon: JSX.Element;
      /**
       * Label for a11y
       */
      label: string;
      /**
       * Action OnClick
       */
      action: (elem: any) => any;
    }
  | {
      id: string;
      /**
       * Object type
       */
      type: "divider";
    };

export interface DropdownMenuProps extends React.ComponentPropsWithRef<"ul"> {
  /** Dropdown options */
  options: DropdownMenuOptions[];
}

const DropdownMenu = forwardRef(
  ({ children }: any, forwardRef: Ref<HTMLUListElement>) => {
    const { menuProps } = useDropdownContext();

    return (
      <div ref={forwardRef} {...menuProps}>
        {children}
      </div>
    );
  },
);

DropdownMenu.displayName = "DropdownMenu";

export default DropdownMenu;
