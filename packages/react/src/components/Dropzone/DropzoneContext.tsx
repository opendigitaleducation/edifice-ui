import { createContext, useContext } from "react";

import { WorkspaceElement } from "edifice-ts-client";

export interface DropzoneContextType {
  files: File[];
  inputRef: any;
  importMessage: string | undefined;
  onSuccess: (res: WorkspaceElement[]) => void;
}

export const DropzoneContext = createContext<DropzoneContextType | null>(null);

export function useDropzoneContext() {
  const context = useContext(DropzoneContext);
  if (!context) {
    throw new Error(
      "Dropzone compound components cannot be rendered outside the Dropzone component",
    );
  }
  return context;
}
