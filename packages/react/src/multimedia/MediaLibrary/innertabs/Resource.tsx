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
  const context = useMediaLibraryContext();
  const [isChecked, toggleChecked] = useToggle(false);

  const handleSelect = (resources: ILinkedResource[]) => {
    context.setResult({
      target: isChecked ? "_blank" : undefined,
      resources,
    } as ResourceTabResult);
    if (resources && resources.length) {
      context.setResultCounter(resources.length);
    } else {
      context.setResultCounter(undefined);
    }
  };

  return (
    <div className="d-flex flex-column flex-fill gap-16">
      <InternalLinker
        appCode={context.appCode}
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
