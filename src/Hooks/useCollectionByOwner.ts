import { getCollectionByOwnerService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useCollectionByOwner = (owner: any, chainId: number) => {
  const result = useQuery({
    queryKey: ["CollectionByOwner", owner],
    queryFn: () => getCollectionByOwnerService(owner, chainId),
    staleTime: Infinity,
  });
  const collection = result.data || [];
  return { ...result, collection };
};

export default useCollectionByOwner;
