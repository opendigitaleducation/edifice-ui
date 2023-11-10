import { odeServices } from "edifice-ts-client";

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

  async function deleteFile(file: File) {
    try {
      //await odeServices.workspace().deleteFile([element]);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    saveFile,
    deleteFile,
  };
}
