import { createContext, useContext } from "react";

export const DropdownContext = createContext<{
  triggerProps: any;
  menuProps: any;
} | null>(null!);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Dropdown Component`);
  }
  return context;
};
