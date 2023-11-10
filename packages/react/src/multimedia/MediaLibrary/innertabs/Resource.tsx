import { ILinkedResource } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { Checkbox } from "../../../components";
import { useToggle } from "../../../hooks";
import InternalLinker from "../../Linker/InternalLinker";
import { useMediaLibraryContext } from "../MediaLibraryContext";

export type ResourceTabResult = {
  target?: "_blank";
  resources?: ILinkedResource[];
};

export const Resource = () => {
  const { t } = useTranslation();
  const { setResult, setResultCounter, appCode } = useMediaLibraryContext();
  const [isChecked, toggleChecked] = useToggle(false);

  const handleSelect = (resources: ILinkedResource[]) => {
    setResult({
      target: isChecked ? "_blank" : undefined,
      resources,
    } as ResourceTabResult);
    if (resources && resources.length) {
      setResultCounter(resources.length);
    } else {
      setResultCounter(undefined);
    }
  };

  return (
    <div className="d-flex flex-column flex-fill gap-16">
      <InternalLinker
        appCode={appCode}
        onSelect={handleSelect}
      ></InternalLinker>
      <Checkbox
        className="align-items-center"
        checked={isChecked}
        label={t("Ouvrir le lien dans un nouvel onglet")}
        onChange={() => toggleChecked()}
      />
    </div>
  );
};
