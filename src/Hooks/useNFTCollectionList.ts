import { getNFTCollectionListInfoService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNFTCollectionList = () => {
  const result = useQuery({
    queryKey: "NFTCollectionList",
    queryFn: getNFTCollectionListInfoService,
    staleTime: Infinity,
  });
  const nftCollectionList =
    result.data?.filter(
      (item) => item.token === "0x60b51e7358544e1C941638772B0D73Cd54c8b16B"
    ) || [];
  return { ...result, nftCollectionList };
};

export default useNFTCollectionList;
