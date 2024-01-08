import { Suspense, lazy, useEffect } from "react";

import { LoadingScreen, useOdeClient, useToast } from "@edifice-ui/react";
import { IFolder, FOLDER } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { TreeNodeFolderWrapper } from "../../adapters";
import { useSearchContext } from "~/services/queries";
import {
  useIsRoot,
  useIsTrash,
  useHasSelectedNodes,
  useSearchParams,
  useStoreActions,
  useCurrentFolder,
  useTreeData,
} from "~/store";
import { wrapTreeNode } from "~/utils/wrapTreeNode";

const EmptyScreenApp = lazy(
  async () => await import("~/components/EmptyScreens/EmptyScreenApp"),
);
const EmptyScreenSearch = lazy(
  async () => await import("~/components/EmptyScreens/EmptyScreenSearch"),
);
const EmptyScreenError = lazy(
  async () => await import("~/components/EmptyScreens/EmptyScreenError"),
);
const EmptyScreenNoContentInFolder = lazy(
  async () =>
    await import("~/components/EmptyScreens/EmptyScreenNoContentInFolder"),
);
const EmptyScreenTrash = lazy(
  async () => await import("~/components/EmptyScreens/EmptyScreenTrash"),
);
const FoldersList = lazy(
  async () =>
    await import("~/features/Explorer/components/FoldersList/FoldersList"),
);
const ResourcesList = lazy(
  async () =>
    await import("~/features/Explorer/components/ResourcesList/ResourcesList"),
);

export const List = () => {
  const isRoot = useIsRoot();
  const isTrashFolder = useIsTrash();
  const hasSelectedNodes = useHasSelectedNodes();
  const searchParams = useSearchParams();
  const currentFolder = useCurrentFolder();
  const treeData = useTreeData();
  const toast = useToast();

  const { appCode } = useOdeClient();
  const { t } = useTranslation();
  const { setSearchParams, setSearchConfig, setTreeData } = useStoreActions();
  const { data, isError, error, isLoading, isFetching, fetchNextPage } =
    useSearchContext();

  const hasNoFolders = data?.pages[0].folders.length === 0;
  const hasNoResources = data?.pages[0].resources.length === 0;

  const hasNoData = hasNoFolders && hasNoResources;

  useEffect(() => {
    if (data) {
      const folders: IFolder[] = [...(data?.pages[0]?.folders ?? [])];

      if (data?.pages[0]?.searchConfig) {
        setSearchConfig(data.pages[0].searchConfig);
      }

      if (!searchParams.search) {
        // set tree data only if we are not searching
        if (currentFolder?.id === "default") {
          setTreeData({
            id: FOLDER.DEFAULT,
            section: true,
            children: folders.map(
              (folder: IFolder) => new TreeNodeFolderWrapper(folder),
            ),
            name: t("explorer.filters.mine", { ns: appCode }),
          });
        } else {
          setTreeData(
            wrapTreeNode(
              treeData,
              folders,
              searchParams.filters.folder || FOLDER.DEFAULT,
            ),
          );
        }
      }
      setSearchParams({
        ...searchParams,
        pagination: data?.pages[data?.pages.length - 1]?.pagination,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error && typeof error === "string") {
      toast.error(t(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EmptyScreenError />
      </Suspense>
    );
  }

  if (searchParams.search && hasNoData) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EmptyScreenSearch />
      </Suspense>
    );
  }

  if (isRoot && hasNoData) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EmptyScreenApp />
      </Suspense>
    );
  }

  if (hasSelectedNodes && hasNoData && !isTrashFolder) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EmptyScreenNoContentInFolder />
      </Suspense>
    );
  }

  if (isTrashFolder && data?.pages[0].resources.length === 0) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EmptyScreenTrash />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <FoldersList data={data} isFetching={isFetching} />
      <ResourcesList
        data={data}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </Suspense>
  );
};
