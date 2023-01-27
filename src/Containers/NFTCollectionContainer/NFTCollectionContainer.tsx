import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";

const NFTCollectionContainer = () => {
  return (
    <>
      <ImageProfile></ImageProfile>
      <NFTInfor></NFTInfor>
      <NFTCollectionList />
    </>
  );
};

export default NFTCollectionContainer;
