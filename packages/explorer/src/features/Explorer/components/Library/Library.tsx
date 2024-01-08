import {
  Library as CoreLibrary,
  usePaths,
  useOdeTheme,
  useLibraryUrl,
} from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

const Library = () => {
  const { t } = useTranslation();
  const { theme } = useOdeTheme();
  const { libraryUrl } = useLibraryUrl();
  const [imagePath] = usePaths();

  return (
    <CoreLibrary
      src={`${imagePath}/${theme?.bootstrapVersion}/image-library.svg`}
      url={libraryUrl}
      alt={t("explorer.libray.img.alt")}
      text={t("explorer.libray.title")}
      textButton={t("explorer.libray.btn")}
    />
  );
};

export default Library;
