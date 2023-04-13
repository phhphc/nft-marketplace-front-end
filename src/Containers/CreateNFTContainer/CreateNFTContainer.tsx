import CreateNFT from "@Components/CreateNFT/CreateNFT";
import useCollectionListByCategory from "@Hooks/useCollectionListByCategory";

const CreateNFTContainer = () => {
  const { collectionList } = useCollectionListByCategory("All");
  return (
    <>
      <CreateNFT collectionList={collectionList}></CreateNFT>
    </>
  );
};

export default CreateNFTContainer;
