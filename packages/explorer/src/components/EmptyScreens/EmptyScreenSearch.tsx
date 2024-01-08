import { EmptyScreen, useOdeClient, usePaths } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

export default function EmptyScreenSearch(): JSX.Element {
  const { appCode } = useOdeClient();
  const [imagePath] = usePaths();
  const { t } = useTranslation();

  return (
    <EmptyScreen
      imageSrc={`${imagePath}/emptyscreen/illu-search.svg`}
      imageAlt={t("explorer.emptyScreen.search.alt", { ns: appCode })}
      text={t("explorer.emptyScreen.search.text", { ns: appCode })}
    />
  );
}
