import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import NFTImageUserProfile from "@Components/UserProfile/NFTImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";
import {
  getNFTCollectionListService,
  getSignerAddressService,
} from "@Services/ApiService";
import { useState, useEffect } from "react";
import { INFTCollectionItem } from "@Interfaces/index";

const UserProfileContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService().then((res) => {
        const data = res.filter((item: any) => !item.listing);
        setNftCollectionList(data);
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <NFTImageUserProfile></NFTImageUserProfile>
      <UserInfor></UserInfor>
      <NFTUserProfileTabs nftCollectionList={nftCollectionList} />
    </div>
  );
};

export default UserProfileContainer;
