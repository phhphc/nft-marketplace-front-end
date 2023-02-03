import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import {
  getNFTCollectionListService,
  getSignerAddressService,
} from "@Services/ApiService";
import { useState, useEffect } from "react";
import { INFTCollectionItem } from "@Interfaces/index";

const NFTCollectionContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      const address = await getSignerAddressService();
      getNFTCollectionListService(address).then((data) => {
        setNftCollectionList(data);
      });
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
