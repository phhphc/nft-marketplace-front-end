import { useState } from "react";
import { INFTCollectionItem } from "@Interfaces/index";

export interface IImageProfileProps {
  nftCollectionList: INFTCollectionItem[];
}

const ImageProfile = ({ nftCollectionList }: IImageProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="nft-profile">
      <img
        src={`${
          nftCollectionList?.[0]?.metadata.image ||
          "https://i.seadn.io/gae/mmyoMHBLnHMfHyb3r2T1050yScZqfx2G48kXmP6WruMNpJNnVYsD79tpczbCrAilRLCAkUh3qRTRdpHYx5z9QPnLG3tdXoTU_Hc9?auto=format&w=1920"
        }`}
        alt=""
        className="cover-image"
      ></img>
      <div className="avt-frame">
        <img
          onClick={handleShowDialog}
          src={`${
            nftCollectionList?.[0]?.metadata.image ||
            "https://i.seadn.io/gae/mmyoMHBLnHMfHyb3r2T1050yScZqfx2G48kXmP6WruMNpJNnVYsD79tpczbCrAilRLCAkUh3qRTRdpHYx5z9QPnLG3tdXoTU_Hc9?auto=format&w=1920"
          }`}
          alt=""
          className="shadow-2xl avt-image"
        ></img>
      </div>
      {/* Avatar NFT Modal */}
      <div className={isOpen ? "modal" : ""}>
        <span
          onClick={handleShowDialog}
          className={isOpen ? "close" : "hidden"}
        >
          &times;
        </span>
        <img
          className="modal-content"
          src={
            isOpen
              ? "https://i.seadn.io/gae/FeqZQ2fAjaNqCrxpz2x9ZlNR9PXAP6Ok-lwnaX6ti-BomzyEKmnslCZorU1-aKWM_zq6Mop7RJHT_YqVEKBXh9PIOEciNlxnQYjl?auto=format&w=256"
              : ""
          }
        />
      </div>
    </div>
  );
};
export default ImageProfile;
