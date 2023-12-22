import { EmptyScreen, useOdeClient, usePaths } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

export default function EmptyScreenNoContentInFolder(): JSX.Element | null {
  const [imagePath] = usePaths();
  const { appCode } = useOdeClient();
  const { t } = useTranslation();

  return (
    <EmptyScreen
      imageSrc={`${imagePath}/emptyscreen/illu-no-content-in-folder.svg`}
      imageAlt={t("explorer.emptyScreen.folder.empty.alt", { ns: appCode })}
      text={t("explorer.emptyScreen.label", { ns: appCode })}
    />
  );
}
