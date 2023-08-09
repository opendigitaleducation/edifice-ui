// import "./toolbar.scss";

import { Ref, forwardRef } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { IconButton } from "../Button";

export type ToolbarOptionsType = "divider" | "primary";
export type ToolbarRef = HTMLDivElement;
export type ToolbarVariant = "default" | "no-shadow";
export type ToolbarAlign = "left" | "center" | "space" | "right";

export type ToolbarOptions =
  | {
      type?: ToolbarOptionsType;
      icon: JSX.Element;
      label: string;
      name: string;
      action: () => void;
      className?: string;
    }
  | {
      type: "divider";
    };

export interface ToolbarProps extends React.ComponentPropsWithRef<"div"> {
  /**
   * Toolbar data items
   */
  data: ToolbarOptions[];
  /**
   * Toolbar variant
   */
  variant?: ToolbarVariant;
  /**
   * Buttons alignement when isBlock is true
   */
  align?: ToolbarAlign;
  /**
   * Toolbar has width 100%
   */
  isBlock?: boolean;
}

const Toolbar = forwardRef(
  (
    {
      data,
      variant = "default",
      align = "space",
      isBlock = false,
    }: ToolbarProps,
    ref: Ref<ToolbarRef>,
  ) => {
    const { t } = useTranslation();

    const classes = clsx("toolbar", {
      default: variant === "default",
      "no-shadow": variant === "no-shadow",
      "d-flex": isBlock,
      "d-inline-flex": !isBlock,
      "justify-content-start": align === "left",
      "justify-content-between": align === "space",
      "justify-content-center": align === "center",
      "justify-content-end": align === "right",
    });

    const hasData = data.length;

    return hasData > 0 ? (
      <div ref={ref} className={classes}>
        {data.map((item, index: number) => {
          if (item.type === "divider") {
            return <div key={index} className="toolbar-divider"></div>;
          }

          if (item.type === "primary") {
            return (
              <IconButton
                key={item?.name}
                icon={item?.icon}
                onClick={item?.action}
                aria-label={t(item?.label)}
                variant="filled"
                color="primary"
              />
            );
          }

          return (
            <IconButton
              key={item?.name}
              icon={item?.icon}
              onClick={item?.action}
              aria-label={t(item?.label)}
              variant="ghost"
              color="tertiary"
              className={item.className}
            />
          );
        })}
      </div>
    ) : null;
  },
);

Toolbar.displayName = "Toolbar";

export default Toolbar;
