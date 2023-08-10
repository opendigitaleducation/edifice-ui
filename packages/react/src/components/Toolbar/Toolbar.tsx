import { ReactNode, Ref, forwardRef } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { IconButton } from "../Button";
import { Dropdown } from "../Dropdown";

export type ToolbarOptionsType = "divider" | "primary";
export type ToolbarRef = HTMLDivElement;
export type ToolbarVariant = "default" | "no-shadow";
export type ToolbarAlign = "left" | "center" | "space" | "right";

export type ToolbarOptions =
  | {
      /**
       * Object type
       */
      type?: ToolbarOptionsType;
      /**
       * Icon component
       */
      icon: JSX.Element;
      /**
       * Label for a11y
       */
      label: string;
      /**
       * Button or Extension name
       */
      name: string;
      /**
       * Has a Dropdown ?
       */
      hasDropdown?: boolean;
      /**
       * Dropdown Content
       */
      content?: () => ReactNode;
      /**
       * Action OnClick
       */
      action: (elem: any) => any;
      /**
       * Optional class for styling purpose
       */
      className?: string;
      /**
       * Add "is-selected" class
       */
      isActive?: boolean;
      /**
       * Show item if is enabled
       */
      isEnable?: boolean;
    }
  | {
      /**
       * Object type
       */
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
  /**
   * Accept optional children
   */
  children?: ReactNode;
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

    return (
      <div ref={ref} className={classes}>
        {data.map((item) => {
          const isEnable = (item.type === undefined && item.isEnable) ?? true;
          const showDropdownElement =
            item.type === undefined && item.hasDropdown && isEnable;
          const isPrimaryAction = item.type === "primary";
          const isDivider = item.type === "divider";

          if (isDivider) {
            return <div key={item.type} className="toolbar-divider"></div>;
          }

          if (isPrimaryAction) {
            return (
              <IconButton
                key={item.name}
                icon={item.icon}
                onClick={item.action}
                aria-label={t(item.label)}
                variant="filled"
                color="primary"
              />
            );
          }

          if (showDropdownElement) {
            return (
              <Dropdown
                key={item.name}
                trigger={
                  <IconButton
                    aria-label={item.label}
                    color="tertiary"
                    icon={item.icon}
                    type="button"
                    variant="ghost"
                  />
                }
                content={item.content?.()}
              />
            );
          }

          return (
            isEnable && (
              <IconButton
                key={item.name}
                icon={item.icon}
                onClick={item.action}
                aria-label={t(item.label)}
                variant="ghost"
                color="tertiary"
                className={`${item.className || ""} ${
                  item.isActive ? "is-selected" : ""
                }`}
              />
            )
          );
        })}
      </div>
    );
  },
);

Toolbar.displayName = "Toolbar";

export default Toolbar;
