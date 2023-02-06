import Image from "next/image";
import logo from "@Assets/logo.png";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import Link from "next/link";
import { AppContext } from "@Store/index";
import { useContext } from "react";

const handleConnectWallet = async () => {
  if (window.ethereum?._state.isUnlocked) {
    alert("You're already connected to your wallet");
  } else {
    alert("Need install wallet");
  }
};

const handleOpenCart = () => {
  // not finish
  alert("Feature's not finished");
};

const Header = () => {
  const web3Context = useContext(AppContext);
  return (
    <div id="header" className="fixed top-0 right-0 left-0 h-24 z-10">
      <div className="flex h-full w-full bg-gray-100 shadow items-center justify-between px-10">
        {/* Logo */}
        <Link href="/" id="logo">
          <Image className="h-16 w-36" src={logo} alt="Clover logo" />
          <Tooltip target="#logo" position="bottom">
            Go back Home
          </Tooltip>
        </Link>
        {/* Search bar */}
        <span id="search-bar" className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Search" className="w-96 h-10" />
          <Tooltip target="#search-bar" position="bottom">
            Find collection, NFT or author name
          </Tooltip>
        </span>
        {/* Navbar */}
        <div id="navbar" className="w-56 flex items-center justify-around">
          {/* Profile */}
          <Link href={`/user-profile/${web3Context.state.web3.myAddress}`}>
            <Tooltip target="#avatar" position="bottom">
              Go to Profile
            </Tooltip>
            <img
              id="avatar"
              src="https://scontent.fsgn1-1.fna.fbcdn.net/v/t39.30808-6/278374293_156929620076225_8622926127986152733_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=za5rCUtfJx4AX8otllQ&_nc_ht=scontent.fsgn1-1.fna&oh=00_AfDhdFjbMAG-3FTKtOlGlqSH1C4lJENi09ZU-3RoFKe9MA&oe=63D8AB0A"
              alt="avatar"
              className="h-12 w-12 border-2 border-black rounded-full"
            ></img>
          </Link>
          {/* Wallet icon */}
          <button
            id="wallet"
            className="w-12 h-12 hover:bg-lime-500 border-transparent rounded-full flex justify-center items-center"
            onClick={handleConnectWallet}
          >
            <i className="pi pi-wallet text-black text-3xl"></i>
            <Tooltip target="#wallet" position="bottom">
              Connect to your wallet
            </Tooltip>
          </button>
          {/* Cart icon */}
          <button
            id="cart"
            className="w-12 h-12 hover:bg-lime-500 border-transparent rounded-full flex justify-center items-center"
            onClick={handleOpenCart}
          >
            <i className="pi pi-cart-plus text-black text-3xl"></i>
            <Tooltip target="#cart" position="bottom">
              Your cart
            </Tooltip>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
