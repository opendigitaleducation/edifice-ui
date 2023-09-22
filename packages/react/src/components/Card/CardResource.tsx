import { forwardRef } from "react";

import { Globe, Users } from "@edifice-ui/icons";
import { OneProfile } from "@edifice-ui/icons/nav";
import clsx from "clsx";

import { useCardContext } from "./CardContext";
import { AppIcon } from "../AppIcon";
import { Avatar } from "../Avatar";
import { Image } from "../Image";
import { Tooltip } from "../Tooltip";

const Resource = forwardRef(() => {
  const { options, isLoading, tooltips, classesTitle, app } = useCardContext();

  const {
    type,
    imageSrc,
    name,
    creatorName,
    userSrc,
    updatedAt,
    isShared,
    isPublic,
  } = options;
  const { messagePublic, messageShared } = tooltips || {};

  console.log({ tooltips });

  const classesProfile = clsx(
    "d-inline-flex align-items-center gap-8 text-truncate",
    {
      placeholder: isLoading,
    },
  );

  const classesText = clsx("card-text small", {
    placeholder: isLoading,
  });

  const classesName = clsx("small text-truncate", {
    placeholder: isLoading,
  });

  const renderUserPhoto = userSrc ? (
    <Avatar
      alt={creatorName || ""}
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
              className={clsx("h-full", {
                placeholder: isLoading,
              })}
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
      {type === "resource" ? (
        <div className="card-footer gap-16">
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
      ) : null}
    </>
  );
});

Resource.displayName = "Card.Resource";

export default Resource;
