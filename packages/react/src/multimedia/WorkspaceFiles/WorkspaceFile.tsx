import { useEffect, useState } from "react";

import { WorkspaceElement } from "edifice-ts-client";

import useHandleFile from "../../core/useHandleFile/useHandleFile";
import { customSize } from "../../utils/fileSize";
import { Status } from "../../utils/Status";
import { UploadCard } from "../UploadCard";

interface WorkspaceFileProps {
  file: File;
  setWorkspaceElement: any;
  workspaceElement: WorkspaceElement[];
  index: number;
  handleDelete: any;
}

const WorkspaceFile = ({
  file,
  setWorkspaceElement,
  workspaceElement,
  index,
  handleDelete,
}: WorkspaceFileProps) => {
  const { saveFile } = useHandleFile();

  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const result = await saveFile(file);

        setWorkspaceElement((prevFiles: any) => [...prevFiles, result]);

        if (result) {
          setStatus("success");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = async () => {
    setStatus("loading");
    try {
      const result = await saveFile(file);

      setWorkspaceElement((prevFiles: any) => [...prevFiles, result]);

      if (result) {
        setStatus("success");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const fileInfo = {
    name: file?.name,
    info: {
      type: file?.type,
      weight: customSize(file?.size || 0, 1),
    },
    src:
      workspaceElement && `/workspace/document/${workspaceElement[index]?._id}`,
  };

  return (
    <UploadCard
      status={status}
      onDelete={() => handleDelete(index)}
      onEdit={() => console.log("edit")}
      onRetry={handleRetry}
      item={fileInfo}
    />
  );
};

export default WorkspaceFile;
