import { Suspense, lazy } from "react";

import { LoadingScreen } from "@edifice-ui/react";

import { useSearchContext } from "~/services/queries";
import {
  useIsRoot,
  useIsTrash,
  useHasSelectedNodes,
  useSearchParams,
} from "~/store";

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
  const { data, isError, error, isLoading, isFetching, fetchNextPage } =
    useSearchContext();

  console.log({ data, error });

  const hasNoFolders = data?.pages[0].folders.length === 0;
  const hasNoResources = data?.pages[0].resources.length === 0;

  const hasNoData = hasNoFolders && hasNoResources;

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

  if (!hasNoData && !isLoading) {
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

  return null;
};
