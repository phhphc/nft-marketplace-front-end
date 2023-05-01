import { getProfileService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useProfile = (owner: string) => {
  const result = useQuery({
    queryKey: ["profile", owner],
    queryFn: () => getProfileService(owner),
    staleTime: Infinity,
  });
  const profile = result.data || null;
  return { ...result, profile };
};

export default useProfile;
