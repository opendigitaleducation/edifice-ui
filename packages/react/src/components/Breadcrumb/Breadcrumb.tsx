import { forwardRef, Ref } from "react";

import { RafterLeft } from "@edifice-ui/icons";
import { IWebApp } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import BreadcrumbItem from "./BreadcrumbItem";
import BreadcrumbList from "./BreadcrumbList";
import BreadcrumbNav from "./BreadcrumbNav";
import { AppIcon } from "../AppIcon";
import { IconButton } from "../Button";

export interface BreadcrumbProps {
  /**
   * Pass all data about current application
   */
  app: IWebApp;
  /**
   * Show name of the current resource
   */
  name?: string;
}

const Breadcrumb = forwardRef(
  ({ app, name }: BreadcrumbProps, ref: Ref<HTMLElement>) => {
    const { t } = useTranslation();

    return (
      <BreadcrumbNav app={app} ref={ref}>
        <BreadcrumbList className="gap-12">
          {name ? (
            <>
              <BreadcrumbItem>
                <a href={app?.address} className="d-flex">
                  <IconButton
                    variant="ghost"
                    color="tertiary"
                    icon={<RafterLeft />}
                    aria-label={t(app?.displayName)}
                  />
                  <AppIcon app={app} size="40" />
                </a>
              </BreadcrumbItem>
              <BreadcrumbItem className="h3" aria-current="page">
                <h1 className="h3">{name}</h1>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem className="gap-12 d-flex align-items-center">
              <AppIcon app={app} size="40" />
              <h1 className="h3">{t(app?.displayName)}</h1>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </BreadcrumbNav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
