import React, {
  ComponentPropsWithRef,
  forwardRef,
  ReactNode,
  Ref,
  useMemo,
} from "react";

import { Options } from "@edifice-ui/icons";
import clsx from "clsx";
import { IWebApp } from "edifice-ts-client";

import { CardContext } from "./CardContext";
import { useOdeIcons } from "../../core";
import { IconButton } from "../Button";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  /**
   * To show the icon of an application
   */
  app?: IWebApp;
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
  isLoading?: boolean;
  /**
   * Optional class for styling purpose
   */
  className?: string;
  /**
   * Name of resource or Folder
   * */
  name?: string;
  /**
   * Link or text to display
   */
  children: ReactNode;
  /**
   * Select Card and Open ActionBar
   */
  onSelect?: () => void;
  /**
   * Action to open a single resource
   */
  onOpen?: () => void;
  /**
   * User Image Profile
   */
  imageSrc?: string;
  /**
   * Person who created resource
   * */
  creatorName?: string;
  /**
   * Updated time
   */
  updatedAt?: string;
  /**
   * Shared number
   */
  isShared?: boolean;
  /**
   * Show icon if resource is public
   */
  isPublic?: boolean;
  /**
   * User Image Profile
   */
  userSrc?: string;
  /**
   * Action to open a single resource
   */
  messageShared?: string;
  /**
   * Message tooltip icon Public
   */
  messagePublic?: string;
}

const Card = forwardRef(
  (
    {
      app,
      className,
      isAnimated = false,
      isLoading = false,
      isSelected = false,
      children,
      onSelect,
      onOpen,
      name = "Resource",
      imageSrc,
      creatorName = "tom.mate",
      userSrc,
      updatedAt,
      isPublic,
      messagePublic,
      messageShared,
      isShared,
      ...restProps
    }: CardProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const { getIconCode } = useOdeIcons();

    const classes = clsx(
      "card",
      {
        "placeholder-glow": isLoading,
        "is-selected": isSelected,
        "is-animated": isAnimated,
      },
      className,
    );

    const classesName = clsx("small text-truncate", {
      placeholder: isLoading,
    });

    const classesProfile = clsx(
      "d-inline-flex align-items-center gap-8 text-truncate",
      {
        placeholder: isLoading,
      },
    );

    const classesTitle = clsx(
      "card-title body text-break text-truncate text-truncate-2 pe-32",
      {
        placeholder: isLoading,
      },
    );
    const classesText = clsx("card-text small", {
      placeholder: isLoading,
    });

    const appCode = app ? getIconCode(app) : "placeholder";

    const classesFiles = clsx(`color-app-${appCode}`, {
      placeholder: isLoading,
    });

    const values = useMemo(
      () => ({
        name: name!,
        app: app!,
        classesName: classesName!,
        classesProfile: classesProfile!,
        classesTitle: classesTitle!,
        classesText: classesText!,
        classesFiles: classesFiles!,
        imageSrc: imageSrc!,
        creatorName: creatorName!,
        userSrc: userSrc!,
        updatedAt: updatedAt!,
        isPublic: isPublic,
        isShared: isShared,
        messagePublic: messagePublic,
        messageShared: messageShared,
      }),
      [
        name,
        app,
        classesName,
        classesProfile,
        classesTitle,
        classesText,
        classesFiles,
        imageSrc,
        creatorName,
        userSrc,
        updatedAt,
        isPublic,
        isShared,
        messagePublic,
        messageShared,
      ],
    );

    function handleOnSelect(event: React.MouseEvent) {
      event.stopPropagation();
      onSelect?.();
    }

    return (
      <CardContext.Provider value={values}>
        <div ref={ref} className={classes} {...restProps}>
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
          {children}
        </div>
      </CardContext.Provider>
    );
  },
);

Card.displayName = "Card";

export default Card;
