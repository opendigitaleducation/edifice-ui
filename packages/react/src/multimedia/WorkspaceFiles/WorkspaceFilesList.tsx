import { useEffect, useState } from "react";

import { WorkspaceElement } from "edifice-ts-client";

import WorkspaceFile from "./WorkspaceFile";
import { useDropzoneContext } from "../../components/Dropzone/DropzoneContext";

export const WorkspaceFilesList = () => {
  const { files, onSuccess } = useDropzoneContext();

  const [workspaceElement, setWorkspaceElement] = useState<WorkspaceElement[]>(
    [],
  );

  useEffect(() => {
    onSuccess(workspaceElement.filter((el) => el?._id && el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceElement]);

  return (
    <>
      {files.map((file, index) => (
        <WorkspaceFile
          key={index}
          file={file}
          index={index}
          setWorkspaceElement={setWorkspaceElement}
          workspaceElement={workspaceElement}
        />
      ))}
    </>
  );
};
