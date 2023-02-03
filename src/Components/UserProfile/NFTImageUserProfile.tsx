import { useState } from "react";

const NFTImageUserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="user-profile">
      <img
        src="https://scontent.fsgn1-1.fna.fbcdn.net/v/t39.30808-6/242350245_107511491684705_4117772214562017737_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=e3f864&_nc_ohc=R6R5R3BlWi8AX_XAVKn&_nc_ht=scontent.fsgn1-1.fna&oh=00_AfD8WFhCFjllIWKTgtYYcdAIYhRUpxrcFAE96bSoYkqJSQ&oe=63D74FA7"
        alt=""
        className="cover-image"
      ></img>
      <div className="avt-frame">
        <img
          onClick={handleShowDialog}
          src="https://scontent.fsgn1-1.fna.fbcdn.net/v/t39.30808-6/278374293_156929620076225_8622926127986152733_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=za5rCUtfJx4AX8otllQ&_nc_ht=scontent.fsgn1-1.fna&oh=00_AfDhdFjbMAG-3FTKtOlGlqSH1C4lJENi09ZU-3RoFKe9MA&oe=63D8AB0A"
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
              ? "https://scontent.fsgn1-1.fna.fbcdn.net/v/t39.30808-6/278374293_156929620076225_8622926127986152733_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=za5rCUtfJx4AX8otllQ&_nc_ht=scontent.fsgn1-1.fna&oh=00_AfDhdFjbMAG-3FTKtOlGlqSH1C4lJENi09ZU-3RoFKe9MA&oe=63D8AB0A"
              : ""
          }
        />
      </div>
    </div>
  );
};
export default NFTImageUserProfile;
