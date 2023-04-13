import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import NFTImageUserProfile from "@Components/UserProfile/NFTImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";
import { useContext, useRef } from "react";
import { AppContext } from "@Store/index";
import { Toast } from "primereact/toast";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import { useRouter } from "next/router";

const UserProfileContainer = () => {
  const router = useRouter();
  const { nftCollectionList } = useNFTCollectionList({
    owner: router.query.user_id as string,
  });

  const toast = useRef<Toast>(null);

  const web3Context = useContext(AppContext);

  return (
    <>
      {web3Context.state.web3.provider ? (
        <>
          <div>
            <Toast ref={toast} position="top-center" />
            <NFTImageUserProfile></NFTImageUserProfile>
            <UserInfor></UserInfor>
            <NFTUserProfileTabs nftCollectionList={nftCollectionList} />
          </div>
        </>
      ) : (
        <>Please login</>
      )}
    </>
  );
};

export default UserProfileContainer;
