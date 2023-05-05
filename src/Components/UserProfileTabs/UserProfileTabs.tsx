import MakeOfferList from "@Components/MakeOfferList/MakeOfferList";
import NFTActivity from "@Components/NFTActivity/NFTActivity";
import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import { IMakeOfferItem, INFTActivity, INFTCollectionItem } from "@Interfaces/index";
import { TabView, TabPanel } from "primereact/tabview";

export interface IUserProfileTabsProps {
  nftCollectionList: INFTCollectionItem[][];
  refetch: () => void;
  makeOfferList: IMakeOfferItem[];
  makeOfferRefetch: () => void;
  nftRefetch: () => void;
  nftActivity: INFTActivity[];
  nftActivityRefetch: () => void;
}

const UserProfileTabs = ({
  nftCollectionList,
  refetch,
  makeOfferList,
  makeOfferRefetch,
  nftRefetch,
  nftActivity,
  nftActivityRefetch
}: IUserProfileTabsProps) => {
  return (
    <div className="mt-5">
      <TabView>
        <TabPanel header="My NFTs">
          <NFTUserProfileTabs
            nftCollectionList={nftCollectionList}
            refetch={refetch}
          />
        </TabPanel>
        <TabPanel header="My Activities">
          <NFTActivity nftActivity={nftActivity}></NFTActivity>
        </TabPanel>
        <TabPanel header="Offers received">
          <MakeOfferList
            makeOfferList={makeOfferList}
            makeOfferRefetch={makeOfferRefetch}
            nftActivityRefetch={nftActivityRefetch}
            nftRefetch={refetch}
          ></MakeOfferList>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default UserProfileTabs;
