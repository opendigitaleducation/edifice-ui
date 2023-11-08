import { useCallback, useState } from "react";

const useDropzone = (ref: any, onFilesChange: (files: any) => void) => {
  const [dragging, setDragging] = useState<boolean>(false);

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

  return {
    handleDragging,
    handleDragLeave,
    handleDrop,
    dragging,
  };
};

export default useDropzone;
