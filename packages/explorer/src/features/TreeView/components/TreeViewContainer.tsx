import { lazy, Suspense } from "react";

import { Plus } from "@edifice-ui/icons";
import {
  Button,
  LoadingScreen,
  TreeView,
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

const CreateModal = lazy(
  async () => await import("../../Actionbar/components/EditFolderModal"),
);

export const TreeViewContainer = () => {
  const queryclient = useQueryClient();
  const { t } = useTranslation();

  const [isCreateFolderModalOpen, toggle] = useToggle();
  // * https://github.com/pmndrs/zustand#fetching-everything
  // ! https://github.com/pmndrs/zustand/discussions/913
  const treeData = useTreeData();
  const isTrashFolder = useIsTrash();
  const selectedNodesIds = useSelectedNodesIds();
  const {
    goToTrash,
    selectTreeItem,
    unfoldTreeItem,
    foldTreeItem,
    clearSelectedItems,
    clearSelectedIds,
  } = useStoreActions();

  /* const canCreateFolder = useHasWorkflow(
    "org.entcore.blog.controllers.FoldersController|add",
  ); */

  const handleTreeItemUnfold = async (folderId: ID) => {
    await unfoldTreeItem(folderId, queryclient);
  };

  const handleOnFolderCreate = () => {
    clearSelectedItems();
    clearSelectedIds();
    toggle();
  };

  return treeData ? (
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
        {isCreateFolderModalOpen && (
          <CreateModal
            edit={false}
            isOpen={isCreateFolderModalOpen}
            onSuccess={toggle}
            onCancel={toggle}
          />
        )}
      </Suspense>
    </>
  ) : null;
};
