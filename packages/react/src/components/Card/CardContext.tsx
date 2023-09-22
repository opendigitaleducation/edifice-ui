import { createContext, useContext } from "react";

import { IWebApp } from "edifice-ts-client";

import { CardOptions, TooltipOptions } from "./Card";

export interface ContextProps {
  options: CardOptions;
  isLoading?: boolean;
  classesTitle?: string;
  app: IWebApp;
  appCode?: string;
  tooltips?: TooltipOptions;
}

export const CardContext = createContext<ContextProps | null>(null!);

CardContext.displayName = "CardContext";

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Card component`);
  }
  return context;
};
