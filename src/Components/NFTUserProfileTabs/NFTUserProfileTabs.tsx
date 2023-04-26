import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import { INFTCollectionItem } from "@Interfaces/index";
import { NFT_COLLECTION_MODE } from "@Constants/index";

export interface INFTUserProfileTabsProps {
  nftCollectionList: INFTCollectionItem[][];
  refetch: () => void;
}

const NFTUserProfileTabs = ({
  nftCollectionList,
  refetch,
}: INFTUserProfileTabsProps) => {
  return (
    <div>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        refetch={refetch}
        mode={NFT_COLLECTION_MODE.CAN_SELL}
      />
    </div>
  );
};

export default NFTUserProfileTabs;
