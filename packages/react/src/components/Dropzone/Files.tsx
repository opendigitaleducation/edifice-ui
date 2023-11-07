import { useEffect, useState } from "react";

import { WorkspaceElement } from "edifice-ts-client";

import { useDropzoneContext } from "./DropzoneContext";
import { UploadCard } from "../../multimedia";
import { customSize } from "../../utils/fileSize";

const Files = ({ file }: { file: File; index: number }) => {
  const [, setUploadFiles] = useState<WorkspaceElement[]>([]);
  const { status, handleSave } = useDropzoneContext();

  /* const handleRetry = async () => {
    try {
      const result = await handleSave(file);
      if ((result as WorkspaceElement)._id) {
        setUploadFiles((prevFiles: any) => {
          const newArray = [...prevFiles];
          newArray[newArray.length - index] = result;
          return newArray;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }; */

  useEffect(() => {
    (async () => {
      try {
        const result = await handleSave(file);

        if (result) {
          setUploadFiles((prevFiles: any) => [...prevFiles, result]);
        }
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileInfo = {
    name: file?.name,
    info: {
      type: file?.type,
      weight: customSize(file?.size || 0, 1),
    },
    src: `/workspace/document/`,
  };

  return (
    <>
      <UploadCard
        status={status}
        //onDelete={() => handleDelete(uploadFile as WorkspaceElement, index)}
        onEdit={() => console.log("edit")}
        //onRetry={() => handleRetry()}
        item={fileInfo}
      />
    </>
  );
};

export default Files;
