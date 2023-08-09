import { useState } from "react";

import {
  Attachment,
  Audio as AudioIcon,
  Image,
  Link,
  RecordVideo,
  Smiley,
  TextBold,
  TextColor,
  TextHighlight,
  TextItalic,
  TextSize,
  TextUnderline,
} from "@edifice-ui/icons";
import { Editor } from "@tiptap/react";

import { useHasWorkflow } from "../../../core";

// import { SizeDropdown } from "~/components/SizeDropdown";

export const useToolbarItems = (editor: Editor | null) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const canRecord = useHasWorkflow(
    "com.opendigitaleducation.video.controllers.VideoController|view",
  );

  console.log(editor?.extensionManager);

  const toolbarItems = editor
    ? [
        {
          name: "image",
          icon: <Image />,
          label: "Ajout d'image",
          action: () => setIsOpen(true),
          isEnabled: true,
        },
        {
          name: "record_video",
          icon: <RecordVideo />,
          label: "Ajout de vidéo",
          action: () => setIsOpen(true),
          isEnabled: canRecord,
        },
        {
          name: "audio",
          icon: <AudioIcon />,
          label: "Ajout d'audio",
          action: () => setIsOpen(true),
          isEnabled: true,
        },
        {
          name: "attachment",
          icon: <Attachment />,
          label: "Ajout de pièce jointe",
          action: () => console.log("action"),
          isEnabled: true,
        },
        {
          type: "divider",
        },
        /* {
          name: "text_typo",
          icon: <TextTypo />,
          label: "Choix de la famille de typographie",
          hasDropdown: true,
          content: (index: any, props: any) => (
            <SizeDropdown key={index} {...props} />
          ),
          action: () => editor?.commands.setHeading({ level: 1 }),
          isActive: () => editor?.isActive("heading", { level: 1 }),
          isEnabled: true,
        }, */
        {
          name: "text_size",
          icon: <TextSize />,
          label: "Choix de la taille de typographie",
          action: () => editor?.chain().focus().toggleBold().run(),
          isEnabled: true,
        },
        {
          name: "color",
          icon: <TextColor />,
          label: "Choix de la couleur",
          action: () => editor?.chain().focus().toggleColor().run(),
          isActive: () => editor?.isActive("color"),
          isEnabled: true,
          // isEnabled: editor?.extensionManager.splittableMarks.includes("color"),
        },
        {
          name: "highlight",
          icon: <TextHighlight />,
          label: "Choix de la couleur",
          action: () => editor?.chain().focus().toggleHighlight().run(),
          isActive: () => editor?.isActive("highlight"),
          isEnabled:
            editor?.extensionManager.splittableMarks.includes("highlight"),
        },
        {
          type: "divider",
        },
        {
          name: "bold",
          icon: <TextBold />,
          label: "Ajout de gras",
          action: () => editor?.chain().focus().toggleBold().run(),
          isActive: () => editor?.isActive("bold"),
          isEnabled: true,
        },
        {
          name: "italic",
          icon: <TextItalic />,
          label: "Incliner le texte",
          action: () => editor?.chain().focus().toggleItalic().run(),
          isActive: () => editor?.isActive("italic"),
          isEnabled: true,
        },
        {
          name: "underline",
          icon: <TextUnderline />,
          label: "Souligner le texte",
          action: () => editor?.chain().focus().toggleUnderline().run(),
          isActive: () => editor?.isActive("underline"),
          isEnabled: true,
        },
        {
          type: "divider",
        },
        {
          name: "emoji",
          icon: <Smiley />,
          label: "Choix de la taille de typographie",
          isActive: () => editor?.isActive("emoji"),
          isEnabled: true,
        },
        {
          name: "linker",
          icon: <Link />,
          label: "Ajout d'un lien",
          isActive: () => editor?.isActive("linker"),
          isEnabled: true,
        },
      ]
    : [];

  return { toolbarItems, isOpen, setIsOpen };
};
