import { ReactNode, Ref, forwardRef } from "react";

import { useDropdownContext } from "./DropdownContext";

const DropdownMenu = forwardRef(
  ({ children }: { children: ReactNode }, forwardRef: Ref<HTMLDivElement>) => {
    const { menuProps } = useDropdownContext();

    return (
      <div ref={forwardRef} {...menuProps}>
        {children}
      </div>
    );
  },
);

DropdownMenu.displayName = "Dropdown.Menu";

export default DropdownMenu;
