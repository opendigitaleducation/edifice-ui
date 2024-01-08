import { Meta, StoryObj } from "@storybook/react";
import { Toolbar, IconButtonProps, IconButton, Dropdown } from "..";
import {
  AlignLeft,
  Paperclip,
  BulletList,
  Landscape,
  Link,
  Mic,
  RecordVideo,
  Smiley,
  Table,
  TextBold,
  TextColor,
  TextHighlight,
  TextItalic,
  TextSize,
  TextTypo,
  TextUnderline,
} from "@edifice-ui/icons";
import { RefAttributes } from "react";

const meta: Meta<typeof Toolbar> = {
  title: "Tiptap/EditorToolbar",
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component: "EditorToolbar extends the Toolbar Component",
      },
    },
  },
  argTypes: {
    variant: {
      options: ["default", "no-shadow"],
      control: { type: "select" },
    },
    isBlock: { control: "boolean" },
    align: {
      options: ["left", "center", "space", "right"],
      control: { type: "select" },
    },
  },
  args: {
    items: [
      {
        type: "icon",
        props: {
          icon: <Landscape />,
          className: "bg-green-200",
          "aria-label": "Insérer une image",
          onClick: () => {},
        },
        name: "image",
      },
      {
        type: "icon",
        props: {
          icon: <RecordVideo />,
          className: "bg-purple-200",
          "aria-label": "Insérer une vidéo",
          onClick: () => {},
        },
        name: "video",
      },
      {
        type: "icon",
        props: {
          icon: <Mic />,
          className: "bg-red-200",
          "aria-label": "Insérer une piste audio",
          onClick: () => {},
        },
        name: "audio",
      },
      {
        type: "icon",
        props: {
          icon: <Paperclip />,
          className: "bg-yellow-200",
          "aria-label": "Insérer une pièce jointe",
          onClick: () => {},
        },
        name: "attachment",
      },
      {
        type: "divider",
        name: "div-1",
      },
      {
        type: "dropdown",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<TextTypo />}
                aria-label={"Choix de la famille de typographie"}
                className=""
              />
            </>
          ),
        },
        name: "text_typo",
        visibility: "show",
      },
      {
        type: "dropdown",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<TextSize />}
                aria-label={"Choix de la taille de typographie"}
              />
            </>
          ),
        },
        name: "text_size",
        visibility: "show",
      },
      {
        type: "dropdown",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<TextColor />}
                aria-label={"Couleur de texte"}
                className=""
              />
            </>
          ),
        },
        name: "color",
        visibility: "show",
      },
      {
        type: "dropdown",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<TextHighlight />}
                aria-label={"Couleur de fond"}
                className=""
              />
            </>
          ),
        },
        name: "highlight",
        visibility: "show",
      },
      {
        type: "divider",
        name: "div-2",
      },
      {
        type: "icon",
        props: {
          icon: <TextBold />,
          "aria-label": "Ajout de gras",
          className: "",
          onClick: () => {},
        },
        name: "bold",
        visibility: "show",
      },
      {
        type: "icon",
        props: {
          icon: <TextItalic />,
          "aria-label": "Incliner le text",
          className: "",
          onClick: () => {},
        },
        name: "italic",
        visibility: "show",
      },
      {
        type: "icon",
        props: {
          icon: <TextUnderline />,
          "aria-label": "Souligner le texte",
          className: "",
          onClick: () => {},
        },
        name: "underline",
        visibility: "show",
      },
      {
        type: "divider",
        name: "div-3",
      },
      {
        type: "dropdown",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<Smiley />}
                aria-label={"Emojis"}
              />
            </>
          ),
        },
        name: "emoji",
        visibility: "show",
      },
      {
        type: "icon",
        props: {
          icon: <Link />,
          "aria-label": "Ajout d'un lien",
          className: "",
          onClick: () => console.log("click"),
        },
        name: "linker",
      },
      {
        type: "divider",
        name: "div-4",
      },
      {
        type: "dropdown",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<BulletList />}
                aria-label={"Options d'affichage en liste"}
              />
            </>
          ),
        },
        name: "list",
        visibility: "show",
      },
      {
        type: "dropdown",
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, "ref"> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<AlignLeft />}
                aria-label={"Options d'alignement"}
              />
            </>
          ),
        },
        name: "alignment",
        visibility: "show",
      },
      {
        type: "divider",
        name: "div-5",
      },
      {
        type: "dropdown",
        props: {
          children: () => (
            <>
              <Dropdown.Trigger
                variant="ghost"
                label={"Plus"}
                size="md"
                tabIndex={-1}
              />
            </>
          ),
        },
        name: "plus",
        visibility: "show",
      },
    ],
    variant: "no-shadow",
  },
  decorators: [(Story) => <div style={{ height: "600px" }}>{Story()}</div>],
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Base: Story = {
  render: (args) => {
    return <Toolbar {...args} />;
  },
};
