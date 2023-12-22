import {
  EmptyScreen,
  useOdeClient,
  useOdeTheme,
  usePaths,
} from "@edifice-ui/react";
import { type IAction } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { useActions } from "~/services/queries";

export default function EmptyScreenApp(): JSX.Element {
  const { appCode } = useOdeClient();
  const { theme } = useOdeTheme();
  const [imagePath] = usePaths();
  const { t } = useTranslation();

  const { data: actions } = useActions();

  const canCreate = actions?.find((action: IAction) => action.id === "create");
  const labelEmptyScreenApp = () => {
    if (canCreate?.available && theme?.is1d) {
      // TODO should not have specific app i18n
      return t("explorer.emptyScreen.txt1d.create", { ns: appCode });
    } else if (canCreate?.available && !theme?.is1d) {
      return t("explorer.emptyScreen.txt2d.create", { ns: appCode });
    } else if (!canCreate?.available && theme?.is1d) {
      return t("explorer.emptyScreen.txt1d.consultation", { ns: appCode });
    } else {
      return t("explorer.emptyScreen.txt2d.consultation", { ns: appCode });
    }
  };

  return (
    <EmptyScreen
      imageSrc={`${imagePath}/emptyscreen/illu-${appCode}.svg`}
      imageAlt={t("explorer.emptyScreen.app.alt", { ns: appCode })}
      title={`${
        canCreate?.available
          ? t("explorer.emptyScreen.title.create", { ns: appCode })
          : t("explorer.emptyScreen.title.consultation")
      }`}
      text={labelEmptyScreenApp()}
    />
  );
}
