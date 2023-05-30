import UserInfor from "@Components/UserProfile/UserInfor";
import { useContext, useRef } from "react";
import { AppContext } from "@Store/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import UserImage from "@Components/UserProfile/UserImage";
import useOfferReceivedList from "@Hooks/useOfferReceivedList";
import useProfile from "@Hooks/useProfile";
import UserProfileTabs from "@Components/UserProfileTabs/UserProfileTabs";
import useNFTActivityByOwner from "@Hooks/useNFTActivityByOwner";
import { Message } from "primereact/message";
import useOfferMadeList from "@Hooks/useOfferMadeList";

const UserProfileContainer = () => {
  const web3Context = useContext(AppContext);

  const { nftCollectionList, refetch } = useNFTCollectionList({
    owner: web3Context.state.web3.myAddress as string,
    provider: web3Context.state.web3.provider,
    myWallet: web3Context.state.web3.myWallet,
  });

  const { offerReceivedList, refetch: offerReceivedListRefetch } =
    useOfferReceivedList(web3Context.state.web3.myAddress);

  const { offerMadeList, refetch: offerMadeListRefetch } = useOfferMadeList(
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
              offerReceivedList={offerReceivedList}
              offerReceivedListRefetch={offerReceivedListRefetch}
              offerMadeList={offerMadeList}
              offerMadeListRefetch={offerMadeListRefetch}
              nftRefetch={refetch}
              nftActivity={nftActivity}
              nftActivityRefetch={nftActivityRefetch}
            ></UserProfileTabs>
          </div>
        </>
      ) : (
        <Message
          severity="warn"
          text="Please login your wallet!"
          className="flex h-40"
        />
      )}
    </>
  );
};

export default UserProfileContainer;
