import { Plus } from "@edifice-ui/icons";
import { useTranslation } from "react-i18next";

import { useDropzoneContext } from "./DropzoneContext";
import { Button } from "../Button";

const DropzoneFile = () => {
  const { t } = useTranslation();
  const { inputRef } = useDropzoneContext();

  return (
    <div className="drop-file-content">
      <div className="add-button m-4">
        <Button
          variant="ghost"
          leftIcon={<Plus></Plus>}
          onClick={() => inputRef?.current?.click()}
        >
          {t("add")}
        </Button>
      </div>
    </div>
  );
};

DropzoneFile.displayName = "Dropzone.File";

export default DropzoneFile;
