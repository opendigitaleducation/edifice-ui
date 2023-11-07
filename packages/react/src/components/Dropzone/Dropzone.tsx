import { ReactNode, useMemo, useRef, useState } from "react";

import clsx from "clsx";
import { WorkspaceElement } from "edifice-ts-client";

import { DropzoneContext } from "./DropzoneContext";
import DropzoneDrag from "./DropzoneDrag";
import DropzoneFile from "./DropzoneFile";
import DropzoneImport from "./DropzoneImport";
import { useDropzone } from "../../hooks";

export interface AttachmentType {
  type: string;
  size: number;
  name: string;
  src: string;
}

interface DropzoneProps {
  className?: string;
  accept?: string[];
  multiple?: boolean;
  handle?: boolean;
  importMessage?: string;
  children?: ReactNode;
  onSuccess: (res: WorkspaceElement[]) => void;
  onError: (err: string) => void;
}

const Dropzone = ({
  className,
  accept,
  multiple,
  handle = false,
  children,
  importMessage,
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = async (files: FileList | null) => {
    if (files && (accept?.includes(files[0].type) || accept?.length === 0)) {
      for (let i = 0; i < files?.length; i++) {
        setFiles((oldAttachments) => [...oldAttachments, files[i]]);
      }
    }
  };

  const { handleDragLeave, handleDragging, handleDrop, status, dragging } =
    useDropzone(inputRef, handleInputChange);

  const classes = clsx(
    "dropzone",
    {
      "is-dragging": dragging,
      "is-drop-files": files.length !== 0 && !handle ? false : true,
    },
    className,
  );

  const value = useMemo(
    () => ({
      inputRef,
      importMessage,
      files,
      status,
      setFiles,
    }),
    [inputRef, importMessage, files, status, setFiles],
  );

  return (
    <DropzoneContext.Provider value={value}>
      <div
        className={classes}
        onDragEnter={handleDragging}
        onDragOver={handleDragging}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="align-center">
          {handle ? (
            <Dropzone.Drag />
          ) : (
            <>
              {files.length !== 0 ? (
                <div className="drop-file-wrapper">
                  <Dropzone.File />
                  {children}
                </div>
              ) : (
                <Dropzone.Import />
              )}
              <Dropzone.Drag />
            </>
          )}
        </div>
        <input
          ref={inputRef}
          accept={accept?.join(",")}
          multiple={multiple}
          type="file"
          name="attachment-input"
          id="attachment-input"
          onChange={(event) => {
            handleInputChange(event.target.files);
            event.target.value = "";
          }}
          hidden
        />
      </div>
    </DropzoneContext.Provider>
  );
};

Dropzone.File = DropzoneFile;
Dropzone.Import = DropzoneImport;
Dropzone.Drag = DropzoneDrag;

Dropzone.displayName = "Dropzone";

export default Dropzone;
