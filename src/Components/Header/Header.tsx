import Image from "next/image";
import logo from "@Assets/logo.png";
import metamaskLogo from "@Assets/metamask-logo.png";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { Dialog } from "primereact/dialog";
import Link from "next/link";
import { AppContext } from "@Store/index";
import { useContext, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { WEB3_ACTION_TYPES } from "@Store/index";
import avatar from "@Assets/avatar.png";

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

const handleOpenCart = () => {
  // not finish
  alert("Feature's not finished");
};

const Header = () => {
  const web3Context = useContext(AppContext);

  const [address, setAddress] = useState(web3Context.state.web3.myAddress);
  const [provider, setProvider] = useState(web3Context.state.web3.provider);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setAddress(web3Context.state.web3.myAddress);
    setProvider(web3Context.state.web3.provider);
    if (web3Context.state.web3.provider !== null) {
      setWalletConnected(true);
      web3Context.state.web3.provider
        .getBalance(web3Context.state.web3.myAddress)
        .then((result: any) => {
          setBalance(Number(ethers.utils.formatEther(result)));
        });
    } else {
      setWalletConnected(false);
      setBalance(0);
    }
  }, [web3Context.state.web3.provider]);

  useEffect(() => {
    setInterval(() => {
      if (!window.ethereum._state.isUnlocked) {
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
          <InputText
            placeholder="Search NFTs, collections, and accounts"
            className="w-96 h-10"
          />
        </span>

        {/* Profile icon, wallet icon, and cart icon */}
        {/* If wallet is connected */}
        {walletConnected && (
          <div id="navbar" className="w-56 flex items-center justify-around">
            {/* Profile */}
            <Link href={`/user-profile/${address}`}>
              <Image
                src={avatar}
                alt="avatar"
                className="h-12 w-12 border-2 border-black rounded-full"
              ></Image>
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
            <Dialog
              visible={walletModalVisible}
              position="right"
              className="w-96 h-full"
              onHide={() => setWalletModalVisible(false)}
              draggable={false}
              header={
                <div className="flex items-center justify-start space-x-3">
                  <Image
                    src={avatar}
                    alt="avatar"
                    className="h-12 w-12 border-2 border-black rounded-full"
                  ></Image>
                  <span className="text-base w-32 overflow-hidden text-ellipsis">
                    {address}
                  </span>
                </div>
              }
            >
              <div className="flex flex-col">
                <div className="border-b-2 w-full"></div>
                <div className="flex my-4 px-2 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={metamaskLogo}
                      alt="avatar"
                      className="h-8 w-8"
                    ></Image>
                    <span className="text-black text-base font-bold">
                      Metamask
                    </span>
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
                <div className="my-3 py-3 flex flex-col border rounded-lg justify-center">
                  <span className="text-center">Total balance</span>
                  <span className="text-center font-bold">${balance}</span>
                </div>
              </div>
            </Dialog>

            {/* Cart */}
            <button
              className="cart rounded-full w-12 h-12 hover:bg-gray-300 flex items-center justify-center"
              onClick={() => handleOpenCart()}
            >
              <i className="pi pi-cart-plus text-black text-3xl"></i>
            </button>
            <Tooltip target=".cart" position="bottom">
              Open cart
            </Tooltip>
          </div>
        )}

        {/* If wallet is not connected */}
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
            <Dialog
              visible={walletModalVisible}
              position="right"
              className="w-96 h-full"
              onHide={() => setWalletModalVisible(false)}
              draggable={false}
              header={
                <div className="flex items-center justify-start space-x-3">
                  <div className="border border-black rounded-full w-10 h-10 flex items-center justify-center">
                    <i className="pi pi-user text-2xl"></i>
                  </div>
                  <span>My wallet</span>
                </div>
              }
            >
              <button
                className="flex justify-between w-full items-center border-2 p-3 rounded-lg hover:bg-gray-300"
                onClick={() => handleConnectWallet(web3Context)}
              >
                <div className="flex items-center space-x-2">
                  <Image
                    src={metamaskLogo}
                    alt="avatar"
                    className="h-8 w-8"
                  ></Image>
                  <span className="text-black text-base font-bold">
                    Metamask
                  </span>
                </div>
                <div className="bg-sky-500 text-white rounded-md p-2">
                  Ethereum
                </div>
              </button>
            </Dialog>

            {/* Cart */}
            <button
              className="cart rounded-full w-12 h-12 hover:bg-gray-300 flex items-center justify-center"
              onClick={() => handleOpenCart()}
            >
              <i className="pi pi-cart-plus text-black text-3xl"></i>
            </button>
            <Tooltip target=".cart" position="bottom">
              Open cart
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
