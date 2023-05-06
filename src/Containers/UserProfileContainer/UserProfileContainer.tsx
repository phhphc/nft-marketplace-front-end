import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import UserInfor from "@Components/UserProfile/UserInfor";
import { useContext, useRef } from "react";
import { AppContext } from "@Store/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import UserImage from "@Components/UserProfile/UserImage";
import MakeOfferList from "@Components/MakeOfferList/MakeOfferList";
import useMakeOffer from "@Hooks/useMakeOffer";
import useProfile from "@Hooks/useProfile";
import UserProfileTabs from "@Components/UserProfileTabs/UserProfileTabs";
import useNFTActivityByOwner from "@Hooks/useNFTActivityByOwner";
import { Message } from "primereact/message";

const UserProfileContainer = () => {
  const web3Context = useContext(AppContext);
  const { nftCollectionList, refetch } = useNFTCollectionList({
    owner: web3Context.state.web3.myAddress as string,
  });
  const { makeOfferList, refetch: makeOfferRefetch } = useMakeOffer(
    web3Context.state.web3.myAddress
  );

  const { profile, refetch: profileRefetch } = useProfile(
    web3Context.state.web3.myAddress
  );

  const { nftActivity, refetch: nftActivityRefetch } = useNFTActivityByOwner(
    web3Context.state.web3.myAddress
  );

  return (
    <>
      {web3Context.state.web3.provider ? (
        <>
          <div>
            <UserImage profile={profile}></UserImage>
            <UserInfor
              profile={profile}
              profileRefetch={profileRefetch}
            ></UserInfor>
            <UserProfileTabs
              nftCollectionList={nftCollectionList}
              refetch={refetch}
              makeOfferList={makeOfferList}
              makeOfferRefetch={makeOfferRefetch}
              nftRefetch={refetch}
              nftActivity={nftActivity}
              nftActivityRefetch={nftActivityRefetch}
            ></UserProfileTabs>
          </div>
        </>
      ) : (
        <Message
          severity="warn"
          text="You must to login your wallet!"
          className="flex h-40"
        />
      )}
    </>
  );
};

export default UserProfileContainer;
