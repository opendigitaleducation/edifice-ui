import { Video } from "@edifice-tiptap-extensions/extension-video";
import { ReactNodeViewRenderer } from "@tiptap/react";

const VideoNodeView = (Component: any) =>
  Video.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default VideoNodeView;
