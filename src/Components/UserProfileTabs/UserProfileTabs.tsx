import MakeOfferList from "@Components/MakeOfferList/MakeOfferList";
import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import { IMakeOfferItem, INFTCollectionItem } from "@Interfaces/index";
import { TabView, TabPanel } from "primereact/tabview";

export interface IUserProfileTabsProps {
  nftCollectionList: INFTCollectionItem[][];
  refetch: () => void;
  makeOfferList: IMakeOfferItem[];
  makeOfferRefetch: () => void;
  nftRefetch: () => void;
}

const UserProfileTabs = ({
  nftCollectionList,
  refetch,
  makeOfferList,
  makeOfferRefetch,
  nftRefetch,
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
        <TabPanel header="My Activities"></TabPanel>
        <TabPanel header="Offers received">
          <MakeOfferList
            makeOfferList={makeOfferList}
            makeOfferRefetch={makeOfferRefetch}
            nftRefetch={refetch}
          ></MakeOfferList>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default UserProfileTabs;
