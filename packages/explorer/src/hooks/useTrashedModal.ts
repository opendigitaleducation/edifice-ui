import { useResourceIsTrash, useStoreActions } from "~/store";

export const useTrashModal = () => {
  const isTrashedModalOpen = useResourceIsTrash();
  const { clearSelectedIds, setResourceIsTrash, clearSelectedItems } =
    useStoreActions();

  const onTrashedCancel = () => {
    clearSelectedIds();
    clearSelectedItems();
    setResourceIsTrash(false);
  };

  return {
    isTrashedModalOpen,
    onTrashedCancel,
  };
};
