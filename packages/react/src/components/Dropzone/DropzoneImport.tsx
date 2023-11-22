import { Download } from "@edifice-ui/icons";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useDropzoneContext } from "./DropzoneContext";
import Button from "../Button/Button";

const DropzoneImport = () => {
  const { t } = useTranslation();
  const { files, inputRef } = useDropzoneContext();

  const hasFiles = files && files.length > 0;

  const classes = clsx("import-wrapper", {
    "d-flex": !hasFiles,
    "d-none": hasFiles,
  });

  return (
    <div className={classes}>
      <Download height={48} width={48} />
      <p className="my-16">{t("medialibrary.drop.info")}</p>
      <Button onClick={() => inputRef?.current?.click()}>
        {t("medialibrary.drop.import")}
      </Button>
    </div>
  );
};

DropzoneImport.displayName = "Dropzone.Import";

export default DropzoneImport;
