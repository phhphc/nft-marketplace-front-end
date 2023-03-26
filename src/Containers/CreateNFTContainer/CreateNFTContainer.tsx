import CreateNFT from "@Components/CreateNFT/CreateNFT";
import useAllCollectionList from "@Hooks/useAllCollectionList";

const CreateNFTContainer = () => {
  const { allCollectionList } = useAllCollectionList();
  return (
    <>
      <CreateNFT allCollectionList={allCollectionList}></CreateNFT>
    </>
  );
};

export default CreateNFTContainer;
