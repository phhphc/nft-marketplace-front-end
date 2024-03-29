import logo from "@Assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@Store/index";

const Footer = () => {
  const web3Context = useContext(AppContext);
  return (
    <div className="w-full lg:grid lg:grid-cols-2 border-t border-purple p-16 items-center bg-gray-100">
      <div className="flex flex-col">
        <Image src={logo} alt="logo" className="w-36 h-16 self-center mb-4" />
        <div className="text-justify">
          Non-Fungible Token (NFT) marketplace where you can buy, sell, or
          create NFTs
        </div>
      </div>
      <div className="flex justify-center self-center">
        <div className="mr-16 sm:mt-8 xs:mt-8">
          <div className="font-bold ">Marketplace</div>
          <Link href={`/`} className="pt-4 block">
            All NFTs
          </Link>
        </div>
        <div className="mr-16 sm:mt-8 xs:mt-8">
          <div className="font-bold">My Account</div>
          <Link href={`/user-profile`} className="pt-4 block">
            Profile
          </Link>
          <Link href={`/my-collections`} className="pt-4 block">
            My Collections
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
