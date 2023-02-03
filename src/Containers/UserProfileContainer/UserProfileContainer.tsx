import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import ImageUserProfile from "@Components/UserProfile/ImageUserProfile";
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
      <ImageUserProfile></ImageUserProfile>
      <UserInfor></UserInfor>
      <NFTUserProfileTabs nftCollectionList={nftCollectionList} />
    </div>
  );
};

export default UserProfileContainer;
