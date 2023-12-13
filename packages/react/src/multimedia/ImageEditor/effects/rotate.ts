import * as PIXI from "pixi.js";

import { autoResize } from "./misc";

/**
 * This function rotate the sprite by adding PI/2
 *
 * @param application The PIXI.Application context
 * @param spriteName The name of the sprite representing the image
 */
export function rotate(
  application: PIXI.Application,
  spriteName: string,
): void {
  const sprite = application?.stage.getChildByName(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  if (application && sprite) {
    sprite.rotation += Math.PI / 2;
    autoResize(application, sprite);
  }
}
