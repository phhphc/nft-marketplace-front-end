import { INFTCollectionItem } from "@Interfaces/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { useQuery } from "react-query";

interface IUseNFTCollectionListProps {
  token?: string;
  owner?: string;
  isHidden?: boolean;
  provider: any;
  myWallet: any;
}

const useNFTCollectionList = ({
  token,
  owner,
  isHidden,
  provider,
  myWallet,
}: IUseNFTCollectionListProps) => {
  const result = useQuery({
    queryKey: `nftCollectionList-${token}-${owner}-${isHidden}-${provider}-${myWallet}`,
    queryFn: () =>
      getNFTCollectionListService({ token, owner, isHidden }, provider, myWallet),
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
