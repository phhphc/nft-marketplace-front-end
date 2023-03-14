import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import NFTImageUserProfile from "@Components/UserProfile/NFTImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";
import { getNFTCollectionListInfoService } from "@Services/ApiService";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

const UserProfileContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);

  const router = useRouter();

  const [countFetchNftCollectionList, setCountFetchNftCollectionList] =
    useState<number>(0);

  const toast = useRef<Toast>(null);

  const web3Context = useContext(AppContext);
  useEffect(() => {
    getNFTCollectionListInfoService({ toast, callback: setNftCollectionList });
  }, [countFetchNftCollectionList, web3Context.state.web3.myAddress, router]);

  return (
    <>
      {web3Context.state.web3.provider ? (
        <>
          <div>
            <Toast ref={toast} position="top-center" />
            <NFTImageUserProfile></NFTImageUserProfile>
            <UserInfor></UserInfor>
            <NFTUserProfileTabs
              nftCollectionList={nftCollectionList}
              setCountFetchNftCollectionList={setCountFetchNftCollectionList}
            />
          </div>
        </>
      ) : (
        <>Please login</>
      )}
    </>
  );
};

export default UserProfileContainer;
