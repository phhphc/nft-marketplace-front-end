import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { Toast } from "primereact/toast"

const NFTDetailContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);

  const toast = useRef(null);

  const web3Context = useContext(AppContext);
  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService(web3Context.state.web3.myAddress).then(
        (res) => {
          if(res){
            const nftsDetail = res.nfts.filter((item: any) => !item.listing);
            setNftCollectionList(nftsDetail);
          }
          else{
            toast.current.show({severity:'error', summary: 'Error', detail:'Fail to load NFT information', life: 3000});
          }
        }
      );
    };
    fetchData();
  }, []);
  return (
    <>
    {web3Context.state.web3.provider ? (
      <>
      <Toast ref={toast} position="bottom-right" />
      {/* Chưa xong: Đổ data từ nftCollectionList vào component NFTDetail */}
      <NFTDetail /> 
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
