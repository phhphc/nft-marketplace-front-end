import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";

import ImageUserProfile from "@Components/UserProfile/ImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";
import { getNFTCollectionListService } from "@Services/ApiService";
import { useState, useEffect } from "react";
import { INFTCollectionItem } from "@Interfaces/index";

const UserProfileContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);
  useEffect(() => {
    getNFTCollectionListService().then((data) => {
      console.log(data);
      setNftCollectionList(data);
    });
  }, []);
  return (
    <div>
      <ImageUserProfile></ImageUserProfile>
      <UserInfor></UserInfor>
      <NFTUserProfileTabs nftCollectionList={nftCollectionList} />
    </div>
  );
};

export default UserProfileContainer;
