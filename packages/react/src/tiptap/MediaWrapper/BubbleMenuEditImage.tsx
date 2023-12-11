import {
  ImageSizeLarge,
  ImageSizeMedium,
  ImageSizeSmall,
  Wand,
} from "@edifice-ui/icons";
import { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

import { Button, IconButton } from "../../components";

interface ButtonSize {
  icon: JSX.Element;
  sizeName: string;
  size: {
    width: number;
    height: number | string;
  };
}

const BubbleMenuEditImage = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();

  const buttonSizeList = [
    {
      icon: <ImageSizeSmall />,
      sizeName: "small",
      size: {
        width: 250,
        height: "auto",
      },
    },
    {
      icon: <ImageSizeMedium />,
      sizeName: "medium",
      size: {
        width: 350,
        height: "auto",
      },
    },
    {
      icon: <ImageSizeLarge />,
      sizeName: "large",
      size: {
        width: 500,
        height: "auto",
      },
    },
  ];

  const handleButtonClick = (buttonSize: ButtonSize) => {
    editor
      .chain()
      .focus()
      .setAttributes({
        width: buttonSize.size.width,
        height: buttonSize.size.height,
        size: buttonSize.sizeName,
      })
      .run();
  };

  const { selection } = editor.view.state;

  const selectedNode = editor.view.state.doc.nodeAt(selection.anchor);

  return (
    <div className="bubble-menu">
      <Button
        size="lg"
        variant="ghost"
        leftIcon={<Wand />}
        color="secondary"
        //onClick={() => } Afficher la modal d'edit modal
      >
        {t("edit.image")}
      </Button>
      <div className="vr"></div>
      {buttonSizeList.map((button, index) => (
        <IconButton
          key={index}
          className={
            selectedNode?.attrs?.size === button.sizeName ? "is-selected" : ""
          }
          icon={button.icon}
          variant="ghost"
          color="tertiary"
          onClick={() => {
            handleButtonClick(button);
          }}
        />
      ))}
    </div>
  );
};

export default BubbleMenuEditImage;