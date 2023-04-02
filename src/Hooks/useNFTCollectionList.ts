import { getNFTCollectionListInfoService } from "@Services/ApiService";
import { useQuery } from "react-query";
import { NOT_ON_SALE } from "@Constants/index";
import { INFTCollectionItem } from "@Interfaces/index";

const useNFTCollectionList = () => {
  const result = useQuery({
    queryKey: "NFTCollectionList",
    queryFn: getNFTCollectionListInfoService,
    staleTime: Infinity,
    retry: true,
  });
  const nftCollectionList =
    result.data?.reduce((acc: any, cur: INFTCollectionItem) => {
      const indexOfExistOrderHash = acc.indexOf(
        (item: INFTCollectionItem) =>
          item.listings?.[0].order_hash === cur.listings?.[0].order_hash
      );

      if (indexOfExistOrderHash === -1) {
        acc.push([cur]);
        return acc;
      } else {
        acc[indexOfExistOrderHash].push(cur);
        return acc;
      }
    }, []) || [];
  console.log(nftCollectionList);
  return { ...result, nftCollectionList };
};

export default useNFTCollectionList;
