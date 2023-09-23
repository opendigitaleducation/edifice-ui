import { ReactNode, Ref, forwardRef } from "react";

import { useDropdownContext } from "./DropdownContext";

const DropdownMenu = forwardRef(
  ({ children }: { children: ReactNode }, forwardRef: Ref<HTMLDivElement>) => {
    const { menuProps, visible } = useDropdownContext();

    return visible ? (
      <div ref={forwardRef} {...menuProps}>
        {children}
      </div>
    ) : null;
  },
);

DropdownMenu.displayName = "Dropdown.Menu";

export default DropdownMenu;
