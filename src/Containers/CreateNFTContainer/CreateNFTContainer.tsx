import CreateNFT from "@Components/CreateNFT/CreateNFT";
import useCollectionByOwner from "@Hooks/useCollectionByOwner";
import useCollectionListByCategory from "@Hooks/useCollectionListByCategory";
import { AppContext } from "@Store/index";
import { useContext } from "react";

const CreateNFTContainer = () => {
  const web3Context = useContext(AppContext);
  const myAddress = web3Context.state.web3.myAddress;
  const { collection } = useCollectionByOwner(myAddress);
  return (
    <>
      <CreateNFT collectionList={collection}></CreateNFT>
    </>
  );
};

export default CreateNFTContainer;
