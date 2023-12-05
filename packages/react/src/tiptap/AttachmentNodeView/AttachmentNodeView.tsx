import { Attachment as AttachmentExt } from "@edifice-tiptap-extensions/extension-attachment";
import { ReactNodeViewRenderer } from "@tiptap/react";

const AttachmentNodeView = (Component: any) =>
  AttachmentExt.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default AttachmentNodeView;
