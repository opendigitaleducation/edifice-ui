import { ReactNode, Ref, forwardRef } from "react";

const DropdownMenuGroup = forwardRef(
  (
    { label, children }: { label: string; children: ReactNode },
    forwardRef: Ref<HTMLDivElement>,
  ) => {
    return (
      <div ref={forwardRef} role="group">
        <span className="small px-4">
          <strong>{label}</strong>
        </span>
        {children}
      </div>
    );
  },
);

DropdownMenuGroup.displayName = "Dropdown.MenuGroup";

export default DropdownMenuGroup;
