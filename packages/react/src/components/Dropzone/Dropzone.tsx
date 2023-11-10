import { ReactNode, useMemo, useRef, useState } from "react";

import { Plus } from "@edifice-ui/icons";
import clsx from "clsx";
import { WorkspaceElement } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { DropzoneContext } from "./DropzoneContext";
import DropzoneDrag from "./DropzoneDrag";
import DropzoneImport from "./DropzoneImport";
import { useDropzone } from "../../hooks";
import { Button } from "../Button";

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
  onSuccess,
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);

  const { t } = useTranslation();

  const handleInputChange = (files: FileList | null) => {
    if (files && (accept?.includes(files[0].type) || accept?.length === 0)) {
      setFiles((oldAttachments) => {
        const newArray = [...oldAttachments];
        for (let i = 0; i < files?.length; i++) {
          newArray.push(files[i]);
        }
        return newArray;
      });
    }
  };

  const { handleDragLeave, handleDragging, handleDrop, dragging } = useDropzone(
    inputRef,
    handleInputChange,
  );

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
      files,
      inputRef,
      importMessage,
      setFiles,
      onSuccess,
    }),
    [inputRef, importMessage, files, setFiles, onSuccess],
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
                  <div className="drop-file-content">
                    <div className="add-button m-4">
                      <Button
                        variant="ghost"
                        leftIcon={<Plus></Plus>}
                        onClick={() => inputRef?.current?.click()}
                      >
                        {t("add")}
                      </Button>
                    </div>
                  </div>
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

Dropzone.Import = DropzoneImport;
Dropzone.Drag = DropzoneDrag;

Dropzone.displayName = "Dropzone";

export default Dropzone;
