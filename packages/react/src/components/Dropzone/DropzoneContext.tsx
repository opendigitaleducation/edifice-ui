import { createContext, useContext } from "react";

import { WorkspaceElement } from "edifice-ts-client";

import { Status } from "../../utils/Status";

export interface DropzoneContextType {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  importMessage?: string;
  files: File[];
  status: Status | undefined;
  handleDelete: (element: WorkspaceElement, index: number) => void;
  handleSave: any;
  setFiles: any;
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
