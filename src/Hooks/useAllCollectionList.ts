import { getAllCollectionListService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useAllCollectionList = () => {
  const result = useQuery({
    queryKey: "AllCollectionList",
    queryFn: getAllCollectionListService,
    staleTime: Infinity,
  });
  const allCollectionList = result.data || [];
  return { ...result, allCollectionList };
};

export default useAllCollectionList;
