import { Modal, Button, TreeView } from "@edifice-ui/react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import useMoveModal from "../hooks/useMoveModal";
import { useTreeData } from "~/store";

interface MoveModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MoveModal({
  isOpen,
  onSuccess,
  onCancel,
}: MoveModalProps) {
  const { t } = useTranslation();
  const {
    handleTreeItemFold,
    handleTreeItemSelect,
    handleTreeItemUnfold,
    onMove,
    disableSubmit,
  } = useMoveModal({ onSuccess });

  const treeData = useTreeData();

  return createPortal(
    <Modal isOpen={isOpen} onModalClose={onCancel} id="moveModal">
      <Modal.Header onModalClose={onCancel}>
        {t("explorer.move.title")}
      </Modal.Header>
      <Modal.Subtitle>{t("explorer.move.subtitle")}</Modal.Subtitle>
      <Modal.Body>
        <TreeView
          data={treeData}
          onTreeItemSelect={handleTreeItemSelect}
          onTreeItemFold={handleTreeItemFold}
          onTreeItemUnfold={handleTreeItemUnfold}
        />
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
          color="primary"
          onClick={onMove}
          type="button"
          variant="filled"
          disabled={disableSubmit}
        >
          {t("explorer.move")}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
}
