/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";

import { odeServices } from "edifice-ts-client";

export default function useIsAdml() {
  const [isAdml, setIsAdml] = useState(false);

  useEffect(() => {
    initIsAdml();
  }, []);

  const initIsAdml = useCallback(async () => {
    const isAdmlRes = await odeServices.session().isAdml();
    setIsAdml(isAdmlRes);
  }, []);

  return {
    isAdml,
  };
}
