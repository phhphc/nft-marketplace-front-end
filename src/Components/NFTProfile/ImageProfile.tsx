import { useState } from "react";
import { ICollectionItem, INFTCollectionItem } from "@Interfaces/index";

export interface ICollectionImageProps {
  collectionImage: ICollectionItem[];
}

const ImageProfile = ({ collectionImage }: ICollectionImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="nft-profile">
      <img
        src={`${
          collectionImage[0]?.metadata?.banner
            ? collectionImage[0]?.metadata?.banner
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoruLW-fPJAchs4OVGL2xH3sUKqSyo_8cjDvk_9NEieCEjmzCVwS_l0qdX6QMRhmhA6Fo&usqp=CAU"
        }`}
        alt=""
        className="cover-image"
      ></img>
      <div className="avt-frame">
        <img
          onClick={handleShowDialog}
          src={`${
            collectionImage[0]?.metadata?.logo
              ? collectionImage[0]?.metadata?.logo
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoruLW-fPJAchs4OVGL2xH3sUKqSyo_8cjDvk_9NEieCEjmzCVwS_l0qdX6QMRhmhA6Fo&usqp=CAU"
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
                  collectionImage[0]?.metadata?.logo
                    ? collectionImage[0]?.metadata?.logo
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoruLW-fPJAchs4OVGL2xH3sUKqSyo_8cjDvk_9NEieCEjmzCVwS_l0qdX6QMRhmhA6Fo&usqp=CAU"
                }`
              : ""
          }
        />
      </div>
    </div>
  );
};
export default ImageProfile;
