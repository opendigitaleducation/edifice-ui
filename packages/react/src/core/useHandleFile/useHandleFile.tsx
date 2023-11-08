import { WorkspaceElement, odeServices } from "edifice-ts-client";

export default function useHandleFile() {
  async function saveFile(file: File) {
    try {
      const doc = await odeServices.workspace().saveFile(file);

      if (!doc) throw new Error("No document found");

      if (doc._id) {
        return doc;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(element: WorkspaceElement) {
    try {
      await odeServices.workspace().deleteFile([element]);
      //setUploadFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  }

  return {
    saveFile,
    handleDelete,
  };
}
