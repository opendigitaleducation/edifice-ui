import { useId } from "react";

import { FOLDER } from "edifice-ts-client";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useCreateFolder, useUpdatefolder } from "~/services/queries";
import { useCurrentFolder, useSelectedFolders } from "~/store";

interface useEditFolderModalProps {
  edit: boolean;
  onSuccess?: () => void;
  onClose: () => void;
}

interface HandlerProps {
  name: string;
}

export default function useEditFolderModal({
  edit,
  onSuccess,
  onClose,
}: useEditFolderModalProps) {
  // * https://github.com/pmndrs/zustand#fetching-everything
  // ! https://github.com/pmndrs/zustand/discussions/913

  const selectedFolders = useSelectedFolders();
  const currentFolder = useCurrentFolder();
  const createFolder = useCreateFolder();
  const updatefolder = useUpdatefolder();

  const name = edit ? selectedFolders[0]?.name : undefined;
  const {
    reset,
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<HandlerProps>({
    mode: "onChange",
    values: { name: name || "" },
  });

  const id = useId();

  const onSubmit: SubmitHandler<HandlerProps> = async function ({
    name,
  }: HandlerProps) {
    try {
      if (edit) {
        const parentId = selectedFolders[0]?.parentId;
        const folder = selectedFolders[0];
        const folderId = folder!.id;
        await updatefolder.mutate({ folderId, parentId, name });
        reset();
        onSuccess?.();
      } else {
        const parentId = currentFolder?.id || FOLDER.DEFAULT;
        await createFolder.mutate({ name, parentId });
        reset();
        onSuccess?.();
      }
    } catch (e) {
      // TODO display an alert?
      console.error(e);
    }
  };

  function onCancel() {
    reset();
    onClose();
  }

  const formId = `createModal_${id}`;

  return {
    formId,
    errors,
    isSubmitting,
    isDirty,
    isValid,
    register,
    setFocus,
    handleSubmit,
    onCancel,
    onSubmit,
  };
}
