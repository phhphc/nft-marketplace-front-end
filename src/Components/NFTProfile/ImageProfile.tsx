import { useState } from "react";
import { INFTCollectionItem } from "@Interfaces/index";

export interface IImageProfileProps {
  nftCollectionList: INFTCollectionItem[][];
}

const ImageProfile = ({ nftCollectionList }: IImageProfileProps) => {
  const firstNFT = nftCollectionList?.[0]?.[0];
  const [isOpen, setIsOpen] = useState(false);
  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="nft-profile">
      <img
        src={`${
          firstNFT?.image == "<nil>" || firstNFT?.image || firstNFT?.image == ""
            ? "https://i.seadn.io/gcs/files/89f0cd4457af5632e66fb44bf43309cd.png?auto=format&w=1920"
            : firstNFT?.image
        }`}
        alt=""
        className="cover-image"
      ></img>
      <div className="avt-frame">
        <img
          onClick={handleShowDialog}
          src={`${
            firstNFT?.image == "<nil>" ||
            !firstNFT?.image ||
            firstNFT?.image == ""
              ? "https://i.seadn.io/gcs/files/89f0cd4457af5632e66fb44bf43309cd.png?auto=format&w=1920"
              : firstNFT?.image
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
              ? `${
                  firstNFT?.image == "<nil>" ||
                  !firstNFT?.image ||
                  firstNFT?.image == ""
                    ? "https://i.seadn.io/gcs/files/89f0cd4457af5632e66fb44bf43309cd.png?auto=format&w=1920"
                    : firstNFT?.image
                }`
              : ""
          }
        />
      </div>
    </div>
  );
};
export default ImageProfile;
