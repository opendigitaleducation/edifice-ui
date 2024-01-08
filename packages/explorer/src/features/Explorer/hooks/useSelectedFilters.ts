/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { useOdeClient } from "@edifice-ui/react";
import { APP } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { useCurrentFolder, useSearchParams, useStoreActions } from "~/store";

export const useSelectedFilters = () => {
  const { appCode, currentApp } = useOdeClient();
  const { t } = useTranslation();

  const [selectedFilters, setSelectedFilters] = useState<string>("");

  const handleOnSelectFilter = (value: string) => {
    if (value === "0") {
      setSelectedFilters("");
      return;
    }
    setSelectedFilters(value);
  };

  const currentFolder = useCurrentFolder();
  const searchParams = useSearchParams();
  const { setSearchParams } = useStoreActions();

  useEffect(() => {
    const isOwnerSelected = (): boolean | undefined => {
      return selectedFilters.includes("1") ? true : undefined;
    };

    const isSharedSelected = (): boolean | undefined => {
      return selectedFilters.includes("2") ? true : undefined;
    };

    const isPublicSelected = (): boolean | undefined => {
      return selectedFilters.includes("7") ? true : undefined;
    };

    setSearchParams({
      ...searchParams,
      filters: {
        owner: isOwnerSelected(),
        public: isPublicSelected(),
        shared: isSharedSelected(),
        folder: currentFolder ? currentFolder.id : "default",
      },
    });
  }, [currentFolder, setSearchParams, selectedFilters]);

  const options = [
    { label: t("explorer.filter.all", { ns: appCode }), value: "0" },
    { label: t("explorer.filter.owner", { ns: appCode }), value: "1" },
    { label: t("explorer.filter.shared", { ns: appCode }), value: "2" },
    ...(currentApp?.displayName == APP.EXERCIZER
      ? [{ label: "Exercices interactifs", value: "3" }]
      : []),
    ...(currentApp?.displayName == APP.EXERCIZER
      ? [{ label: "Exercices à rendre", value: "4" }]
      : []),
    ...(currentApp?.displayName == "pages"
      ? [{ label: "Projets publics", value: "5" }]
      : []),
    ...(currentApp?.displayName == "pages"
      ? [{ label: "Projets internes", value: "6" }]
      : []),
    ...(currentApp?.displayName == APP.BLOG
      ? [{ label: t("explorer.filter.public", { ns: appCode }), value: "7" }]
      : []),
  ];

  return { selectedFilters, options, handleOnSelectFilter };
};
