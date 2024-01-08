import { Suspense, lazy, forwardRef, useImperativeHandle, Ref } from "react";

import "@edifice-tiptap-extensions/extension-image";
import { LoadingScreen, MediaLibrary, useOdeClient } from "@edifice-ui/react";
import { BubbleMenu, EditorContent, Content, JSONContent } from "@tiptap/react";

import {
  EditorToolbar,
  EditorContext,
  useImageModal,
  useLinkToolbar,
  useMathsModal,
  useMediaLibraryModal,
  useSpeechSynthetisis,
  useTipTapEditor,
  LinkToolbar,
  TableToolbar,
  BubbleMenuEditImage,
} from "../..";

//-------- LAZY IMPORTS --------//
const KatexStyles = lazy(async () => {
  /**
   * Lazy import of a CSS file requires :
   * 1) bundling the CSS as a JS module, which done by Vite, when an `import()` exists.
   *    => the CSS rules are stringified and exported from the JS module as `default`.
   * 2) exporting a "ReactNode factory" from the lazy() call.
   *
   * Both requirements are implemented below :
   */
  const katex = await import("../../styles/katex.scss");
  return { default: () => <style>{katex.default}</style> };
});

const MathsModal = lazy(async () => await import("./MathsModal"));

const ImageEditor = lazy(async () => {
  const module = await import("@edifice-ui/react");
  return { default: module.ImageEditor };
});

export interface EditorRef {
  /** Get the current content. */
  getContent: (
    as: "html" | "json" | "plain",
  ) => undefined | string | JSONContent;

  /** Get speech synthetisis current state */
  isSpeeching: () => boolean;
  /** [De]activate speech synthetisis */
  toogleSpeechSynthetisis: () => boolean;
}

/**
 * Editor component properties
 */
export interface EditorProps {
  /** Rich content to render. */
  content: Content;
  /**
   * Rendering mode : `edit` to allow content modifications, or `read` (default)
   * Switching to `edit` mode will also render the toolbar
   * (unless `toolbar` property is `none`).
   */
  mode?: "edit" | "read" /* | "preview" */;
  /** Toolbar to display in `edit` mode. */
  toolbar?: "full" | "none";
}

const Editor = forwardRef(
  (
    { content, mode = "read", toolbar = "full" }: EditorProps,
    ref: Ref<EditorRef>,
  ) => {
    const { appCode } = useOdeClient();
    const { editor, editable } = useTipTapEditor(mode === "edit", content);
    const { ref: mediaLibraryModalRef, ...mediaLibraryModalHandlers } =
      useMediaLibraryModal(editor);
    const { toggle: toggleMathsModal, ...mathsModalHandlers } =
      useMathsModal(editor);
    const imageModal = useImageModal(editor);
    const linkToolbarHandlers = useLinkToolbar(editor, mediaLibraryModalRef);
    const speechSynthetisis = useSpeechSynthetisis(editor);

    //----- Editor API
    useImperativeHandle(ref, () => ({
      getContent: (as: "html" | "json" | "plain") => {
        switch (as) {
          case "html":
            return editor?.getHTML();
          case "json":
            return editor?.getJSON();
          case "plain":
            return editor?.getText();
          default:
            throw `[Editor] Unknown content format ${as}`;
        }
      },
      toogleSpeechSynthetisis: speechSynthetisis.toggle,
      isSpeeching: () => speechSynthetisis.isActivated,
    }));

    return (
      <EditorContext.Provider
        value={{
          appCode,
          editor,
        }}
      >
        <div className="border rounded">
          {toolbar !== "none" && editable && (
            <EditorToolbar
              {...{
                editor,
                mediaLibraryRef: mediaLibraryModalRef,
                toggleMathsModal: toggleMathsModal,
              }}
            />
          )}
          <EditorContent
            editor={editor}
            id="editorContent"
            className="py-12 px-16"
          />
        </div>

        <LinkToolbar editor={editor} {...linkToolbarHandlers} />

        <TableToolbar editor={editor} />

        {editor && (
          <BubbleMenu
            className={imageModal.isOpen ? "d-none" : ""}
            shouldShow={({ editor }) => {
              return editor.isActive("custom-image") && !imageModal.isOpen;
            }}
            editor={editor}
            tippyOptions={{
              duration: 100,
              placement: "bottom-start",
              zIndex: 999,
            }}
          >
            <BubbleMenuEditImage
              editor={editor}
              onEditImage={imageModal.handleEdit}
            />
          </BubbleMenu>
        )}

        <Suspense fallback={<LoadingScreen />}>
          <KatexStyles></KatexStyles>

          {editable && (
            <MediaLibrary
              appCode={appCode}
              ref={mediaLibraryModalRef}
              {...mediaLibraryModalHandlers}
            />
          )}

          {editable && mathsModalHandlers.isOpen && (
            <MathsModal {...mathsModalHandlers} />
          )}

          {editable && imageModal?.isOpen && imageModal?.currentImage && (
            <ImageEditor
              altText={imageModal?.currentImage.alt}
              legend={imageModal?.currentImage.title}
              image={imageModal?.currentImage.src}
              isOpen={imageModal.isOpen}
              onCancel={imageModal.handleCancel}
              onSave={imageModal.handleSave}
              onError={console.error}
            />
          )}
        </Suspense>
      </EditorContext.Provider>
    );
  },
);

export default Editor;
