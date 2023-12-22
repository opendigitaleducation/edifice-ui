import { useEffect, useState } from "react";

import { odeServices } from "edifice-ts-client";

/**
 * getPreference API
 * @returns check onboarding trash param
 */
const getOnboardingTrash = async (key: string) => {
  const res = await odeServices
    .conf()
    .getPreference<{ showOnboardingTrash: boolean }>(key);
  return res;
};

/**
 * savePreference API
 * @returns set onboarding trash param
 */
const saveOnboardingTrash = async (key: string) => {
  const result = await odeServices
    .conf()
    .savePreference(key, JSON.stringify({ showOnboardingTrash: false }));

  return result;
};

export const useOnboardingModal = (id: string) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOnboardingTrash, setIsOnboardingTrash] = useState(false);

  useEffect(() => {
    (async () => {
      const response: { showOnboardingTrash: boolean } =
        await getOnboardingTrash(id);

      if (response) {
        const { showOnboardingTrash } = response;
        setIsOnboardingTrash(showOnboardingTrash);
        return;
      }
      setIsOnboardingTrash(true);
    })();
  }, [id]);

  const handleSavePreference = async () => {
    await saveOnboardingTrash(id);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    isOnboardingTrash,
    handleSavePreference,
  };
};
