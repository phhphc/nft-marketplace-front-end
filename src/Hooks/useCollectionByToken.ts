import { getCollectionByTokenService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useCollectionByToken = (token: any, chainId: number) => {
  const result = useQuery({
    queryKey: ["CollectionByToken", token],
    queryFn: () => getCollectionByTokenService(token, chainId),
    staleTime: Infinity,
  });
  const collection = result.data || [];
  return { ...result, collection };
};

export default useCollectionByToken;
