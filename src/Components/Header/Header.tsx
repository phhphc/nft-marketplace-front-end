import Image from "next/image";
import logo from "@Assets/logo.png";
import metamaskLogo from "@Assets/metamask-logo.png";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { Sidebar } from "primereact/sidebar";
import Link from "next/link";
import { AppContext } from "@Store/index";
import { useContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { WEB3_ACTION_TYPES } from "@Store/index";
import avatar from "@Assets/avatar.png";
import { cartItemList } from "./cartMockData";

const handleConnectWallet = async (web3Context: any) => {
  // If metamask is installed
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const addresses = await provider.send("eth_requestAccounts", []);
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.CHANGE,
      payload: { provider: provider, myAddress: addresses[0] },
    });
  }
  // If metamask is not installed
  else {
    alert("You don't have metamask on your brownser");
  }
};

const handleLogOut = (web3Context: any) => {
  web3Context.dispatch({
    type: WEB3_ACTION_TYPES.CHANGE,
    payload: { provider: null, myAddress: "" },
  });
};

const Header = () => {
  const web3Context = useContext(AppContext);

  const [address, setAddress] = useState(web3Context.state.web3.myAddress);
  const [provider, setProvider] = useState(web3Context.state.web3.provider);
  // Wallet
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  // Cart
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const totalPrice = useMemo(() => {
    return Math.round(
      (cartItemList ? cartItemList.reduce((acc, cur) => acc + (cur.listing?.price || 0), 0) : 0) / 1000000000000000000
    );
  }, [cartItemList]);

  useEffect(() => {
    setAddress(web3Context.state.web3.myAddress);
    setProvider(web3Context.state.web3.provider);
    if (web3Context.state.web3.provider !== null) {
      setWalletConnected(true);
      web3Context.state.web3.provider.getBalance(web3Context.state.web3.myAddress).then((result: any) => {
        setBalance(Number(ethers.utils.formatEther(result)));
      });
    } else {
      setWalletConnected(false);
      setBalance(0);
    }
  }, [web3Context.state.web3.provider]);

  useEffect(() => {
    setInterval(() => {
      if (!window?.ethereum?._state?.isUnlocked) {
        handleLogOut(web3Context);
      }
    }, 2000);
  }, []);

  return (
    <div id="header" className="fixed top-0 right-0 left-0 h-24 z-10">
      <div className="flex h-full w-full bg-gray-100 shadow items-center justify-between px-10">
        {/* Logo */}
        <Link href="/" id="logo">
          <Image className="h-16 w-36" src={logo} alt="Clover logo" />
        </Link>

        {/* Search bar */}
        <span id="search-bar" className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Search NFTs, collections, and accounts" className="w-96 h-10" />
        </span>

        {/* Profile, wallet and cart */}
        <div id="navbar" className="w-56 flex items-center justify-end space-x-5">
          {/* Profile icon and wallet icon when connecting to wallet */}
          {walletConnected && (
            <>
              {/* Profile */}
              <Link href={`/user-profile/${address}`} className="profile-btn relative">
                <Image src={avatar} alt="avatar" className="h-12 w-12 border-2 border-black rounded-full" />
                <div className="profile-menu absolute hidden flex-col bg-white font-medium w-36 right-0 rounded-lg shadow">
                  <Link
                    href={`/user-profile/${address}`}
                    className="py-3 w-full hover:bg-slate-200 rounded-t-lg border-b"
                  >
                    <span className="ml-4">Profile</span>
                  </Link>
                  <Link
                    href={`/user-profile/${address}/collection`}
                    className="py-3 w-full hover:bg-slate-200 border-b"
                  >
                    <span className="ml-4">Collection</span>
                  </Link>
                  <Link href={`/user-profile/${address}/favorite`} className="py-3 w-full hover:bg-slate-200 border-b">
                    <span className="ml-4">Favorite</span>
                  </Link>
                  <Link
                    href={`/user-profile/${address}/create`}
                    className="py-3 w-full hover:bg-slate-200 rounded-b-lg"
                  >
                    <span className="ml-4">Create</span>
                  </Link>
                </div>
              </Link>

              {/* Wallet */}
              <button
                className="wallet rounded-full w-12 h-12 hover:bg-gray-300 flex items-center justify-center"
                onClick={() => setWalletModalVisible(true)}
              >
                <i className="pi pi-wallet text-black text-3xl"></i>
              </button>
              <Tooltip target=".wallet" position="bottom">
                Open wallet
              </Tooltip>
              <Sidebar
                className="wallet-modal"
                visible={walletModalVisible}
                position="right"
                onHide={() => setWalletModalVisible(false)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-start space-x-3">
                    <Image src={avatar} alt="avatar" className="h-12 w-12 border-2 border-black rounded-full" />
                    <span className="text-base w-32 overflow-hidden text-ellipsis">{address}</span>
                  </div>
                  <div className="border-b-2 w-full my-4"></div>
                  <div className="flex px-2 items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image src={metamaskLogo} alt="avatar" className="h-8 w-8" />
                      <span className="text-black text-base font-bold">Metamask</span>
                    </div>
                    <button
                      className="p-2 bg-red-500 rounded-lg text-white font-bold"
                      onClick={() => {
                        handleLogOut(web3Context);
                      }}
                    >
                      Log out
                    </button>
                  </div>
                  <div className="mt-6 py-3 flex flex-col border rounded-lg justify-center">
                    <span className="text-center">Total balance</span>
                    <span className="text-center font-bold">${balance}</span>
                  </div>
                </div>
              </Sidebar>
            </>
          )}
          {/* Wallet if not connect to wallet */}
          {!walletConnected && (
            <div className="flex items-center justify-end space-x-5">
              {/* Wallet */}
              <button
                className="wallet rounded-full w-12 h-12 hover:bg-gray-300 flex items-center justify-center"
                onClick={() => setWalletModalVisible(true)}
              >
                <i className="pi pi-wallet text-black text-3xl"></i>
              </button>
              <Tooltip target=".wallet" position="bottom">
                Connect wallet
              </Tooltip>
              <Sidebar
                visible={walletModalVisible}
                position="right"
                className="w-96 h-full"
                onHide={() => setWalletModalVisible(false)}
              >
                <div className="flex items-center justify-start space-x-3 mb-5">
                  <div className="border border-black rounded-full w-10 h-10 flex items-center justify-center">
                    <i className="pi pi-user text-2xl"></i>
                  </div>
                  <span>My wallet</span>
                </div>
                <button
                  className="flex justify-between w-full items-center border-2 p-3 rounded-lg hover:bg-gray-300"
                  onClick={() => handleConnectWallet(web3Context)}
                >
                  <div className="flex items-center space-x-2">
                    <Image src={metamaskLogo} alt="avatar" className="h-8 w-8"></Image>
                    <span className="text-black text-base font-bold">Metamask</span>
                  </div>
                  <div className="bg-sky-500 text-white rounded-md p-2">Ethereum</div>
                </button>
              </Sidebar>
            </div>
          )}
          {/* Cart */}
          <button
            className="cart rounded-full w-12 h-12 hover:bg-gray-300 flex items-center justify-center"
            onClick={() => setCartModalVisible(true)}
          >
            <i className="pi pi-cart-plus text-black text-3xl"></i>
          </button>
          <Tooltip target=".cart" position="bottom">
            Open cart
          </Tooltip>
          <Sidebar
            className="cart-modal"
            visible={cartModalVisible}
            position="right"
            onHide={() => setCartModalVisible(false)}
          >
            <div className="flex flex-col text-black overflow-y-auto">
              <div className="text-xl font-bold mx-3 pb-4 border-b-2">YOUR CART</div>
              <div className="flex justify-between items-center font-bold m-3">
                <span>{cartItemList.length} item(s)</span>
                <button className="bg-red-500 p-2 text-white rounded-lg hover:bg-red-400">Remove all</button>
              </div>
              <div className="space-y-2">
                {cartItemList.map((cartItem) => (
                  <Link
                    className="cart-item flex justify-between items-center w-full py-2 px-4 rounded-lg hover:bg-gray-100"
                    href={`/detail/${cartItem.token_id}`}
                  >
                    <div className="flex justify-start space-x-2">
                      <img src={cartItem.metadata?.image} alt="cart item" className="h-16 w-16 rounded-lg" />
                      <div className="flex flex-col items-start justify-start text-sm">
                        <span className="font-medium">{cartItem.metadata?.name}</span>
                        <span className="">{"Collection name"}</span>
                      </div>
                    </div>
                    <span className="price text-sm">
                      {cartItem.listing?.price ? cartItem.listing.price / 1000000000000000000 : 0} ETH
                    </span>
                    <button className="delete-cart-btn hidden hover:text-white">
                      <i className="pi pi-trash" />
                    </button>
                  </Link>
                ))}
              </div>
              <div className="flex justify-between border-t-2 mx-3 my-3 pt-3">
                <span className="text-xl font-semibold">Total price</span>
                <span className="font-semibold">{`${totalPrice}`} ETH</span>
              </div>
              <button className="bg-sky-500 p-4 rounded-lg text-xl font-semibold text-white hover:bg-sky-400">
                Purchase
              </button>
            </div>
          </Sidebar>
        </div>
      </div>
    </div>
  );
};

export default Header;
