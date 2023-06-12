import { getAllCollectionListService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useCollectionListByCategory = (category: string, chainId: number) => {
  const result = useQuery({
    queryKey: category,
    queryFn: () => getAllCollectionListService(category, chainId),
    staleTime: Infinity,
  });
  const collectionList = result.data || [];
  return { ...result, collectionList };
};

export default useCollectionListByCategory;
