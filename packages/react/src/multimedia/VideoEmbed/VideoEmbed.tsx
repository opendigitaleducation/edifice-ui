import { useEffect, useId, useState } from "react";

import { ArrowRight, Globe } from "@edifice-ui/icons";
import { Embedder, odeServices } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import {
  Button,
  EmptyScreen,
  FormControl,
  Image,
  Input,
} from "../../components";
import { usePaths } from "../../core";
import { useDebounce } from "../../hooks";
import { useMediaLibraryContext } from "../MediaLibrary/MediaLibraryContext";

export interface VideoEmbedProps {
  onSuccess: (resource?: string) => void;
}

const VideoEmbed = ({ onSuccess }: VideoEmbedProps) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>();
  const [embedVideo, setEmbedVideo] = useState<string>();
  const [embedder, setEmbbeder] = useState<Embedder | undefined>(undefined);
  const debounceChangeUrl = useDebounce<string>(url || "", 300);
  const [whiteListProvider, setWhiteListProvider] = useState<Embedder[]>();
  const { switchType } = useMediaLibraryContext();
  const formControlId = useId();

  const [imagePath] = usePaths();

  useEffect(() => {
    initWhiteListProvider();
  }, []);

  useEffect(() => {
    if (whiteListProvider && debounceChangeUrl) {
      const embedderFound = odeServices
        .embedder()
        .getProviderFromUrl(whiteListProvider, debounceChangeUrl);
      if (embedderFound) {
        setEmbbeder(embedderFound);
        const embedVideo = odeServices
          .embedder()
          .getEmbedCodeForProvider(embedderFound, debounceChangeUrl);
        setEmbedVideo(embedVideo);
        onSuccess(embedVideo);
      } else {
        setEmbbeder(undefined);
        onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceChangeUrl, whiteListProvider]);

  const initWhiteListProvider = async () => {
    const whiteListProviderResponse = await Promise.all([
      odeServices.embedder().getDefault(),
      odeServices.embedder().getCustom(),
    ]).then((results) => results.flat());
    setWhiteListProvider(whiteListProviderResponse);
  };

  function handleUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    const url: string = event.currentTarget.value;
    setUrl(url);
    onSuccess(url?.length ? url : undefined);
  }

  function handleSwitchToEmbedderClick() {
    switchType("embedder");
  }

  const renderContent = () => {
    if (debounceChangeUrl) {
      if (embedder) {
        return (
          <div className="mx-auto mt-16">
            <div className="video-embed-provider  d-flex align-items-center">
              <Image
                src={embedder.logo}
                alt={"Logo " + embedder.displayName}
                className="video-embed-provider-logo"
              ></Image>
              {embedder.displayName}
            </div>
            {embedVideo && (
              <div
                className="video-embed-preview mt-12"
                dangerouslySetInnerHTML={{
                  __html: embedVideo,
                }}
              ></div>
            )}
          </div>
        );
      } else {
        return (
          <div className="d-flex flex-column align-items-center m-16">
            <EmptyScreen
              imageSrc={`${imagePath}/emptyscreen/illu-error.svg`}
              title={t("Prévisualisation de la vidéo non disponible")}
              text={t(
                "Le lien n'est pas reconnu, vous pouvez utiliser un code embed ou iframe, afin qu'elle s'affiche correctement.",
              )}
            />
            <Button
              variant="ghost"
              color="secondary"
              onClick={handleSwitchToEmbedderClick}
              className="align-items-start mt-16"
            >
              {t("Utiliser un code embed ou iframe")} <ArrowRight />
            </Button>
          </div>
        );
      }
    } else {
      return (
        <div className="d-flex my-16 align-items-start">
          <Button
            variant="ghost"
            color="secondary"
            onClick={handleSwitchToEmbedderClick}
            className="align-items-start"
          >
            {t("Utiliser un code embed ou iframe")} <ArrowRight />
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="d-flex flex-column flex-fill video-embed">
      <div className="mb-8 d-flex">
        <Globe className="me-8"></Globe>
        {t("URL de la vidéo")}
      </div>
      <FormControl id={formControlId}>
        <Input
          size="md"
          type="text"
          placeholder={t("www.exemple-video.com")}
          onChange={handleUrlChange}
        />
      </FormControl>
      <>{renderContent()}</>
    </div>
  );
};

export default VideoEmbed;
