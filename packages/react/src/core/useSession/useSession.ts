import { useQuery } from "@tanstack/react-query";
import { IGetSession, odeServices } from "edifice-ts-client";

export default function useSession() {
  return useQuery<IGetSession>({
    queryKey: ["session"],
    queryFn: async () => await odeServices.session().getSession(),
    /* staleTime: 20 * (60 * 1000),
    gcTime: 30 * (60 * 1000), */
  });
}
