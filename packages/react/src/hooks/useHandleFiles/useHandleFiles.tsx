import { useState } from "react";

import { WorkspaceElement, odeServices } from "edifice-ts-client";

import { Status } from "../../components";

export default function useHandleFile() {
  const [isLoading, setLoading] = useState(false);
  const [statusUpload, setStatusUpload] = useState<Status | undefined>();
  const [uploadFiles, setUploadFiles] = useState<(WorkspaceElement | File)[]>(
    [],
  );

  async function handleSave(file: File) {
    setStatusUpload(undefined);

    try {
      const fileUpload = await odeServices.workspace().saveFile(file);

      if (fileUpload._id) {
        setStatusUpload("success");
        return fileUpload;
      } else {
        setStatusUpload("error");
        return file;
      }
    } catch (e) {
      setStatusUpload("error");
      console.log(e);
      return file;
    }
  }

  async function handleDelete(element: WorkspaceElement, index: number) {
    try {
      await odeServices.workspace().deleteFile([element]);
      setUploadFiles((oldUploadFiles) =>
        oldUploadFiles.filter((_, i) => i !== index),
      );
    } catch (e) {
      console.log(e);
    }
  }

  return {
    uploadFiles,
    setUploadFiles,
    handleSave,
    isLoading,
    statusUpload,
    handleDelete,
    setLoading,
  };
}