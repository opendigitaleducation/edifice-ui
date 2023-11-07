import { createContext, useContext } from "react";

export interface DropzoneContextType {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  importMessage?: string;
  files: File[];
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
