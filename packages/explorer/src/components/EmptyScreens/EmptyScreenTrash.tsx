import { EmptyScreen, useOdeClient, usePaths } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

export default function EmptyScreenTrash(): JSX.Element {
  const { appCode } = useOdeClient();
  const [imagePath] = usePaths();
  const { t } = useTranslation();

  return (
    <EmptyScreen
      imageSrc={`${imagePath}/emptyscreen/illu-trash.svg`}
      imageAlt={t("explorer.emptyScreen.trash.alt")}
      title={t("explorer.emptyScreen.trash.title")}
      text={t("explorer.emptyScreen.trash.empty", { ns: appCode })}
    />
  );
}
