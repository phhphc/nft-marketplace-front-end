import { getEventNFTByOwnerService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNFTActivityByOwner = (owner: string, chainId: number) => {
  const result = useQuery({
    queryKey: ["nftActivity", owner],
    queryFn: () => getEventNFTByOwnerService(owner, chainId),
    staleTime: Infinity,
  });
  const nftActivity = result.data || [];
  return { ...result, nftActivity };
};

export default useNFTActivityByOwner;
