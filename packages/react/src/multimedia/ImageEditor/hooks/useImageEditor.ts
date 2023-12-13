import { useEffect, useState } from "react";

import * as PIXI from "pixi.js";

import useHistoryTool from "./useHistoryTool";
import useImageEffects from "./useImageEffects";
import {
  DEFAULT_SPRITE_NAME,
  updateImage,
  saveAsBlob,
  saveAsDataURL,
  updateImageFromBlob,
} from "../effects/misc";
/**
 * This hook expose all the functions available for the pixi editor:
 * - all the effects (crop, resize, rotate, blur)
 * - historize every action
 * - backup functions
 *
 * @param args.spriteName The spriteName of the original image
 * @param args.imageSrc The URL of the image to edit
 * @returns all the action available for the image editor
 */
export default function useImageEditor({
  imageSrc,
  spriteName = DEFAULT_SPRITE_NAME,
}: {
  imageSrc: string;
  spriteName?: string;
}) {
  const [application, setApplication] = useState<PIXI.Application | undefined>(
    undefined,
  );
  const {
    rotate,
    startBlur,
    startCrop,
    startResize,
    stopBlur,
    stopCrop,
    stopResize,
  } = useImageEffects({
    spriteName,
    application,
    onSave(sprite) {
      if (application) {
        updateImage(application, {
          imgDatasource: sprite,
          spriteName,
        });
      }
    },
  });

  const toBlob = (): Promise<Blob | undefined> => {
    if (!application) return Promise.resolve(undefined);
    return saveAsBlob(application);
  };
  const toDataURL = (): string | undefined => {
    if (!application) return undefined;
    return saveAsDataURL(application);
  };

  const { restore, historize, historyCount } = useHistoryTool({
    application,
    spriteName,
    onRestore(imgDatasource, state) {
      if (!application) return undefined;
      updateImageFromBlob(application, {
        imgDatasource,
        spriteName,
        settings: state,
      });
    },
  });

  useEffect(() => {
    if (!application) return undefined;
    updateImage(application, { spriteName, imgDatasource: imageSrc });
  }, [application, imageSrc, spriteName]);
  return {
    historyCount,
    setApplication,
    restore,
    stopCrop,
    stopBlur,
    stopResize,
    startResize: historize(startResize),
    startCrop: historize(startCrop),
    startBlur: historize(startBlur),
    rotate: historize(rotate),
    toBlob,
    toDataURL,
  };
}
