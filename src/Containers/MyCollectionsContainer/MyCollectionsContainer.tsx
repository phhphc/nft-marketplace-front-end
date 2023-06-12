import MyCollectionsList from "@Components/MyCollectionsList/MyCollectionsList";
import useCollectionByOwner from "@Hooks/useCollectionByOwner";
import { AppContext } from "@Store/index";
import { useContext } from "react";

const MyCollectionsContainer = () => {
  const web3Context = useContext(AppContext);
  const myAddress = web3Context.state.web3.myAddress;
  const { collection } = useCollectionByOwner(
    myAddress,
    web3Context.state.web3.chainId
  );
  return (
    <>
      <MyCollectionsList myCollections={collection}></MyCollectionsList>
    </>
  );
};

export default MyCollectionsContainer;
