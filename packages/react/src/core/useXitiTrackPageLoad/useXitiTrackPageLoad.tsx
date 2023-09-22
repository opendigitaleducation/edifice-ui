/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { odeServices } from "edifice-ts-client";

import { useOdeClient } from "../OdeClientProvider";

/** Apply XiTi tracking (navigation). */
export default function useXitiTrackPageLoad() {
  const [xitiStatus, setXitiStatus] = useState<string>("pending");
  const { currentApp } = useOdeClient();

  useEffect(() => {
    trackPageLoad();
  }, []);

  const trackPageLoad = async () => {
    if (!currentApp) {
      setXitiStatus("[Xiti] Error, currentApp is not defined.");
      return;
    }
    try {
      await odeServices
        .analytics()
        .trackPageLoad(window.location.pathname, currentApp);
      console.info(`[Xiti] Success tracking page ${window.location.pathname}`);
      setXitiStatus(`[Xiti] Success tracking page ${window.location.pathname}`);
    } catch (e) {
      console.error("[Xiti] Error Tracking Page Load", e);
      setXitiStatus(`[Xiti] Error Tracking Page Load: ${e}`);
    }
  };

  return { xitiStatus };
}
