import Image from "next/image";
import logo from "@Assets/logo.png";
import logo2 from "@Assets/logo2.png";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import Link from "next/link";

const Header = () => {
  return (
    <div id="header" className="fixed top-0 right-0 left-0 h-24 z-10">
      <div className="flex h-full w-full bg-black shadow items-center justify-between px-10">
        <Link href="/">
          <Image id="logo" className="h-16 w-36" src={logo2} alt="logo" />
        </Link>
        <span id="search-bar" className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Search" className="w-96 h-10" />
        </span>
        <div id="navbar" className="w-56 flex items-center justify-around">
          <Link href={`/user-profile/${process.env.NEXT_PUBLIC_USER_ID}`}>
            <Tooltip target="#avatar" position="bottom">
              Profile
            </Tooltip>
            <img
              id="avatar"
              src="https://scontent.fsgn1-1.fna.fbcdn.net/v/t39.30808-6/278374293_156929620076225_8622926127986152733_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=za5rCUtfJx4AX8otllQ&_nc_ht=scontent.fsgn1-1.fna&oh=00_AfDhdFjbMAG-3FTKtOlGlqSH1C4lJENi09ZU-3RoFKe9MA&oe=63D8AB0A"
              alt="avatar"
              className="h-10 w-10 border-2 border-yellow rounded-full"
            ></img>
          </Link>
          <Tooltip target="#wallet" position="bottom">
            Wallet
          </Tooltip>
          <i
            id="wallet"
            className="pi pi-wallet text-white text-3xl cursor-pointer"
          ></i>
          <Tooltip target="#cart" position="bottom">
            Your cart
          </Tooltip>
          <i
            id="cart"
            className="pi pi-cart-plus text-white text-3xl cursor-pointer"
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Header;
