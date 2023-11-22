import { ReactNode } from "react";

import { Plus } from "@edifice-ui/icons";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useDropzoneContext } from "./DropzoneContext";
import Button from "../Button/Button";

const DropzoneFile = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { files, inputRef } = useDropzoneContext();

  const hasFiles = files && files.length > 0;

  const classes = clsx("drop-file-wrapper", {
    "d-block": hasFiles,
    "d-none": !hasFiles,
  });

  return (
    <div className={classes}>
      <div className="drop-file-content">
        <div className="add-button m-4">
          <Button
            variant="ghost"
            leftIcon={<Plus></Plus>}
            onClick={() => inputRef?.current?.click()}
          >
            {t("medialibrary.drop.morefiles")}
          </Button>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
};

DropzoneFile.displayName = "Dropzone.File";

export default DropzoneFile;
