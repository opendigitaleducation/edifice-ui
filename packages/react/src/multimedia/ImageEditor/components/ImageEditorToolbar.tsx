import React, { useState } from "react";

import { Blur, Crop, FullScreen, Retry, Undo } from "@edifice-ui/icons";
import { useTranslation } from "react-i18next";

import { Button } from "../../../components";

export type ImageEditorAction = "ROTATE" | "UNDO" | "CROP" | "BLUR" | "RESIZE";
interface ImageEditorToolbarProps {
  handle(operation: ImageEditorAction): void;
}

const ImageEditorToolbar = ({ handle }: ImageEditorToolbarProps) => {
  const { t } = useTranslation();
  const [action, setAction] = useState<ImageEditorAction | undefined>(
    undefined,
  );
  const handleAndSave = (action: ImageEditorAction) => {
    setAction(action);
    handle(action);
  };
  return (
    <div
      className="d-flex flex-row align-items-center justify-content-start gap-2 align-self-start mw-100"
      style={{ overflowX: "scroll" }}
    >
      <Button
        color="tertiary"
        type="button"
        variant={"ghost"}
        leftIcon={<Undo />}
        onClick={() => handleAndSave("UNDO")}
      >
        {t("Annuler l'action")}
      </Button>
      <>&#10072;</>
      <Button
        color="tertiary"
        type="button"
        variant="ghost"
        leftIcon={<Retry />}
        onClick={() => handleAndSave("ROTATE")}
      >
        {t("Pivoter")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        leftIcon={<Crop />}
        variant={action === "CROP" ? "filled" : "ghost"}
        onClick={() => handleAndSave("CROP")}
      >
        {t("Rogner")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        leftIcon={<FullScreen />}
        variant={action === "RESIZE" ? "filled" : "ghost"}
        onClick={() => handleAndSave("RESIZE")}
      >
        {t("Redimensionner")}
      </Button>
      <Button
        color="tertiary"
        type="button"
        leftIcon={<Blur />}
        variant={action === "BLUR" ? "filled" : "ghost"}
        onClick={() => handleAndSave("BLUR")}
      >
        {t("Flouter")}
      </Button>
    </div>
  );
};
export default ImageEditorToolbar;
