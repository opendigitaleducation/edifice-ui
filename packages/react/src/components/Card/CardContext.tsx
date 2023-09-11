import { createContext, useContext } from "react";

import { IWebApp } from "edifice-ts-client";

export interface ContextProps {
  name?: string;
  app?: IWebApp;
  classesName?: string;
  classesProfile: string;
  classesTitle: string;
  classesText: string;
  classesFiles: string;
  imageSrc: string;
  creatorName: string;
  updatedAt?: string;
  isShared?: boolean;
  isPublic?: boolean;
  userSrc?: string;
  messageShared?: string;
  messagePublic?: string;
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
