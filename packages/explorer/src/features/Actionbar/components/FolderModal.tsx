import { useEffect } from "react";

import { Modal, Button, FormControl, Label, Input } from "@edifice-ui/react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import useEditFolderModal from "~/features/Actionbar/hooks/useEditFolderModal";

interface EditFolderModalProps {
  isOpen: boolean;
  edit: boolean;
  onSuccess?: () => void;
  onCancel: () => void;
}

export default function EditFolderModal({
  isOpen,
  edit,
  onSuccess,
  onCancel: onClose,
}: EditFolderModalProps) {
  const { t } = useTranslation();
  const {
    isDirty,
    isValid,
    isSubmitting,
    formId,
    onSubmit,
    onCancel,
    handleSubmit,
    register,
    setFocus,
  } = useEditFolderModal({
    edit,
    onSuccess,
    onClose,
  });

  useEffect(() => {
    if (isOpen) {
      setFocus("name");
    }
  }, [isOpen, setFocus]);

  return isOpen
    ? createPortal(
        <Modal isOpen={isOpen} onModalClose={onCancel} id={"modal_" + formId}>
          <Modal.Header onModalClose={onCancel}>
            {t(edit ? "explorer.rename.folder" : "explorer.create.folder")}
          </Modal.Header>
          <Modal.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)}>
              <FormControl id="nameFolder" isRequired>
                <Label>{t("explorer.create.folder.name")}</Label>
                <Input
                  type="text"
                  {...register("name", {
                    required: true,
                    pattern: {
                      value: /[^ ]/,
                      message: "invalid title",
                    },
                  })}
                  placeholder={t("explorer.create.folder.name")}
                  size="md"
                  aria-required={true}
                />
              </FormControl>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="tertiary"
              onClick={onCancel}
              type="button"
              variant="ghost"
            >
              {t("explorer.cancel")}
            </Button>
            <Button
              form={formId}
              type="submit"
              color="primary"
              variant="filled"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              {t(edit ? "explorer.rename" : "explorer.create")}
            </Button>
          </Modal.Footer>
        </Modal>,
        document.getElementById("portal") as HTMLElement,
      )
    : null;
}
