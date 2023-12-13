import { createContext, useContext } from "react";

import { MediaLibraryType, AvailableTab } from "./MediaLibrary";

export const MediaLibraryContext = createContext<{
  /**
   * Application code (example: "blog")
   */
  appCode: string;

  /**
   * Type of rss to search for
   */
  type: MediaLibraryType | null;

  /**
   * Set the counter in the success button label
   */
  setResultCounter: (count?: number) => void;

  /**
   * Set a innertab-specific callback which gets the result when success button is clicked
   */
  setResult: (result?: any) => void;

  /**
   * Allow an innertab to switch display to another innertab.
   * This function will throw an error if switching failed.
   */
  setVisibleTab: (tab: AvailableTab) => void;

  /**
   * Allow an innertab to switch type of the media library.
   */
  switchType: (type: MediaLibraryType) => void;
}>(null!);

export function useMediaLibraryContext() {
  const context = useContext(MediaLibraryContext);
  if (!context) {
    throw new Error(
      `Innertabs compound components cannot be rendered outside the MediaLibrary component`,
    );
  }
  return context;
}
