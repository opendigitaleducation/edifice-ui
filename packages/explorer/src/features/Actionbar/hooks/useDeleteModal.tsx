import { useDelete, useTrash } from "~/services/queries";
import { useIsTrash } from "~/store";

interface ModalProps {
  onSuccess?: () => void;
}

export default function useDeleteModal({ onSuccess }: ModalProps) {
  // * https://github.com/pmndrs/zustand#fetching-everything
  // ! https://github.com/pmndrs/zustand/discussions/913
  const deleteItem = useDelete();
  const trashItem = useTrash();
  const isTrashFolder = useIsTrash();

  async function onDelete() {
    try {
      if (isTrashFolder) {
        await deleteItem.mutate();
      } else {
        await trashItem.mutate();
      }
      onSuccess?.();
    } catch (e) {
      console.error(e);
    }
  }

  return {
    isTrashFolder,
    onDelete,
  };
}
