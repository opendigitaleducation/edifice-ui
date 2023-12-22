import { Suspense, lazy, useEffect } from "react";

import {
  useOdeClient,
  useXitiTrackPageLoad,
  Grid,
  LoadingScreen,
  Breadcrumb,
  AppHeader,
} from "@edifice-ui/react";
import { type IAction } from "edifice-ts-client";
import { IWebApp } from "edifice-ts-client";

// import OnboardingModal from "./components/OnboardingModal/OnboardingModal";
import { ExplorerBreadcrumb } from "~/components/ExplorerBreadcrumb";
import { useLibraryUrl } from "~/features/Explorer/components/Library/useLibraryUrl";
import { List } from "~/features/Explorer/components/List/List";
// import ActionResourceDisableModal from "~/features/Explorer/components/ResourcesList/ActionResourceDisableModal";
import { SearchForm } from "~/features/Explorer/components/SearchForm/SearchForm";
import { TreeViewContainer } from "~/features/TreeView/components/TreeViewContainer";
import { useActionDisableModal } from "~/hooks/useActionDisableModal";
import { useTrashModal } from "~/hooks/useTrashedModal";
import { useActions } from "~/services/queries";
import { useStoreActions } from "~/store";
import { isActionAvailable } from "~/utils/isActionAvailable";

import "node_modules/@edifice-ui/react/dist/style.css";

const AppAction = lazy(
  async () =>
    await import("~/features/Explorer/components/AppAction/AppAction"),
);
const OnboardingModal = lazy(
  async () => await import("./components/OnboardingModal/OnboardingModal"),
);

const Library = lazy(
  async () => await import("~/features/Explorer/components/Library/Library"),
);

const ActionBar = lazy(
  async () =>
    await import("~/features/Actionbar/components/ActionBarContainer"),
);
const ActionResourceDisableModal = lazy(
  async () =>
    await import(
      "~/features/Explorer/components/ResourcesList/ActionResourceDisableModal"
    ),
);

const TrashedResourceModal = lazy(
  async () =>
    await import(
      "~/features/Explorer/components/ResourcesList/TrashedResourceModal"
    ),
);

const Explorer = ({ config }: { config: any }) => {
  const { setConfig } = useStoreActions();

  useEffect(() => {
    setConfig(config);
  }, [config, setConfig]);

  const { currentApp } = useOdeClient();
  const { data: actions } = useActions();
  const { isTrashedModalOpen, onTrashedCancel } = useTrashModal();
  const { isActionDisableModalOpen, onActionDisableCancel } =
    useActionDisableModal();
  const { libraryUrl } = useLibraryUrl();

  useXitiTrackPageLoad();

  const canPublish =
    config && actions?.find((action: IAction) => action.id === "publish");

  return (
    config && (
      <>
        <AppHeader
          render={() =>
            isActionAvailable({ workflow: "create", actions }) ? (
              <Suspense fallback={<LoadingScreen />}>
                <AppAction />
              </Suspense>
            ) : null
          }
        >
          <Breadcrumb app={currentApp as IWebApp} />
        </AppHeader>

        <Grid className="flex-grow-1">
          <Grid.Col
            sm="3"
            lg="2"
            xl="3"
            className="border-end pt-16 pe-16 d-none d-lg-block"
            as="aside"
          >
            <TreeViewContainer />
            {canPublish?.available && libraryUrl && (
              <Suspense fallback={<LoadingScreen />}>
                <Library url={libraryUrl} />
              </Suspense>
            )}
          </Grid.Col>
          <Grid.Col sm="4" md="8" lg="6" xl="9">
            <SearchForm />
            <ExplorerBreadcrumb />
            <List />
          </Grid.Col>
          <Suspense fallback={<LoadingScreen />}>
            <ActionBar />
            <OnboardingModal
              id="showOnboardingTrash"
              items={[
                {
                  src: "onboarding/illu-trash-menu.svg",
                  alt: "explorer.modal.onboarding.trash.screen1.alt",
                  text: "explorer.modal.onboarding.trash.screen1.title",
                },
                {
                  src: "onboarding/illu-trash-notif.svg",
                  alt: "explorer.modal.onboarding.trash.screen2.alt",
                  text: "explorer.modal.onboarding.trash.screen2.alt",
                },
                {
                  src: "onboarding/illu-trash-delete.svg",
                  alt: "explorer.modal.onboarding.trash.screen3.alt",
                  text: "explorer.modal.onboarding.trash.screen3.title",
                },
              ]}
              modalOptions={{
                title: "explorer.modal.onboarding.trash.title",
                prevText: "explorer.modal.onboarding.trash.prev",
                nextText: "explorer.modal.onboarding.trash.next",
                closeText: "explorer.modal.onboarding.trash.close",
              }}
            />
          </Suspense>

          {isTrashedModalOpen && (
            <Suspense fallback={<LoadingScreen />}>
              <TrashedResourceModal
                isOpen={isTrashedModalOpen}
                onCancel={onTrashedCancel}
              />
            </Suspense>
          )}
          {isActionDisableModalOpen && (
            <Suspense fallback={<LoadingScreen />}>
              <ActionResourceDisableModal
                isOpen={isActionDisableModalOpen}
                onCancel={onActionDisableCancel}
              />
            </Suspense>
          )}
        </Grid>
      </>
    )
  );
};

export default Explorer;
