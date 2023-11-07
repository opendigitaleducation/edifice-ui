import { useCallback, useState } from "react";

import { WorkspaceElement, odeServices } from "edifice-ts-client";

import { Status } from "../../utils/Status";

const useDropzone = (ref: any, onFilesChange: (files: any) => void) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | undefined>("idle");

  const handleDragging = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(true);
    },
    [],
  );

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    handleDragLeave(event);
    const files = event.dataTransfer?.files;
    onFilesChange(files);

    if (ref?.current && files) {
      ref.current.files = files;
    }
  };

  async function handleSave(file: File) {
    setStatus("loading");

    try {
      const doc = await odeServices.workspace().saveFile(file);

      if (!doc) throw new Error("No document found");

      if (doc._id) {
        setStatus("success");
        return doc;
      }
    } catch (error) {
      setStatus("error");
      console.log(error);
    }
  }

  async function handleDelete(element: WorkspaceElement) {
    try {
      await odeServices.workspace().deleteFile([element]);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    handleDragging,
    handleDragLeave,
    handleDrop,
    handleSave,
    handleDelete,
    dragging,
    status,
  };
};

export default useDropzone;
