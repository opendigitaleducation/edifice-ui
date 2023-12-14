/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef } from "react";

import { NodeViewWrapper } from "@tiptap/react";

import { Image } from "../../components";
import { MediaResizeProps, useResizeMedia } from "../../hooks/useResizeMedia";

const MediaWrapper = (props: MediaResizeProps) => {
  const { node } = props;

  const resizableMedia = useRef<HTMLImageElement | HTMLVideoElement>(null);

  const {
    startHorizontalResize,
    stopHorizontalResize,
    startVerticalResize,
    stopVerticalResize,
    isHorizontalResizeActive,
    isVerticalResizeActive,
  } = useResizeMedia(props, resizableMedia);

  return (
    <NodeViewWrapper>
      <div
        className="media-node-view"
        style={{ position: "relative", width: "fit-content" }}
      >
        <div data-drag-handle>
          {node.attrs["media-type"] === "img" ? (
            <Image
              {...node.attrs}
              className={`custum-image`}
              ref={resizableMedia as React.RefObject<HTMLImageElement>}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={resizableMedia as React.RefObject<HTMLVideoElement>}
              controls={node.attrs.controls}
              src={node.attrs.src}
              width={node.attrs.width}
              height={node.attrs.height}
              data-video-resolution={`${node.attrs.width}x${node.attrs.height}`}
              data-document-id={node.attrs.documentId}
              data-document-is-captation={node.attrs.isCaptation}
            >
              <source src={node.attrs.src} />
            </video>
          )}
        </div>

        <div
          className={`horizontal-resize-handle ${
            isHorizontalResizeActive ? "horizontal-resize-active" : ""
          }`}
          title="Resize"
          onMouseDown={(e) => startHorizontalResize(e)}
          onMouseUp={() => stopHorizontalResize}
        />

        <div
          className={`vertical-resize-handle ${
            isVerticalResizeActive ? "vertical-resize-active" : ""
          }`}
          title="Resize"
          onMouseDown={(e) => startVerticalResize(e)}
          onMouseUp={() => stopVerticalResize}
        />
      </div>
    </NodeViewWrapper>
  );
};

export default MediaWrapper;
