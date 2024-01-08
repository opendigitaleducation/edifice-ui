import { useQuery } from "@tanstack/react-query";
import { App, IGetConf, odeServices } from "edifice-ts-client";

export default function useConf({ appCode }: { appCode: App }) {
  return useQuery<IGetConf>({
    queryKey: ["conf"],
    queryFn: async () => await odeServices.conf().getConf(appCode),
    /* staleTime: 20 * (60 * 1000),
    gcTime: 30 * (60 * 1000), */
    // enabled: !!appCode,
  });
}
