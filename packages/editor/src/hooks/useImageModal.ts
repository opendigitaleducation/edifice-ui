import { useState } from "react";

import { useToggle, useWorkspaceFile } from "@edifice-ui/react";
import { Editor } from "@tiptap/react";

import { useImageSelection } from "./useImageSelection";

type EditedImage = { src: string; alt?: string; title?: string } | undefined;

/**
 * Custom hook to manage ImageModal success and cancelation in the current editor context.
 * @returns {
 * `isOpen`: truthy boolean when the modal should be visible,
 * `currentImage`: the image being edited,
 * `toggle`: an imperative function to toggle the `isOpen` value,
 * `handleCancel`: Cancel event handler,
 * `handleEdit`: Edit event handler,
 * `handleSave`: Success event handler,
 * }
 */
export const useImageModal = (editor: Editor | null) => {
  const [currentImage, setCurrentImage] = useState<EditedImage | undefined>(
    undefined,
  );

  const [isOpen, toggle] = useToggle(false);

  // Use hook to createOrUpdate image
  const { createOrUpdate } = useWorkspaceFile();
  // Use hook to get selected images
  const { setAttributes, getSelection } = useImageSelection(editor);

  const handleCancel = () => {
    toggle();
  };

  const handleEdit = () => {
    const selected = getSelection()[0];
    if (selected) {
      setCurrentImage(selected);
      toggle();
    }
  };

  // Callback when image has been edited
  const handleSave = async ({
    blob,
    legend,
    altText: alt,
  }: {
    blob: Blob;
    legend: string;
    altText: string;
  }) => {
    const url = await createOrUpdate({
      blob,
      legend,
      alt,
      uri: currentImage?.src,
    });
    toggle();
    setAttributes({
      url,
      alt,
      title: legend,
    });
  };

  return {
    isOpen,
    currentImage,
    toggle,
    handleCancel,
    handleEdit,
    handleSave,
  };
};
