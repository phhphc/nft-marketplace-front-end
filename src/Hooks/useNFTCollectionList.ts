import { INFTCollectionItem } from "@Interfaces/index";
import { getNFTCollectionListInfoService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNFTCollectionList = () => {
  const result = useQuery({
    queryKey: "NFTCollectionList",
    queryFn: getNFTCollectionListInfoService,
    staleTime: Infinity,
    retry: true,
  });

  const nftCollectionList =
    result.data?.reduce((acc: any, cur: INFTCollectionItem) => {
      const indexOfExistOrderHash = acc.findIndex(
        (item: INFTCollectionItem[]) =>
          item[0].listings?.[0]?.order_hash &&
          item[0].listings?.[0]?.order_hash === cur.listings?.[0]?.order_hash
      );

      if (indexOfExistOrderHash === -1) {
        acc.push([cur]);
        return acc;
      } else {
        acc[indexOfExistOrderHash].push(cur);
        return acc;
      }
    }, []) || [];

  return { ...result, nftCollectionList };
};

export default useNFTCollectionList;
