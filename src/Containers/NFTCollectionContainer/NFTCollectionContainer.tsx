import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { nftCollectionList } from "@Components/NFTCollectionList/mockData";

const NFTCollectionContainer = () => {
  return (
    <>
      <ImageProfile></ImageProfile>
      <NFTInfor></NFTInfor>
      <NFTCollectionList nftCollectionList={nftCollectionList} />
    </>
  );
};

export default NFTCollectionContainer;
