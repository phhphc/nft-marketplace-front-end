import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { Toast } from "primereact/toast";

const NFTDetailContainer = () => {
  const [nftList, setNftList] = useState<
    INFTCollectionItem[]
  >([]);

  const toast = useRef(null);

  const web3Context = useContext(AppContext);
  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService().then((data) => {
        if(data) {
          const nftList = data.nfts;
          setNftList(nftList);
        }
        else{
          toast.current.show({severity:'error', summary: 'Error', detail:'Fail to load NFT information', life: 3000});
        }
      });
    };
    fetchData();
  }, []);

  return (
    <>
    {web3Context.state.web3.provider ? (
      <>
        <Toast ref={toast} position="bottom-right" />
        <NFTDetail nftList={nftList} />
      </>
    ):(
      <>
      Please login
      </>
    )}
    </>
  );
};

export default NFTDetailContainer;
