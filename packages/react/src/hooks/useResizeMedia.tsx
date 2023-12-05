import { useEffect, useRef } from "react";

interface WidthAndHeight {
  width: number;
}

export const useResizeMedia = (props: any, refResizable: any) => {
  const aspectRatio = useRef(0);

  const lastCursorX = useRef(-1);

  const isHorizontalResizeActive = useRef(false);

  const isVerticalResizeActive = useRef(false);

  const proseMirrorContainerWidth = useRef(0);

  const limitWidthOrHeight = ({ width }: WidthAndHeight) => width < 250;

  useEffect(() => {
    const proseMirrorContainerDiv = document.querySelector(".ProseMirror");

    if (proseMirrorContainerDiv)
      proseMirrorContainerWidth.current = proseMirrorContainerDiv?.clientWidth;

    if (!refResizable.current) return;
    aspectRatio.current = 1.5;

    onVerticalResize("left", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVerticalResize = (
    directionOfMouseMove: "right" | "left",
    diff: number,
  ) => {
    if (!refResizable.current) {
      console.error("Media ref is undefined|null", {
        resizableImg: refResizable.current,
      });
      return;
    }

    const currentMediaDimensions = {
      width: refResizable.current?.width,
      height: refResizable.current?.height,
    };

    const newMediaDimensions = {
      width: -1,
      height: -1,
    };

    if (directionOfMouseMove === "left") {
      newMediaDimensions.width = currentMediaDimensions.width - Math.abs(diff);
    } else {
      newMediaDimensions.width = currentMediaDimensions.width + Math.abs(diff);
    }

    if (newMediaDimensions.width > proseMirrorContainerWidth.current)
      newMediaDimensions.width = proseMirrorContainerWidth.current;

    newMediaDimensions.height = newMediaDimensions.width / aspectRatio.current;

    if (limitWidthOrHeight(newMediaDimensions)) return;

    setTimeout(() => {
      props.updateAttributes(newMediaDimensions);
    });
  };

  const onVerticalMouseMove = (e: MouseEvent) => {
    if (!isVerticalResizeActive.current) return;

    const { clientX } = e;

    const diff = lastCursorX.current - clientX;

    lastCursorX.current = clientX;

    if (diff === 0) return;

    const directionOfMouseMove: "left" | "right" = diff > 0 ? "left" : "right";

    onVerticalResize(directionOfMouseMove, Math.abs(diff));
  };

  const startVerticalResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    isVerticalResizeActive.current = true;
    lastCursorX.current = e.clientX;

    document.addEventListener("mousemove", onVerticalMouseMove);
    document.addEventListener("mouseup", stopVerticalResize);
  };

  const stopVerticalResize = () => {
    isVerticalResizeActive.current = false;
    lastCursorX.current = -1;

    document.removeEventListener("mousemove", onVerticalMouseMove);
    document.removeEventListener("mouseup", stopVerticalResize);
  };

  /* HORIZONTAL */

  const onHorizontalMouseMove = (e: MouseEvent) => {
    if (!isHorizontalResizeActive.current) return;

    const { clientY } = e;

    const diff = lastCursorY.current - clientY;

    lastCursorY.current = clientY;

    if (diff === 0) return;

    const directionOfMouseMove: "up" | "down" = diff > 0 ? "up" : "down";

    if (!refResizable.current) {
      console.error("Media ref is undefined|null", {
        resizableImg: refResizable.current,
      });
      return;
    }

    const currentMediaDimensions = {
      width: refResizable.current?.width,
      height: refResizable.current?.height,
    };

    const newMediaDimensions = {
      width: -1,
      height: -1,
    };

    if (directionOfMouseMove === "up") {
      newMediaDimensions.width = currentMediaDimensions.width - Math.abs(diff);
    } else {
      newMediaDimensions.width = currentMediaDimensions.width + Math.abs(diff);
    }

    if (newMediaDimensions.width > proseMirrorContainerWidth.current)
      newMediaDimensions.width = proseMirrorContainerWidth.current;

    newMediaDimensions.height = newMediaDimensions.width / aspectRatio.current;

    if (limitWidthOrHeight(newMediaDimensions)) return;

    setTimeout(() => {
      props.updateAttributes(newMediaDimensions);
    });
  };

  const lastCursorY = useRef(-1);

  const startHorizontalResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    isHorizontalResizeActive.current = true;
    lastCursorY.current = e.clientY;

    document.addEventListener("mousemove", onHorizontalMouseMove);
    document.addEventListener("mouseup", stopHorizontalResize);
  };

  const stopHorizontalResize = () => {
    isHorizontalResizeActive.current = false;
    lastCursorY.current = -1;

    document.removeEventListener("mousemove", onHorizontalMouseMove);
    document.removeEventListener("mouseup", stopHorizontalResize);
  };

  return {
    startHorizontalResize,
    stopHorizontalResize,
    startVerticalResize,
    stopVerticalResize,
    isHorizontalResizeActive,
    isVerticalResizeActive,
  };
};
