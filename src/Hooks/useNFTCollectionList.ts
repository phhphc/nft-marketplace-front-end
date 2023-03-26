import { getNFTCollectionListInfoService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNFTCollectionList = () => {
  const result = useQuery({
    queryKey: "NFTCollectionList",
    queryFn: getNFTCollectionListInfoService,
    staleTime: Infinity,
  });
  const nftCollectionList = result.data || [];
  return { ...result, nftCollectionList };
};

export default useNFTCollectionList;
