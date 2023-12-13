import { Audio } from "@edifice-tiptap-extensions/extension-audio";
import { ReactNodeViewRenderer } from "@tiptap/react";

const AudioNodeView = (Component: any) =>
  Audio.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default AudioNodeView;
