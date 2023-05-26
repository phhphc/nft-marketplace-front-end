import { IListing, INFTCollectionItem } from "@Interfaces/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { cloneDeep } from "lodash";
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
      getNFTCollectionListService({ token, owner, isHidden }, myWallet),
    staleTime: Infinity,
  });

  const nftCollectionList: INFTCollectionItem[][] =
    result.data
      ?.map((item: INFTCollectionItem) => {
        const newListings = cloneDeep(item.listings);
        return cloneDeep({
          ...item,
          listings: newListings.sort(
            (listingA: IListing, listingB: IListing) => {
              return (
                Number(listingA.start_price) - Number(listingB.start_price)
              );
            }
          ),
        });
      })
      .reduce((acc: any, cur: INFTCollectionItem) => {
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
