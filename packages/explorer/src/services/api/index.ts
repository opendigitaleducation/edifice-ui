import {
  type CreateFolderParameters,
  odeServices,
  type TrashParameters,
  type ISearchParameters,
  type ID,
  type DeleteParameters,
  type MoveParameters,
  type UpdateFolderParameters,
  type ShareRight,
  type UpdateParameters,
  type IFolder,
  CreateParameters,
  App,
} from "edifice-ts-client";

/**
 * searchContext API
 * @param searchParams
 * @returns resources, no trashed folders and pagination
 */
export const searchContext = async (searchParams: ISearchParameters) => {
  const search = await odeServices
    .resource(searchParams.app)
    .searchContext(searchParams);

  return {
    ...search,
    folders: search.folders.filter((folder: IFolder) => !folder.trashed),
  };
};

/**
 * createFolder API
 * @param searchParams, name, parentId
 * @returns a new folder
 */
export const createFolder = async ({
  searchParams,
  name,
  parentId,
}: {
  searchParams: ISearchParameters;
  name: string;
  parentId: ID;
}) => {
  const createFolderParameters: CreateFolderParameters = {
    name,
    parentId,
    app: searchParams.app,
    type: searchParams.types[0],
  };
  return await odeServices
    .resource(searchParams.app)
    .createFolder(createFolderParameters);
};

/**
 * updateFolder API
 * @param searchParams, folderId, parentId, name
 * @returns updated folder
 */
export const updateFolder = async ({
  folderId,
  searchParams,
  parentId,
  name,
}: {
  folderId: ID;
  searchParams: ISearchParameters;
  parentId: ID;
  name: string;
}) => {
  const updateFolderParameters: UpdateFolderParameters = {
    folderId,
    name,
    parentId,
    app: searchParams.app,
    type: searchParams.types[0],
  };
  return await odeServices
    .resource(searchParams.app)
    .updateFolder(updateFolderParameters);
};

/**
 * trashAll API
 * @param searchParams, resourceIds, folderIds
 * @move resources and folders to bin
 */
export const trashAll = async ({
  searchParams,
  resourceIds,
  useAssetIds,
  folderIds,
}: {
  searchParams: ISearchParameters;
  resourceIds: ID[];
  useAssetIds: boolean;
  folderIds: ID[];
}) => {
  const trashParameters: Omit<TrashParameters, "trash"> = {
    application: searchParams.app,
    resourceType: searchParams.types[0],
    resourceIds,
    folderIds,
  };
  return await odeServices
    .resource(searchParams.app)
    .trashAll(trashParameters, useAssetIds);
};

/**
 * deleteAll API
 * @param searchParams, resourceIds, folderIds
 * @delete folders and resources
 */
export const deleteAll = async ({
  searchParams,
  resourceIds,
  useAssetIds,
  folderIds,
}: {
  searchParams: ISearchParameters;
  resourceIds: ID[];
  useAssetIds: boolean;
  folderIds: ID[];
}) => {
  const deleteParameters: DeleteParameters = {
    application: searchParams.app,
    resourceType: searchParams.types[0],
    resourceIds,
    folderIds,
  };
  return await odeServices
    .resource(searchParams.app)
    .deleteAll(deleteParameters, useAssetIds);
};

/**
 * restoreAll API
 * @param searchParams, resourceIds, folderIds
 * @restore trashed folders and resources
 */
export const restoreAll = async ({
  searchParams,
  resourceIds,
  folderIds,
  useAssetIds,
}: {
  searchParams: ISearchParameters;
  resourceIds: ID[];
  useAssetIds: boolean;
  folderIds: ID[];
}) => {
  const trashParameters: Omit<TrashParameters, "trash"> = {
    application: searchParams.app,
    resourceType: searchParams.types[0],
    resourceIds,
    folderIds,
  };
  return await odeServices
    .resource(searchParams.app)
    .restoreAll(trashParameters, useAssetIds);
};

/**
 * moveToFolder API
 * @param searchParams, resourceIds, folderIds, folderId
 * @returns folders and resources to new folderId location
 */
export const moveToFolder = async ({
  searchParams,
  resourceIds,
  folderId,
  folderIds,
  useAssetIds,
}: {
  searchParams: ISearchParameters;
  folderId: ID;
  resourceIds: ID[];
  useAssetIds: boolean;
  folderIds: ID[];
}) => {
  const moveParameters: MoveParameters = {
    application: searchParams.app,
    folderId,
    resourceIds,
    folderIds,
  };

  return await odeServices
    .resource(searchParams.app)
    .moveToFolder(moveParameters, useAssetIds);
};

/**
 * shareResource API
 * @param searchParams, entId, shares
 * @returns shared resource
 */
export const shareResource = async ({
  app,
  resourceId,
  rights,
}: {
  app: string;
  resourceId: string;
  rights: ShareRight[];
}) => {
  return await odeServices.share().saveRights(app, resourceId, rights);
};

/**
 * updateResource API
 * @param searchParams, params
 * @returns updated resource
 */
export const updateResource = async ({
  app,
  params,
}: {
  app: App;
  params: UpdateParameters;
}) => {
  return await odeServices.resource(app).update(params);
};

/**
 * sessionHasWorkflowRights API
 * @param actionRights
 * @returns check if user has rights
 */
export const sessionHasWorkflowRights = async (actionRights: string[]) => {
  return await odeServices.rights().sessionHasWorkflowRights(actionRights);
};

export const goToResource = ({
  searchParams,
  assetId,
}: {
  searchParams: ISearchParameters;
  assetId: ID;
}) => {
  return odeServices.resource(searchParams.app).gotoView(assetId);
};

export const createResource = ({
  searchParams,
  params,
}: {
  searchParams: ISearchParameters;
  params: CreateParameters;
}) => {
  const result = odeServices.resource(searchParams.app).create(params);
  return result;
};

export const printResource = ({
  searchParams,
  assetId,
}: {
  searchParams: ISearchParameters;
  assetId: ID;
}) => {
  const result = odeServices.resource(searchParams.app).gotoPrint(assetId);
  return result;
};

/**
 * getPreference API
 * @returns check onboarding trash param
 */
export const getOnboardingTrash = async (key: string) => {
  const res = await odeServices
    .conf()
    .getPreference<{ showOnboardingTrash: boolean }>(key);
  return res;
};

/**
 * savePreference API
 * @returns set onboarding trash param
 */
export const saveOnboardingTrash = async (key: string) => {
  const result = await odeServices
    .conf()
    .savePreference(key, JSON.stringify({ showOnboardingTrash: false }));

  return result;
};
