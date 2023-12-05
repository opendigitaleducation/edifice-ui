import {
  ImageSizeLarge,
  ImageSizeMedium,
  ImageSizeSmall,
  Wand,
} from "@edifice-ui/icons";
import { useTranslation } from "react-i18next";

import { Button, IconButton } from "../../components";

const BubbleMenuEditImage = ({ editor }: { editor: any }) => {
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

  const handleButtonClick = (buttonSize: any) => {
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

  return (
    <div className="buble-menu">
      <Button
        size="lg"
        variant="ghost"
        leftIcon={<Wand />}
        //onClick={() => } Afficher la modal d'edit modal
      >
        {t("edit.image")}
      </Button>
      <div className="vr"></div>
      {buttonSizeList.map((button, index) => (
        <IconButton
          key={index}
          icon={button.icon}
          variant={
            editor.view.state.selection.node?.attrs?.size === button.sizeName
              ? "filled"
              : "ghost"
          }
          onClick={() => {
            handleButtonClick(button);
          }}
        />
      ))}
    </div>
  );
};

export default BubbleMenuEditImage;
