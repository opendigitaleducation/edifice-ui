import { useMemo, useState } from "react";

import {
  Applications,
  Globe,
  ExternalLink,
  Folder,
  Mic,
  RecordVideo,
  Smartphone,
} from "@edifice-ui/icons";
import { WorkspaceElement, odeServices } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { InnerTabs } from "./innertabs";
import { ResourceTabResult } from "./innertabs/Resource";
import { MediaLibraryContext } from "./MediaLibraryContext";
import { Button } from "../../components";
import Modal from "../../components/Modal/Modal";
import { Tabs } from "../../components/Tabs";
import { TabsItemProps } from "../../components/Tabs/TabsItem";
import { useHasWorkflow } from "../../core/useHasWorkflow";

//---------------------------------------------------
// Tabs parameters
//---------------------------------------------------
/** Ordered list of tabs. */
const orderedTabs = [
  "workspace", // Media browser
  "upload", // Filesystem browser + drag'n'drop of files
  "audio-capture",
  "video-capture",
  "resource", // Link to a shared resource (previously known as "internal linker")
  "linker", // Link to an external website (previously known as "external linker")
  "iframe", // Framed website
];

/**
 * Available features exposed by tabs :
 * "workspace" | "upload" | "audio-capture" | ...
 */
export type AvailableTab = (typeof orderedTabs)[number];

/** Additional properties of tabs. */
export type MediaLibraryTabProps = {
  /**
   * Media Library types where this tab should be displayed.
   * "*" for all types.
   */
  availableFor: Array<MediaLibraryType | "*" | null>;

  /** Required checks before using this feature. */
  isEnable: null | (() => boolean);
};

//---------------------------------------------------
// Media Library parameters
//---------------------------------------------------
/**
 * Pre-configured types of media libraries.
 * Choosing a type will filter out unwanted tabs.
 */
export type MediaLibraryType =
  /** Audio files */
  | "audio"
  /** Video files / streams / links */
  | "video"
  /** Image files */
  | "image"
  /** Attached files */
  | "attachment"
  /** Embedded websites */
  | "embedder"
  /** Hyperlinks */
  | "hyperlink";

type MediaLibraryTypeOptions = {
  /** I18n key describing this MediaLibrary type. */
  title: string;
  /** Default tab to display. */
  defaultTab: AvailableTab;
};

/** Map of MediaLibrary types and options. */
const mediaLibraryTypes: { none: null } & {
  [key in MediaLibraryType]: MediaLibraryTypeOptions;
} = {
  none: null,
  audio: {
    title: "Ajouter un audio depuis...",
    defaultTab: "audio-capture",
  },
  video: {
    title: "Ajouter une vidéo depuis...",
    defaultTab: "video-capture",
  },
  image: { title: "Ajouter une image depuis...", defaultTab: "workspace" },
  attachment: {
    title: "Ajouter une pièce jointe depuis...",
    defaultTab: "workspace",
  },
  hyperlink: { title: "Ajouter un lien", defaultTab: "linker" },
  embedder: { title: "Ajout embed / iframe", defaultTab: "iframe" },
};

/**
 * The resulting type depends on the actual selected Tab when modal is closed.
 */
export type MediaLibraryResult =
  | WorkspaceElement[] // Workspace result
  | ResourceTabResult // Linker result
  | /*TODO type des autres résultats ?*/ any;

/**
 * MediaLibrary component properties
 */
export interface MediaLibraryProps {
  /** Application Code (example: "blog"). */
  appCode: string;
  /** Type of rss to search for. */
  type: MediaLibraryType | null;
  /**
   * Called when the user validates the modal (Add button).
   * @param result depends on which InnerTab is visible
   */
  onSuccess: (result: MediaLibraryResult) => void;
  /** Called when the user closes the modal. */
  onCancel: () => void;
}

//---------------------------------------------------
// Media Library implementation
//---------------------------------------------------
const MediaLibrary = ({
  appCode,
  type,
  onSuccess,
  onCancel,
}: MediaLibraryProps) => {
  const { t } = useTranslation();

  const workspaceCreateWorkflow = useHasWorkflow(
    "org.entcore.workspace.controllers.WorkspaceController|addDocument",
  );
  const videoCaptureWorkflow = useHasWorkflow(
    "com.opendigitaleducation.video.controllers.VideoController|capture",
  );

  const availableTabs: {
    [tabname in AvailableTab]: TabsItemProps & MediaLibraryTabProps;
  } = {
    workspace: {
      id: "workspace",
      icon: <Folder />,
      label: t("Espace doc"),
      content: <InnerTabs.Workspace />,
      availableFor: ["audio", "video", "image", "attachment"],
      isEnable: null,
    },
    upload: {
      id: "upload",
      icon: <Smartphone />,
      label: t("Mon appareil"),
      content: <InnerTabs.Upload />,
      availableFor: ["audio", "video", "image", "attachment"],
      isEnable: () => (workspaceCreateWorkflow ? true : false),
    },
    "video-capture": {
      id: "video",
      icon: <RecordVideo />,
      label: t("Captation vidéo"),
      content: <InnerTabs.Video />,
      availableFor: ["video"],
      isEnable: () => (videoCaptureWorkflow ? true : false),
    },
    "audio-capture": {
      id: "audio",
      icon: <Mic />,
      label: t("Captation audio"),
      content: <InnerTabs.Audio />,
      availableFor: ["audio"],
      isEnable: () => (workspaceCreateWorkflow ? true : false),
    },
    linker: {
      id: "external",
      icon: <Globe />,
      label: t("Liens externes"),
      content: <InnerTabs.Linker />,
      availableFor: ["hyperlink"],
      isEnable: null,
    },
    resource: {
      id: "resource",
      icon: <Applications />,
      label: t("Ressources internes"),
      content: <InnerTabs.Resource />,
      availableFor: ["hyperlink"],
      isEnable: null,
    },
    iframe: {
      id: "iframe",
      icon: <ExternalLink />,
      label: t("</> Balise embed ou iframe"),
      content: <InnerTabs.Iframe />,
      availableFor: ["embedder"],
      isEnable: null,
    },
  };

  // --------------- Hooks
  /* Filter out unwanted tabs. */
  const tabs = useMemo(
    () =>
      orderedTabs
        .map((key) => availableTabs[key])
        .filter(
          (tab) =>
            tab.isEnable?.() !== false &&
            (tab.availableFor.length === 0 || tab.availableFor.includes(type)),
        ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type],
  );

  /* Compute the index of the displayed tab by default. */
  const defaultTabIdx = useMemo<number>(() => {
    const typeKey = type || "none";
    let index = 0;
    if (typeof mediaLibraryTypes[typeKey]?.defaultTab == "string") {
      const defaultTabId = mediaLibraryTypes[typeKey]?.defaultTab;
      index = tabs.findIndex((t) => t.id === defaultTabId);
    }
    // Check boundaries before returning an index.
    return 0 > index || index >= tabs.length ? 0 : index;
  }, [type, tabs]);

  // Stateful contextual values
  const [resultCounter, setResultCounter] = useState<number | undefined>();
  const [result, setResult] = useState<WorkspaceElement | undefined>();
  function setVisibleTab(tab: AvailableTab) {
    const index = tabs.findIndex((t) => t.id === tab);
    if (index < 0) throw "tab.not.visible";
    // TODO améliorer le composant Tabs pour pouvoir le piloter depuis le parent.
    throw "not.implemented.yet";
  }

  // --------------- Utility functions
  const modalHeader = t(
    mediaLibraryTypes[type || "none"]?.title ?? "Bibliothèque multimédia", // FIXME i18n key
  );
  const handleTabChange = async () => {
    // Reset any existing result
    if (result) {
      await odeServices.workspace().deleteFile([result]);
    }
    setResult(undefined);
    setResultCounter(undefined);
  };

  const handleOnSuccess = () => {
    if (result) onSuccess(result);
  };

  const handleOnCancel = async () => {
    if (result) {
      await odeServices.workspace().deleteFile([result]);
    }
    onCancel();
  };

  return type ? (
    <MediaLibraryContext.Provider
      value={{
        appCode,
        type,
        setResultCounter,
        setResult,
        setVisibleTab,
      }}
    >
      <Modal
        id="media-library"
        isOpen={type !== null}
        onModalClose={handleOnCancel}
        size="lg"
        viewport
        scrollable
      >
        <Modal.Header onModalClose={handleOnCancel}>{modalHeader}</Modal.Header>
        <Tabs
          items={tabs}
          defaultId={tabs[defaultTabIdx].id}
          onChange={handleTabChange}
        >
          {(currentItem) => (
            <>
              <Tabs.List className="mt-16" />
              <Modal.Body className="d-flex">
                <Tabs.Panel currentItem={currentItem}>
                  {currentItem?.content}
                </Tabs.Panel>
              </Modal.Body>
            </>
          )}
        </Tabs>
        <Modal.Footer>
          <Button
            type="button"
            color="tertiary"
            variant="ghost"
            onClick={handleOnCancel}
          >
            {t("Annuler")}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="filled"
            disabled={typeof result === "undefined"}
            onClick={handleOnSuccess}
          >
            {t("Ajouter")}
            {typeof resultCounter === "number" &&
              resultCounter > 1 &&
              ` (${resultCounter})`}
          </Button>
        </Modal.Footer>
      </Modal>
    </MediaLibraryContext.Provider>
  ) : null;
};

// Add inner tabs implementations to exported component.
Object.assign(MediaLibrary, InnerTabs);

export default MediaLibrary;
