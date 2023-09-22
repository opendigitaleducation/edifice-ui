import React, { ComponentPropsWithRef, forwardRef, Ref, useMemo } from "react";

import { Options } from "@edifice-ui/icons";
import clsx from "clsx";
import { IWebApp } from "edifice-ts-client";

import { CardContext } from "./CardContext";
import Folder from "./CardFolder";
import Resource from "./CardResource";
import { useOdeIcons } from "../../core";
import { IconButton } from "../Button";

export type CardType = "folder" | "resource" | null | undefined;

export interface CardOptions {
  type?: CardType;
  /**
   * User Image Profile
   */
  imageSrc?: string;
  /**
   * User Image Profile
   */
  userSrc?: string;
  /**
   * Person who created resource
   * */
  creatorName?: string;
  /**
   * Updated time
   */
  updatedAt?: string;
  /**
   * Name of resource or Folder
   * */
  name?: string;
  isShared?: boolean;
  isPublic?: boolean;
}

export interface TooltipOptions {
  /**
   * Action to open a single resource
   */
  messageShared?: string;
  /**
   * Message tooltip icon Public
   */
  messagePublic?: string;
}

export interface CardProps extends ComponentPropsWithRef<"div"> {
  /**
   * Show selected Card
   */
  isSelected?: boolean;
  /**
   * Add animation to the Card Component
   */
  isAnimated?: boolean;
  /**
   * Skeleton Card
   * */
  isLoading: boolean;
  /**
   * To show the icon of an application
   */
  app: IWebApp;
  /**
   * Select Card and Open ActionBar
   */
  onSelect?: () => void;
  /**
   * Action to open a single resource
   */
  onOpen?: () => void;
  /**
   * Optional class for styling purpose
   */
  className?: string;
  /**
   * Card options to generate correct Card
   */
  options: CardOptions;
  /**
   * Tooltips text
   */
  tooltips?: TooltipOptions;
}

const Root = forwardRef(
  (
    {
      options,
      tooltips,
      isLoading,
      app,
      onSelect,
      onOpen,
      isSelected,
      isAnimated,
      className,
      ...restProps
    }: CardProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const { getIconCode } = useOdeIcons();

    function handleOnSelect(event: React.MouseEvent) {
      event.stopPropagation();
      onSelect?.();
    }

    const { type } = options;

    const appCode = app ? getIconCode(app) : "placeholder";

    const classesTitle = clsx(
      "card-title body text-break text-truncate text-truncate-2 pe-32",
      {
        placeholder: isLoading,
      },
    );

    const values = useMemo(
      () => ({
        options,
        isLoading,
        classesTitle,
        app,
        appCode,
        tooltips,
      }),
      [app, appCode, classesTitle, isLoading, options, tooltips],
    );

    const Cards = {
      folder: <Card.Folder />,
      resource: <Card.Resource />,
      undefined: <Card.Resource />,
      default: null,
    };

    return (
      <CardContext.Provider value={values}>
        <div
          ref={ref}
          className={clsx(
            "card",
            {
              "placeholder-glow": isLoading,
              "is-selected": isSelected,
              "is-animated": isAnimated,
            },
            className,
          )}
          {...restProps}
        >
          <div className="card-header">
            {!isLoading && (
              <IconButton
                aria-label="Open Action Bar"
                className="z-3"
                color="secondary"
                icon={<Options />}
                onClick={handleOnSelect}
                variant="ghost"
              />
            )}
            <button
              onClick={onOpen}
              className="position-absolute bottom-0 end-0 top-0 start-0 opacity-0 z-1 w-100"
              aria-label="Open resource"
            ></button>
          </div>

          {Cards[type as keyof CardType] || Cards["default"]}
        </div>
      </CardContext.Provider>
    );
  },
);

Root.displayName = "Card";

const Card = Object.assign(Root, {
  Resource: Resource,
  Folder: Folder,
});

export default Card;
