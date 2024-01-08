import { lazy, Suspense } from "react";

import { Plus } from "@edifice-ui/icons";
import {
  Button,
  LoadingScreen,
  TreeView,
  useOdeClient,
  // useHasWorkflow,
  useToggle,
} from "@edifice-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FOLDER, type ID } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import TrashButton from "~/features/TreeView/components/TrashButton";
import {
  useStoreActions,
  useIsTrash,
  useSelectedNodesIds,
  useTreeData,
} from "~/store";

const CreateFolderModal = lazy(
  async () => await import("../../Actionbar/components/FolderModal"),
);

export const TreeViewContainer = () => {
  const queryclient = useQueryClient();

  const [isModalOpen, toggle] = useToggle();
  // * https://github.com/pmndrs/zustand#fetching-everything
  // ! https://github.com/pmndrs/zustand/discussions/913
  const treeData = useTreeData();
  const isTrashFolder = useIsTrash();
  const selectedNodesIds = useSelectedNodesIds();
  const { appCode } = useOdeClient();
  const { t } = useTranslation(["common", appCode]);

  const {
    goToTrash,
    selectTreeItem,
    unfoldTreeItem,
    foldTreeItem,
    clearSelectedItems,
    clearSelectedIds,
  } = useStoreActions();

  const handleTreeItemUnfold = async (folderId: ID) => {
    await unfoldTreeItem(folderId, queryclient);
  };

  const handleOnFolderCreate = () => {
    clearSelectedItems();
    clearSelectedIds();
    toggle();
  };

  return (
    <>
      <TreeView
        data={treeData}
        selectedNodesIds={selectedNodesIds}
        onTreeItemSelect={selectTreeItem}
        onTreeItemFold={foldTreeItem}
        onTreeItemUnfold={handleTreeItemUnfold}
      />
      <TrashButton
        id={FOLDER.BIN}
        selected={isTrashFolder}
        onSelect={goToTrash}
      />
      <div className="d-grid my-16">
        <Button
          disabled={isTrashFolder}
          type="button"
          color="primary"
          variant="outline"
          leftIcon={<Plus />}
          onClick={handleOnFolderCreate}
        >
          {t("explorer.folder.new")}
        </Button>
      </div>
      <Suspense fallback={<LoadingScreen />}>
        {isModalOpen && (
          <CreateFolderModal
            edit={false}
            isOpen={isModalOpen}
            onSuccess={toggle}
            onCancel={toggle}
          />
        )}
      </Suspense>
    </>
  );
  // ) : null;
};
