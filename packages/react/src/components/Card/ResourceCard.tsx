import { ComponentPropsWithRef, forwardRef, Ref } from "react";

import { Globe, Users } from "@edifice-ui/icons";
import { OneProfile } from "@edifice-ui/icons/nav";
import { IWebApp } from "edifice-ts-client";

import { useCardControl } from "./CardContext";
import { AppIcon } from "../AppIcon";
import { Avatar } from "../Avatar";
import { Image } from "../Image";
import { Tooltip } from "../Tooltip";

export interface ResourceCardProps extends ComponentPropsWithRef<"div"> {
  /**
   * To show the icon of an application
   */
  app?: IWebApp;
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

const ResourceCard = forwardRef(
  (
    {
      isShared,
      isPublic,
      creatorName = "tom.mate",
      messageShared,
      messagePublic,
      userSrc,
      updatedAt,
    }: ResourceCardProps,
    ref?: Ref<HTMLDivElement>,
  ) => {
    const {
      classesProfile,
      classesTitle,
      classesText,
      classesName,
      app,
      name,
      imageSrc,
    } = useCardControl();

    const renderUserPhoto = userSrc ? (
      <Avatar
        alt={creatorName}
        size="xs"
        src={userSrc}
        variant="circle"
        width="24"
        height="24"
      />
    ) : (
      <OneProfile />
    );

    return (
      <>
        <div className="card-body">
          {imageSrc ? (
            <div className="card-image">
              <Image
                alt=""
                src={imageSrc}
                width="80"
                height="80"
                objectFit="cover"
                className="h-full"
              />
            </div>
          ) : (
            <AppIcon app={app} iconFit="ratio" size="80" variant="rounded" />
          )}
          <div>
            <h3 className={classesTitle}>
              <strong>{name}</strong>
            </h3>
            <p className="card-text small">
              <em className={classesText}>{updatedAt}</em>
            </p>
          </div>
        </div>
        <div className="card-footer gap-16" ref={ref}>
          <div className={classesProfile}>
            {renderUserPhoto}
            <p className={classesName}>{creatorName}</p>
          </div>
          <div className="d-inline-flex align-items-center gap-8">
            {isPublic && (
              <Tooltip message={messagePublic} placement="top">
                <Globe width={16} height={16} />
              </Tooltip>
            )}

            {isShared && (
              <Tooltip message={messageShared} placement="top">
                <Users width={16} height={16} />
              </Tooltip>
            )}
          </div>
        </div>
      </>
    );
  },
);

ResourceCard.displayName = "ResourceCard";

export default ResourceCard;
