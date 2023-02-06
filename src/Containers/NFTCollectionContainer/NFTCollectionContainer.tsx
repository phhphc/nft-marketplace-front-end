import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { useState, useEffect, useContext } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";

const NFTCollectionContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);
  const web3Context = useContext(AppContext);
  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService(web3Context.state.web3.myAddress).then(
        (data) => {
          setNftCollectionList(data);
        }
      );
    };
    fetchData();
  }, []);
  return (
    <>
      <ImageProfile></ImageProfile>
      <NFTInfor></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
      />
    </>
  );
};

export default NFTCollectionContainer;
