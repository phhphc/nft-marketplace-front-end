import { INFTCollectionItem } from "@Interfaces/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { useQuery } from "react-query";

interface IUseNFTCollectionListProps {
  token?: string;
  owner?: string;
}

const useNFTCollectionList = ({ token, owner }: IUseNFTCollectionListProps) => {
  const result = useQuery({
    queryKey: `nftCollectionList-${token}-${owner}`,
    queryFn: () => getNFTCollectionListService({ token, owner }),
    staleTime: Infinity,
    retry: true,
  });

  const nftCollectionList: INFTCollectionItem[][] =
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
