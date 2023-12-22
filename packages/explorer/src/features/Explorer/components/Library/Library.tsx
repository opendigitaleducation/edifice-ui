import {
  Library as CoreLibrary,
  usePaths,
  useOdeTheme,
} from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

const Library = ({ url }: { url: string }) => {
  const { t } = useTranslation();
  const { theme } = useOdeTheme();
  const [imagePath] = usePaths();

  return (
    <CoreLibrary
      src={`${imagePath}/${theme?.bootstrapVersion}/image-library.svg`}
      url={url}
      alt={t("explorer.libray.img.alt")}
      text={t("explorer.libray.title")}
      textButton={t("explorer.libray.btn")}
    />
  );
};

export default Library;
