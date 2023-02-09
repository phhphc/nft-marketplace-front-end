import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { useState, useEffect, useContext } from "react";
import { INFTCollectionItem } from "@Interfaces/index";

const NFTCollectionContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);
  const [countFetchNftCollectionList, setCountFetchNftCollectionList] =
    useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService().then((data) => {
        setNftCollectionList(data);
      });
    };

    fetchData();
  }, [countFetchNftCollectionList]);
  return (
    <>
      <ImageProfile></ImageProfile>
      <NFTInfor></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
        setCountFetchNftCollectionList={setCountFetchNftCollectionList}
      />
    </>
  );
};

export default NFTCollectionContainer;
