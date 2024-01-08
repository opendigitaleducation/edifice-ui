import { useScrollToTop as scrollToTop } from "@edifice-ui/react";
import { type TreeNode } from "@edifice-ui/react";
import { type InfiniteData, type QueryClient } from "@tanstack/react-query";
import {
  FOLDER,
  type ISearchParameters,
  type IFolder,
  type IResource,
  type ID,
  type ISearchResults,
  App,
} from "edifice-ts-client";
import { t } from "i18next";
import { create } from "zustand";

import { goToResource, printResource, searchContext } from "~/services/api";
import { arrayUnique } from "~/utils/arrayUnique";
import { findNodeById } from "~/utils/findNodeById";
import { getAncestors } from "~/utils/getAncestors";
// import { getAppParams } from "~/utils/getAppParams";
import { hasChildren } from "~/utils/hasChildren";
import { wrapTreeNode } from "~/utils/wrapTreeNode";

// const { app, types, filters, orders } = explorerConfig;

interface State {
  config: any | null;
  searchParams: ISearchParameters;
  treeData: TreeNode;
  selectedNodesIds: string[];
  currentFolder: Partial<IFolder>;
  selectedFolders: IFolder[];
  selectedResources: IResource[];
  folderIds: ID[];
  resourceIds: ID[];
  resourceIsTrash: boolean;
  resourceActionDisable: boolean;
  searchConfig: { minLength: number };
  status: string | undefined;
  updaters: {
    setConfig: (config) => void;
    setSearchConfig: (config: { minLength: number }) => void;
    setTreeData: (treeData: TreeNode) => void;
    setSearchParams: (searchParams: Partial<ISearchParameters>) => void;
    setCurrentFolder: (folder: Partial<IFolder>) => void;
    setSelectedFolders: (selectedFolders: IFolder[]) => void;
    setSelectedResources: (selectedResources: IResource[]) => void;
    setFolderIds: (folderIds: ID[]) => void;
    setResourceIds: (resourceIds: ID[]) => void;
    setResourceIsTrash: (resourceIsTrash: boolean) => void;
    setResourceActionDisable: (resourceActionDisable: boolean) => void;
    clearSelectedItems: () => void;
    clearSelectedIds: () => void;
    openResource: (resource: IResource) => void;
    printSelectedResource: () => void;
    openFolder: ({
      folderId,
      folder,
    }: {
      folderId: ID;
      folder?: IFolder;
    }) => void;
    foldTreeItem: (folderId: string) => void;
    selectTreeItem: (folderId: string) => void;
    unfoldTreeItem: (
      folderId: string,
      queryClient: QueryClient,
    ) => Promise<void>;
    gotoPreviousFolder: () => void;
    goToTrash: () => void;
  };
}

export const useStoreContext = create<State>()((set, get) => ({
  config: null,
  searchConfig: { minLength: 1 },
  searchParams: {
    app: "" as App,
    types: [],
    filters: {
      folder: "default",
      owner: undefined,
      shared: undefined,
      public: undefined,
    },
    orders: { updatedAt: "desc" },
    pagination: {
      startIdx: 0,
      pageSize: 48,
      maxIdx: 0,
    },
    trashed: false,
  },
  treeData: {
    id: FOLDER.DEFAULT,
    name: t("explorer.filters.mine"),
    section: true,
    children: [],
  },
  selectedNodesIds: ["default"],
  currentFolder: {
    id: "default",
  },
  selectedFolders: [],
  selectedResources: [],
  folderIds: [],
  resourceIds: [],
  resourceIsTrash: false,
  resourceActionDisable: false,
  status: undefined,
  updaters: {
    setConfig: (config) => set({ config }),
    setSearchConfig: (searchConfig: { minLength: number }) =>
      set((state) => ({
        searchConfig: { ...state.searchConfig, ...searchConfig },
      })),
    setTreeData: (treeData: TreeNode) => set(() => ({ treeData })),
    setSearchParams: (searchParams: Partial<ISearchParameters>) => {
      set((state) => {
        const { searchParams: previousSearchParams } = state;
        if (previousSearchParams.search !== searchParams.search) {
          if (searchParams.search) {
            // reset selection and folder if we are searching
            return {
              ...state,
              selectedFolders: [],
              selectedNodesIds: [],
              selectedResources: [],
              currentFolder: undefined,
              searchParams: {
                ...previousSearchParams,
                ...searchParams,
                trashed: false,
                filters: {
                  ...previousSearchParams.filters,
                  folder: undefined,
                },
              },
            };
          } else {
            // reset selection if we are not searching
            return {
              ...state,
              selectedFolders: [],
              selectedNodesIds: ["default"],
              selectedResources: [],
              currentFolder: {
                id: "default",
              },
              searchParams: {
                ...previousSearchParams,
                ...searchParams,
                trashed: false,
                filters: {
                  ...previousSearchParams.filters,
                },
              },
            };
          }
        } else {
          return {
            searchParams: { ...previousSearchParams, ...searchParams },
          };
        }
      });
    },
    setSelectedFolders: (selectedFolders: IFolder[]) =>
      set(() => ({ selectedFolders })),
    setSelectedResources: (selectedResources: IResource[]) =>
      set(() => ({ selectedResources })),
    setFolderIds: (folderIds: ID[]) => set(() => ({ folderIds })),
    setResourceIds: (resourceIds: ID[]) => set(() => ({ resourceIds })),
    setResourceIsTrash: (resourceIsTrash: boolean) =>
      set(() => ({ resourceIsTrash })),
    setResourceActionDisable: (resourceActionDisable: boolean) =>
      set(() => ({ resourceActionDisable })),
    setCurrentFolder: (currentFolder: Partial<IFolder>) =>
      set(() => ({ currentFolder })),
    clearSelectedItems: () =>
      set(() => ({ selectedFolders: [], selectedResources: [] })),
    clearSelectedIds: () => set(() => ({ resourceIds: [], folderIds: [] })),
    openResource: (resource: IResource) => {
      try {
        const { searchParams } = get();
        goToResource({ searchParams, assetId: resource.assetId });
      } catch (error) {
        console.error("explorer open failed: ", error);
      }
    },
    printSelectedResource: () => {
      try {
        const { searchParams, selectedResources, resourceIds } = get();
        if (selectedResources.length !== 1) {
          throw new Error("Cannot open more than 1 resource");
        }
        const item = selectedResources.find(
          (resource: IResource) => resource.id === resourceIds[0],
        )!;
        printResource({ searchParams, assetId: item.assetId });
      } catch (error) {
        console.error("explorer print failed: ", error);
      }
    },
    openFolder: ({ folderId, folder }: { folderId: ID; folder?: IFolder }) => {
      const { searchParams, treeData } = get();
      const previousId = searchParams.filters.folder as string;
      const ancestors = getAncestors(folderId, treeData);
      const selectedNodesIds = arrayUnique([...ancestors, folderId]);

      if (previousId === folderId) return;

      set((state) => {
        return {
          ...state,
          // reset selection when changing folder
          folderIds: [],
          resourceIds: [],
          selectedNodesIds,
          currentFolder: folder || {
            id: folderId,
          },
          searchParams: {
            ...searchParams,
            search: undefined,
            filters: {
              ...searchParams.filters,
              folder: folderId,
            },
            trashed: folderId === FOLDER.BIN,
          },
        };
      });
    },
    foldTreeItem: () => set((state) => ({ ...state, status: "fold" })),
    unfoldTreeItem: async (folderId: string, queryClient: QueryClient) => {
      const { treeData, searchParams } = get();
      set((state) => ({ ...state, status: "unfold" }));
      // fetch subfolders
      if (!hasChildren(folderId, treeData)) {
        await queryClient.prefetchInfiniteQuery({
          queryKey: [
            "prefetchContext",
            {
              folderId,
              trashed: false,
            },
          ],
          queryFn: async () =>
            await searchContext({
              ...searchParams,
              filters: {
                ...searchParams.filters,
                folder: folderId,
              },
            }),
        });
        const data = queryClient.getQueryData<InfiniteData<ISearchResults>>([
          "prefetchContext",
          {
            folderId,
            trashed: false,
          },
        ]);
        set((state) => ({
          ...state,
          treeData: wrapTreeNode(
            treeData,
            data?.pages[0]?.folders,
            folderId || FOLDER.DEFAULT,
          ),
        }));
      }
    },
    selectTreeItem: (folderId: string) => {
      const { treeData } = get();
      const { openFolder } = get().updaters;

      const folder = findNodeById(folderId, treeData);
      const goToTop = scrollToTop();

      goToTop();

      set((state) => ({
        ...state,
        searchParams: {
          ...state.searchParams,
          search: undefined,
        },
        status: "select",
        selectedResources: [],
      }));

      openFolder({
        folder: folder as IFolder,
        folderId,
      });
    },
    gotoPreviousFolder: () => {
      const { selectedNodesIds, treeData } = get();
      const { openFolder } = get().updaters;

      const selectedNodesIdsLength = selectedNodesIds.length;
      if (selectedNodesIdsLength < 2) {
        return undefined;
      }
      const previousFolder = findNodeById(
        selectedNodesIds[selectedNodesIdsLength - 2],
        treeData,
      );

      openFolder({
        folder: previousFolder as IFolder,
        folderId: previousFolder?.id || FOLDER.DEFAULT,
      });
    },
    goToTrash: () =>
      set((state) => ({
        ...state,
        selectedNodesIds: [],
        selectedResources: [],
        resourceIds: [],
        folderIds: [],
        status: "select",
        searchParams: {
          ...state.searchParams,
          search: undefined,
          filters: {
            folder: FOLDER.BIN,
          },
          trashed: true,
        },
        currentFolder: {
          id: FOLDER.BIN,
        },
      })),
  },
}));

export const useSearchParams = () =>
  useStoreContext((state) => state.searchParams);

export const useSelectedNodesIds = () =>
  useStoreContext((state) => state.selectedNodesIds);

export const useTreeData = () => useStoreContext((state) => state.treeData);

export const useSelectedFolders = () =>
  useStoreContext((state) => state.selectedFolders);

export const useSelectedResources = () =>
  useStoreContext((state) => state.selectedResources);

export const useSearchConfig = () =>
  useStoreContext((state) => state.searchConfig);

export const useFolderIds = () => useStoreContext((state) => state.folderIds);

export const useResourceIds = () =>
  useStoreContext((state) => state.resourceIds);

export const useResourceAssetIds = () =>
  useStoreContext((state) => state.selectedResources.map((r) => r.assetId));

export const useResourceWithoutIds = () =>
  useStoreContext((state) =>
    state.selectedResources.filter((r) => r.assetId === r.id),
  );

export const useCurrentFolder = () =>
  useStoreContext((state) => state.currentFolder);

export const useStoreActions = () => useStoreContext((state) => state.updaters);

export const useIsTrash = () => {
  const currentFolder = useCurrentFolder();
  return currentFolder?.id === FOLDER.BIN;
};

export const useResourceIsTrash = () => {
  return useStoreContext((state) => state.resourceIsTrash);
};

export const useResourceActionDisable = () => {
  return useStoreContext((state) => state.resourceActionDisable);
};

export const useIsRoot = () => {
  const currentFolder = useCurrentFolder();
  return currentFolder?.id === "default";
};

export const useHasSelectedNodes = () => {
  const selectedNodesIds = useSelectedNodesIds();
  return selectedNodesIds.length > 1;
};

export const useTreeStatus = () => useStoreContext((state) => state.status);
