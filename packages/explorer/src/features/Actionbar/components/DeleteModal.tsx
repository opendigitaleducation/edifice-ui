import { Modal, Button } from "@edifice-ui/react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import useDeleteModal from "../hooks/useDeleteModal";

interface ModalProps {
  isOpen: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function DeleteModal({
  isOpen,
  onSuccess = () => ({}),
  onCancel = () => ({}),
}: ModalProps) {
  const { t } = useTranslation();
  const { isTrashFolder, onDelete } = useDeleteModal({
    onSuccess,
  });
  return createPortal(
    <Modal isOpen={isOpen} onModalClose={onCancel} id="deleteModal">
      <Modal.Header onModalClose={onCancel}>
        {t(isTrashFolder ? "explorer.delete.title" : "explorer.trash.title")}
      </Modal.Header>
      <Modal.Body>
        <p className="body">
          {t(
            isTrashFolder
              ? "explorer.delete.subtitle"
              : "explorer.trash.subtitle",
          )}
        </p>
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
          color="danger"
          onClick={onDelete}
          type="button"
          variant="filled"
        >
          {t(isTrashFolder ? "explorer.delete" : "explorer.trash")}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
}
