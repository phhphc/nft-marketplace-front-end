import { getEventNFTByOwnerService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNFTActivityByOwner = (owner: string) => {
  const result = useQuery({
    queryKey: ["nftActivity", owner],
    queryFn: () => getEventNFTByOwnerService(owner),
    staleTime: Infinity,
  });
  const nftActivity = result.data || [];
  return { ...result, nftActivity };
};

export default useNFTActivityByOwner;
