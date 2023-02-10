import { useState } from "react";
import Image from "next/image";
import avatar from "@Assets/avatar.png"
import cover from "@Assets/cover.png"

const NFTImageUserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="user-profile">
      <Image
        src={cover}
        alt="cover-image"
        className="cover-image"
      ></Image>
      <div className="avt-frame">
        <Image
          onClick={handleShowDialog}
          src={avatar}
          alt=""
          className="shadow-2xl avt-image"
        ></Image>
      </div>
      {/* Avatar NFT Modal */}
      <div className={isOpen ? "modal" : ""}>
        <span
          onClick={handleShowDialog}
          className={isOpen ? "close" : "hidden"}
        >
          &times;
        </span>
        <Image
          className="modal-content"
          src={
            isOpen
              ? {avatar}
              : ""
          }
        />
      </div>
    </div>
  );
};
export default NFTImageUserProfile;
