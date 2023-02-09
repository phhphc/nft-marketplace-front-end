import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import NFTImageUserProfile from "@Components/UserProfile/NFTImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";
import { getNFTCollectionListService } from "@Services/ApiService";
import { useState, useEffect, useContext } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";

const UserProfileContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);

  const [countFetchNftCollectionList, setCountFetchNftCollectionList] =
    useState<number>(0);

  const web3Context = useContext(AppContext);
  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService(web3Context.state.web3.myAddress).then(
        (res) => {
          const data = res.filter((item: any) => !item.listing);
          setNftCollectionList(data);
        }
      );
    };
    fetchData();
  }, []);

  return (
    <div>
      <NFTImageUserProfile></NFTImageUserProfile>
      <UserInfor></UserInfor>
      <NFTUserProfileTabs
        nftCollectionList={nftCollectionList}
        setCountFetchNftCollectionList={setCountFetchNftCollectionList}
      />
    </div>
  );
};

export default UserProfileContainer;
