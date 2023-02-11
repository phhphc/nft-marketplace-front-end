import logo from "@Assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@Store/index";

const Footer = () => {
  const web3Context = useContext(AppContext);
  return (
    <div className="w-full grid grid-cols-2 border-t border-purple p-16 items-center bg-gray-100">
      <div className="flex flex-col">
        <Image src={logo} alt="logo" className="w-36 h-16 self-center mb-4" />
        <div className="text-justify">
          The world's first and largest digital marketplace for crypto
          collectibles and non-fungible tokens (NFTs). Buy, sell and discover
          exclusive digital items.
        </div>
      </div>
      <div className="flex justify-center self-center">
        <div className="mr-16">
          <div className="font-bold">Marketplace</div>
          <Link href={`/`} className="pt-4 block">
            All NFTs
          </Link>
        </div>
        <div className="mr-16">
          <div className="font-bold">My Account</div>
          <Link
            href={`/user-profile/${web3Context.state.web3.myAddress}`}
            className="pt-4 block"
          >
            Profile
          </Link>
          <Link
            href={`/collection/collection-name-example`}
            className="pt-4 block"
          >
            My Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
