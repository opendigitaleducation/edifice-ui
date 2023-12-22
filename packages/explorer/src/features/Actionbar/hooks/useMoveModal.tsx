import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { type ID } from "edifice-ts-client";

import { useMoveItem } from "~/services/queries";
import {
  useStoreActions,
  useSelectedFolders,
  useSelectedResources,
} from "~/store";

interface ModalProps {
  onSuccess?: () => void;
}

export default function useMoveModal({ onSuccess }: ModalProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();

  const moveItem = useMoveItem();

  // * https://github.com/pmndrs/zustand#fetching-everything
  // ! https://github.com/pmndrs/zustand/discussions/913
  const selectedFolders = useSelectedFolders();
  const selectedResources = useSelectedResources();
  const { foldTreeItem, unfoldTreeItem } = useStoreActions();

  const queryclient = useQueryClient();

  async function onMove() {
    try {
      if (!selectedFolder) throw new Error("explorer.move.selection.empty");

      await moveItem.mutate(selectedFolder);
      await onSuccess?.();
    } catch (e) {
      // TODO display an alert?
      console.error(e);
    }
  }

  const canMove = (destination: string) => {
    for (const selectedFolder of selectedFolders) {
      if (
        destination === selectedFolder.id ||
        destination === selectedFolder.parentId
      ) {
        return false;
      }
    }

    for (const selectedResource of selectedResources) {
      if (
        destination ===
          (selectedResource?.folderIds && selectedResource.folderIds[0]) ||
        (selectedResource?.folderIds?.length === 0 && destination === "default")
      ) {
        return false;
      }
    }
    return true;
  };

  return {
    disableSubmit: !selectedFolder,
    handleTreeItemSelect: (folderId: string) => {
      if (canMove(folderId)) {
        setSelectedFolder(folderId);
      } else {
        setSelectedFolder(undefined);
      }
    },
    handleTreeItemFold: foldTreeItem,
    handleTreeItemUnfold: async (folderId: ID) =>
      await unfoldTreeItem(folderId, queryclient),
    onMove: () => {
      onMove();
    },
  };
}
