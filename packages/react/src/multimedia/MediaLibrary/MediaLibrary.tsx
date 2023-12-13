import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  Ref,
  useState,
  useEffect,
} from "react";

import {
  Applications,
  Globe,
  Folder,
  Mic,
  RecordVideo,
  Smartphone,
  Code,
} from "@edifice-ui/icons";
import { WorkspaceElement } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { InnerTabs } from "./innertabs";
import {
  InternalLinkTabProps,
  InternalLinkTabResult,
} from "./innertabs/InternalLink";
import { MediaLibraryContext } from "./MediaLibraryContext";
import { Button } from "../../components";
import Modal, { ModalElement } from "../../components/Modal/Modal";
import { Tabs } from "../../components/Tabs";
import { TabsItemProps } from "../../components/Tabs/TabsItem";
import { useHasWorkflow } from "../../core/useHasWorkflow";
import { IExternalLink } from "../Linker";

//---------------------------------------------------
// Tabs parameters
//---------------------------------------------------
/** Ordered list of tabs. */
const orderedTabs = [
  "audio-capture",
  "video-capture",
  "internal-link", // Link to a shared resource (previously known as "internal linker")
  "external-link", // Link to an external website (previously known as "external linker")
  "iframe", // Framed website
  "upload", // Filesystem browser + drag'n'drop of files
  "workspace", // Media browser
  "video-embedder", // Link to a hosted video
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

export interface MediaLibraryRef {
  /** Open the Media Library on given type. */
  show: (type: MediaLibraryType) => void;

  /** Close the Media Library. */
  hide: () => void;

  /**
   * Open the MediaLibrary on a internal/external link Tab,
   * and prefill the tab with data.
   */
  editLink: (data: InternalLinkTabProps | IExternalLink) => void;
  /** Get the Media Libray type currently displayed, or null if hidden. */
  type: MediaLibraryType | null;
}

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
  | WorkspaceElement // Workspace result
  | InternalLinkTabResult // Linker result
  | string
  | /*TODO type des autres résultats ?*/ any;

/**
 * MediaLibrary component properties
 */
export interface MediaLibraryProps {
  /** Application Code (example: "blog"). */
  appCode: string;
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
const MediaLibrary = forwardRef(
  (
    { appCode, onSuccess, onCancel }: MediaLibraryProps,
    ref: Ref<MediaLibraryRef>,
  ) => {
    // Local ref will be merged with forwardRef in useImperativeHandle() below
    const refModal = useRef<ModalElement>(null);
    // Methods to control the Media Library from parent component
    useImperativeHandle(ref, () => ({
      show,
      hide,
      editLink,
      type,
      ...refModal.current,
    }));

    const { t } = useTranslation();

    const workspaceCreateWorkflow = useHasWorkflow(
      "org.entcore.workspace.controllers.WorkspaceController|addDocument",
    );
    const videoCaptureWorkflow = useHasWorkflow(
      "com.opendigitaleducation.video.controllers.VideoController|capture",
    );

    // Used to prefill the [in|ex]ternal innertab.
    const [linkTabProps, setLinkTabProps] = useState<
      InternalLinkTabProps | IExternalLink | undefined
    >();

    const [type, setType] = useState<MediaLibraryType | null>(null);

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
        id: "video-capture",
        icon: <RecordVideo />,
        label: t("Captation vidéo"),
        content: <InnerTabs.Video />,
        availableFor: ["video"],
        isEnable: () => (videoCaptureWorkflow ? true : false),
      },
      "audio-capture": {
        id: "audio-capture",
        icon: <Mic />,
        label: t("Captation audio"),
        content: <InnerTabs.Audio />,
        availableFor: ["audio"],
        isEnable: () => (workspaceCreateWorkflow ? true : false),
      },
      "external-link": {
        id: "external-link",
        icon: <Globe />,
        label: t("Liens externes"),
        content: (
          <InnerTabs.ExternalLink {...(linkTabProps as IExternalLink)} />
        ),
        availableFor: ["hyperlink"],
        isEnable: null,
      },
      "internal-link": {
        id: "internal-link",
        icon: <Applications />,
        label: t("Ressources internes"),
        content: (
          <InnerTabs.InternalLink {...(linkTabProps as InternalLinkTabProps)} />
        ),
        availableFor: ["hyperlink"],
        isEnable: null,
      },
      iframe: {
        id: "iframe",
        icon: <Code />,
        label: t("Balise embed ou iframe"),
        content: <InnerTabs.Iframe />,
        availableFor: ["embedder"],
        isEnable: null,
      },
      "video-embedder": {
        id: "iframe",
        icon: <Code />,
        label: t("Balise embed ou iframe"),
        content: <InnerTabs.VideoEmbedder />,
        availableFor: ["video"],
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
              (tab.availableFor.length === 0 ||
                tab.availableFor.includes(type)),
          ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [type],
    );

    const [defaultTabId, setDefaultTabId] = useState<
      AvailableTab | undefined
    >();

    /* Compute the index of the displayed tab by default. */
    const defaultTabIdx = useMemo<number>(() => {
      const index = tabs.findIndex((t) => t.id === defaultTabId);
      return 0 > index || index >= tabs.length ? 0 : index;
    }, [tabs, defaultTabId]);

    // Stateful contextual values
    const [resultCounter, setResultCounter] = useState<number | undefined>();
    const [result, setResult] = useState<MediaLibraryResult | undefined>();

    function setVisibleTab(tab: AvailableTab) {
      const index = tabs.findIndex((t) => t.id === tab);
      if (index < 0) throw "tab.not.visible";
      // TODO améliorer le composant Tabs pour pouvoir le piloter depuis le parent.
      throw "not.implemented.yet";
    }

    function switchType(type: MediaLibraryType) {
      setLinkTabProps(undefined);
      setDefaultTabId(undefined);
      setType(type);
    }

    // --------------- Imperative functions
    const show = (type: MediaLibraryType) => {
      setType(type);
    };

    const hide = () => {
      setType(null);
    };

    const editLink = (props: InternalLinkTabProps | IExternalLink) => {
      setLinkTabProps(props);
      const asInternal = props as InternalLinkTabProps;
      if (!asInternal?.resourceId && !asInternal?.appPrefix) {
        setDefaultTabId("external-link");
      }
      setType("hyperlink");
    };

    // If not set before, determine which available tab to display when type change.
    useEffect(() => {
      const typeKey = type || "none";
      if (
        !defaultTabId &&
        typeof mediaLibraryTypes[typeKey]?.defaultTab === "string"
      ) {
        setDefaultTabId(mediaLibraryTypes[typeKey]?.defaultTab);
      }
    }, [defaultTabId, type]);

    // --------------- Utility functions
    const modalHeader = t(
      mediaLibraryTypes[type ?? "none"]?.title ?? "Bibliothèque multimédia", // FIXME i18n key
    );
    const handleTabChange = () => {
      setResult(undefined);
      setResultCounter(undefined);
      setLinkTabProps(undefined);
      setDefaultTabId(undefined);
    };

    const handleOnSuccess = () => {
      if (result) onSuccess(result);
      setLinkTabProps(undefined);
      setDefaultTabId(undefined);
    };

    const handleOnCancel = () => {
      onCancel();
      setLinkTabProps(undefined);
      setDefaultTabId(undefined);
    };

    return type ? (
      <MediaLibraryContext.Provider
        value={{
          appCode,
          type,
          setResultCounter,
          setResult,
          setVisibleTab,
          switchType,
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
          <Modal.Header onModalClose={handleOnCancel}>
            {modalHeader}
          </Modal.Header>
          <Tabs
            items={tabs}
            defaultId={tabs[defaultTabIdx].id}
            onChange={handleTabChange}
          >
            {(currentItem) => (
              <>
                {tabs.length > 1 && <Tabs.List className="mt-16" />}
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
  },
);

// Add inner tabs implementations to exported component.
Object.assign(MediaLibrary, InnerTabs);

export default MediaLibrary;
