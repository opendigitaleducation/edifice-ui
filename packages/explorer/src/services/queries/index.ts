/* eslint-disable @typescript-eslint/no-misused-promises */
import { useOdeClient, useToast, useUser } from "@edifice-ui/react";
import {
  useInfiniteQuery,
  type InfiniteData,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  type ISearchResults,
  type IFolder,
  type IResource,
  type ShareRight,
  type UpdateParameters,
  IAction,
  CreateParameters,
} from "edifice-ts-client";
import { t } from "i18next";

import {
  createFolder,
  createResource,
  deleteAll,
  moveToFolder,
  restoreAll,
  searchContext,
  sessionHasWorkflowRights,
  shareResource,
  trashAll,
  updateFolder,
  updateResource,
} from "~/services/api";
import {
  useStoreActions,
  useSearchParams,
  useFolderIds,
  useTreeData,
  useResourceAssetIds,
  useResourceIds,
  useResourceWithoutIds,
  useStoreContext,
} from "~/store";
import { addNode } from "~/utils/addNode";
import { deleteNode } from "~/utils/deleteNode";
import { moveNode } from "~/utils/moveNode";
import { updateNode } from "~/utils/updateNode";

/**
 * useActions query
 * set actions correctly with workflow rights
 * @returns actions data
 */
export const useActions = () => {
  const config = useStoreContext((state) => state.config);

  return useQuery<Record<string, boolean>, Error, IAction[]>({
    queryKey: ["actions"],
    queryFn: async () => {
      const actionRights = config.actions.map((action) => action.workflow);
      const availableRights = await sessionHasWorkflowRights(actionRights);
      return availableRights;
    },
    select: (data) => {
      return config.actions.map((action) => ({
        ...action,
        available: data[action.workflow],
      }));
    },
    staleTime: Infinity,
    enabled: !!config,
  });
};

/**
 * useSearchContext query
 * update state according to currentFolder ID
 * @returns infinite query to load resources
 */
export const useSearchContext = () => {
  const config = useStoreContext((state) => state.config);
  const searchParams = useSearchParams();
  const { filters, trashed, search } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
      search,
    },
  ];

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      return await searchContext({
        ...searchParams,
        app: config?.app,
        types: config?.types,
        pagination: {
          ...searchParams.pagination,
          startIdx: pageParam,
        },
      });
    },
    initialPageParam: 0,
    enabled: !!config,
    retry: false,
    getNextPageParam: (lastPage) => {
      return (
        lastPage.pagination.startIdx + lastPage.pagination.pageSize ?? undefined
      );
    },
  });
};

/**
 * useTrash query
 * Optimistic UI when resource or folder is trashed
 */
export const useTrash = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const treeData = useTreeData();
  const folderIds = useFolderIds();
  const assetIds = useResourceAssetIds();
  const resourceRealIds = useResourceIds();
  const useAssetIds = useResourceWithoutIds().length > 0;
  const resourceIds = useAssetIds ? assetIds : resourceRealIds;
  const { clearSelectedItems, clearSelectedIds, setTreeData, setSearchParams } =
    useStoreActions();
  const { filters, trashed } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async () =>
      await trashAll({ searchParams, folderIds, resourceIds, useAssetIds }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      if (previousData) {
        toast.success(t("explorer.trash.title"));

        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            const newData = {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  folders: page.folders.filter(
                    (folder: IFolder) => !folderIds.includes(folder.id),
                  ),
                  pagination: {
                    ...page.pagination,
                    // @ts-ignore
                    maxIdx: page?.pagination?.maxIdx - data.resources.length,
                  },
                  resources: page.resources.filter((resource: IResource) => {
                    if (useAssetIds) {
                      return !assetIds.includes(resource.assetId);
                    } else {
                      return !resourceIds.includes(resource.id);
                    }
                  }),
                };
              }),
            };

            const update = deleteNode(treeData, {
              folders: folderIds,
            });

            setTreeData(update);

            setSearchParams({
              ...searchParams,
              pagination: {
                ...searchParams.pagination,
                // @ts-ignore
                maxIdx: searchParams.pagination?.maxIdx - data.resources.length,
              },
            });

            return newData;
          }
          return undefined;
        });
      }
    },
    onSettled: () => {
      clearSelectedItems();
      clearSelectedIds();
    },
  });
};

/**
 * useRestore query
 * Optimistic UI when resource is restored
 */
export const useRestore = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const folderIds = useFolderIds();
  const assetIds = useResourceAssetIds();
  const resourceRealIds = useResourceIds();
  const useAssetIds = useResourceWithoutIds().length > 0;
  const resourceIds = useAssetIds ? assetIds : resourceRealIds;
  const {
    setFolderIds,
    setResourceIds,
    setSelectedResources,
    setSelectedFolders,
  } = useStoreActions();
  const { filters, trashed } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async () =>
      await restoreAll({ searchParams, folderIds, resourceIds, useAssetIds }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      if (previousData) {
        toast.success(t("explorer.trash.toast"));

        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            return {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  folders: page.folders.filter(
                    (folder: IFolder) => !folderIds.includes(folder.id),
                  ),
                  resources: page.resources.filter((resource: IResource) => {
                    if (useAssetIds) {
                      return !assetIds.includes(resource.assetId);
                    } else {
                      return !resourceIds.includes(resource.id);
                    }
                  }),
                };
              }),
            };
          }
          return undefined;
        });
      }
    },
    onSettled: () => {
      setResourceIds([]);
      setSelectedResources([]);
      setFolderIds([]);
      setSelectedFolders([]);
    },
  });
};

/**
 * useDelete query
 * Optimistic UI when resource is deleted
 */
export const useDelete = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const folderIds = useFolderIds();
  const assetIds = useResourceAssetIds();
  const resourceRealIds = useResourceIds();
  const useAssetIds = useResourceWithoutIds().length > 0;
  const resourceIds = useAssetIds ? assetIds : resourceRealIds;
  const { clearSelectedItems, clearSelectedIds } = useStoreActions();
  const { filters, trashed } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async () =>
      await deleteAll({ searchParams, folderIds, resourceIds, useAssetIds }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      if (previousData) {
        toast.success(t("explorer.removed.from.trash"));

        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            const newData = {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  folders: page.folders.filter(
                    (folder: IFolder) => !folderIds.includes(folder.id),
                  ),
                  resources: page.resources.filter((resource: IResource) => {
                    if (useAssetIds) {
                      return !assetIds.includes(resource.assetId);
                    } else {
                      return !resourceIds.includes(resource.id);
                    }
                  }),
                };
              }),
            };

            return newData;
          }
          return undefined;
        });
      }
    },
    onSettled: () => {
      clearSelectedItems();
      clearSelectedIds();
    },
  });
};

export const useMoveItem = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const treeData = useTreeData();
  const folderIds = useFolderIds();
  const assetIds = useResourceAssetIds();
  const resourceRealIds = useResourceIds();
  const useAssetIds = useResourceWithoutIds().length > 0;
  const resourceIds = useAssetIds ? assetIds : resourceRealIds;

  const { clearSelectedIds, clearSelectedItems, setTreeData, setSearchParams } =
    useStoreActions();

  const { filters, trashed } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async (folderId: string) =>
      await moveToFolder({
        searchParams,
        folderId,
        folderIds,
        resourceIds,
        useAssetIds,
      }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async (data, variables) => {
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      if (previousData) {
        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            const update = moveNode(treeData, {
              destinationId: variables,
              folders: folderIds,
            });

            const newData = {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  folders: page.folders.filter(
                    (folder: IFolder) => !folderIds.includes(folder.id),
                  ),
                  pagination: {
                    ...page.pagination,
                    // @ts-ignore
                    maxIdx: page.pagination?.maxIdx - data.resources.length,
                  },
                  resources: page.resources.filter((resource: IResource) => {
                    if (useAssetIds) {
                      return !assetIds.includes(resource.assetId);
                    } else {
                      return !resourceIds.includes(resource.id);
                    }
                  }),
                };
              }),
            };

            setTreeData(update);

            setSearchParams({
              ...searchParams,
              pagination: {
                ...searchParams.pagination,
                // @ts-ignore
                maxIdx: searchParams.pagination?.maxIdx - data.resources.length,
              },
            });

            return newData;
          }
          return undefined;
        });
      }
    },
    onSettled: () => {
      clearSelectedItems();
      clearSelectedIds();
    },
  });
};

export const useCreateFolder = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const treeData = useTreeData();
  const { setTreeData } = useStoreActions();
  const { filters, trashed } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async ({
      name,
      parentId,
    }: {
      name: string;
      parentId: string;
    }) => await createFolder({ searchParams, name, parentId }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async (data, variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      const newFolder = {
        ...data,
        parentId: variables.parentId,
        children: [],
        rights: [`creator:${data?.creator_id}`],
      };

      if (previousData) {
        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            const newData = {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  folders: [...page.folders, newFolder],
                };
              }),
            };

            const update = addNode(treeData, {
              parentId: variables.parentId,
              newFolder,
            });

            setTreeData(update);

            return newData;
          }
          return undefined;
        });
      }
    },
  });
};

export const useUpdatefolder = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const treeData = useTreeData();
  const { setFolderIds, setSelectedFolders, setTreeData } = useStoreActions();
  const { filters, trashed } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async ({
      folderId,
      name,
      parentId,
    }: {
      folderId: string;
      name: string;
      parentId: string;
    }) => await updateFolder({ searchParams, folderId, parentId, name }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async (data, variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      if (previousData) {
        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            const newData = {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  folders: page.folders.map((folder: IFolder) => {
                    if (folder.id === data.id) {
                      return {
                        ...data,
                        parentId: variables.parentId,
                        rights: folder.rights,
                      };
                    } else {
                      return folder;
                    }
                  }),
                };
              }),
            };

            const update = updateNode(treeData, {
              folderId: variables.folderId,
              newFolder: data,
            });

            setTreeData(update);

            return newData;
          }
          return undefined;
        });
      }
    },
    onSettled: () => {
      setFolderIds([]);
      setSelectedFolders([]);
    },
  });
};

export const useShareResource = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { setResourceIds, setSelectedResources } = useStoreActions();
  const { filters, trashed, app } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async ({
      resourceId,
      rights,
    }: {
      resourceId: string;
      rights: ShareRight[];
    }) => await shareResource({ app, resourceId, rights }),
    onError(error) {
      if (typeof error === "string")
        toast.error(t("explorer.shared.status.error"));
    },
    onSuccess: async (_data, variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      if (previousData) {
        toast.success(t("explorer.shared.status.saved"));

        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            return {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  resources: page.resources.map((resource: IResource) => {
                    if (resource.assetId === variables?.resourceId) {
                      let rights: string[] = [`creator:${resource.creatorId}`];

                      if (variables?.rights.length >= 1) {
                        rights = [
                          ...rights,
                          ...variables.rights.flatMap((right) => {
                            return right.actions.map((action) => {
                              return `${right.type}:${right.id}:${action.id}`;
                            });
                          }),
                        ];
                      }

                      return {
                        ...resource,
                        rights,
                      };
                    } else {
                      return resource;
                    }
                  }),
                };
              }),
            };
          }
          return undefined;
        });
      }
    },
    onSettled: () => {
      setResourceIds([]);
      setSelectedResources([]);
    },
  });
};

export const useUpdateResource = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { filters, trashed, app } = searchParams;

  const queryKey = [
    "context",
    {
      folderId: filters.folder,
      filters,
      trashed,
    },
  ];

  return useMutation({
    mutationFn: async (params: UpdateParameters) =>
      await updateResource({ app, params }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async (_data, variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      if (previousData) {
        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            return {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  resources: page.resources.map((resource: IResource) => {
                    if (resource.assetId === variables?.entId) {
                      const {
                        name,
                        thumbnail,
                        public: pub,
                        description,
                        slug,
                        ...others
                      } = variables;
                      return {
                        ...resource,
                        ...others, // add any custom field
                        name,
                        thumbnail:
                          typeof thumbnail === "string"
                            ? thumbnail
                            : URL.createObjectURL(
                                thumbnail as Blob | MediaSource,
                              ),
                        public: pub,
                        description,
                        slug,
                      };
                    } else {
                      return resource;
                    }
                  }),
                };
              }),
            };
          }
          return undefined;
        });
      }
    },
  });
};

/* const useCreateResourceBase = (
  onSuccess:
    | ((
        data: CreateResult,
        variables: CreateParameters,
        context: unknown,
      ) => unknown)
    | undefined,
) => {
  const toast = useToast();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (params: CreateParameters) =>
      await createResource({ searchParams, params }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess,
  });
}; */

export const useCreateResource = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { appCode: application } = useOdeClient();

  const queryKey = [
    "context",
    {
      folderId: searchParams.filters.folder,
      filters: searchParams.filters,
      trashed: searchParams.trashed,
    },
  ];

  return useMutation({
    mutationFn: async (params: CreateParameters) =>
      await createResource({ searchParams, params }),
    onError(error) {
      if (typeof error === "string") toast.error(t(error));
    },
    onSuccess: async (data, variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ISearchResults>(queryKey);

      const { thumbnail } = variables;
      const newResource: IResource = {
        ...variables,
        thumbnail: thumbnail
          ? (URL.createObjectURL(thumbnail as Blob | MediaSource) as string)
          : "",
        application,
        assetId: data._id || data.entId || "",
        id: data._id || data.entId || "",
        creatorId: user?.userId as string,
        creatorName: user?.username as string,
        createdAt: Date.now() as unknown as string,
        slug: variables.slug || "",
        modifiedAt: data.modified?.$date || "",
        modifierId: data.author?.userId || "",
        modifierName: data.author?.username || "",
        updatedAt: Date.now() as unknown as string,
        trashed: false,
        rights: [`creator:${user?.userId}`],
      };

      if (previousData) {
        return queryClient.setQueryData<
          InfiniteData<ISearchResults> | undefined
        >(queryKey, (prev) => {
          if (prev) {
            return {
              ...prev,
              pages: prev?.pages.map((page) => {
                return {
                  ...page,
                  resources: [newResource, ...page.resources],
                };
              }),
            };
          }
          return undefined;
        });
      }
    },
  });
};
