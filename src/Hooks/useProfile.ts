import { getProfileService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useProfile = (owner: string, chainId: number) => {
  const result = useQuery({
    queryKey: ["profile", owner],
    queryFn: () => getProfileService(owner, chainId),
    staleTime: Infinity,
  });
  const profile = result.data || {};
  return { ...result, profile };
};

export default useProfile;
