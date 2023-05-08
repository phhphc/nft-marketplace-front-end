import Image from "next/image";
import logo from "@Assets/logo.png";
import metamaskLogo from "@Assets/metamask-logo.png";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { Sidebar } from "primereact/sidebar";
import Link from "next/link";
import { AppContext, ICart } from "@Store/index";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ethers } from "ethers";
import { WEB3_ACTION_TYPES } from "@Store/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import { INFTCollectionItem } from "@Interfaces/index";
import { handleRemoveFromCart, showingPrice } from "@Utils/index";
import { buyToken, transferTethToEth } from "@Services/ApiService";
import { erc20Abi } from "@Constants/erc20Abi";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";

const Header = () => {
  const web3Context = useContext(AppContext);

  // Wallet
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [ethBalance, setEthBalance] = useState(0);
  const [erc20Balance, setErc20Balance] = useState(0);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState<number>(0);

  const handleConnectWallet = async () => {
    // If metamask is installed
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const addresses = await provider.send("eth_requestAccounts", []);
      web3Context.dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          provider: provider,
          myAddress: addresses[0],
          cart: web3Context.state.web3.cart,
        },
      });
    }
    // If metamask is not installed
    else {
      alert("No metamask on your browser");
    }
  };

  const handleLogOut = () => {
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.CHANGE,
      payload: {
        provider: null,
        myAddress: "",
        cart: web3Context.state.web3.cart,
      },
    });
  };

  useEffect(() => {
    const getMoney = async () => {
      if (
        web3Context.state.web3.provider &&
        web3Context.state.web3.myWallet &&
        web3Context.state.web3.myAddress
      ) {
        setWalletConnected(true);
        const ETHBalance = await web3Context.state.web3.provider.getBalance(
          web3Context.state.web3.myAddress
        );
        const erc20Address = process.env.NEXT_PUBLIC_ERC20_ADDRESS!;

        const erc20Contract = new ethers.Contract(
          erc20Address,
          erc20Abi,
          web3Context.state.web3.provider
        );

        const erc20ContractWithSigner = erc20Contract.connect(
          web3Context.state.web3.myWallet as any
        );

        const erc20Balance = await erc20ContractWithSigner.balanceOf(
          web3Context.state.web3.myAddress
        );
        setEthBalance(Number(ethers.utils.formatEther(ETHBalance)));
        setErc20Balance(Number(ethers.utils.formatEther(erc20Balance)));
      } else {
        setWalletConnected(false);
        setEthBalance(0);
        setErc20Balance(0);
      }
    };
    getMoney();
  }, [
    web3Context.state.web3.provider,
    web3Context.state.web3.provider?.getBalance(
      web3Context.state.web3.myAddress
    ),
    web3Context.state.web3.myAddress,
  ]);

  useEffect(() => {
    setInterval(() => {
      if (!window?.ethereum?._state?.isUnlocked) {
        handleLogOut();
      }
    }, 2000);
  }, []);

  // Cart
  const { nftCollectionList } = useNFTCollectionList({provider: web3Context.state.web3.provider, 
    myWallet: web3Context.state.web3.myWallet});
  const [cartModalVisible, setCartModalVisible] = useState(false);
  // const totalPrice = useMemo(() => {
  //   return Math.round(
  //     cartItemList
  //       ? cartItemList.reduce(
  //           (acc, cur) => acc + Number(cur[0].listings[0]?.start_price || 0),
  //           0
  //         )
  //       : 0
  //   );
  // }, [cartItemList]);
  const cartItemList = useMemo(() => {
    return nftCollectionList.filter((item: INFTCollectionItem[]) =>
      web3Context.state.web3.cart
        .map((item) => item.orderHash)
        .includes(item[0].listings[0]?.order_hash)
    );
  }, [web3Context.state.web3.cart, nftCollectionList]);

  const totalPrice = useMemo(() => {
    return Math.round(
      cartItemList
        ? cartItemList.reduce(
            (acc, cur) => acc + Number(cur[0].listings[0]?.start_price || 0),
            0
          )
        : 0
    );
  }, [cartItemList]);

  const handleRemoveAllFromCart = () => {
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.CHANGE,
      payload: {
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        cart: [],
      },
    });
  };

  const handleBuyShoppingCart = async (
    myWallet: any,
    provider: any,
    cart: ICart[]
  ) => {
    setCartModalVisible(false);
    try {
      if (cart.length) {
        await buyToken({
          orderHashes: cart.map((item) => item.orderHash),
          price: cart.map((item) => item.price),
          myWallet,
          provider,
        });
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Buy NFT successfully!",
            life: 5000,
          });
        handleRemoveAllFromCart();
        window.location.reload();
      }
    } catch (error) {
      handleRemoveAllFromCart();
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to buy NFT!",
          life: 5000,
        });
    }
  };

  const handleTransferTethToEth = async (price: Number) => {
    setVisible(false);
    setWalletModalVisible(false);
    try {
      await transferTethToEth({
        provider: web3Context.state.web3.provider,
        myWallet: web3Context.state.web3.myWallet,
        price: String(price),
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Transfer successfully!",
          life: 5000,
        });
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to transfer!",
          life: 5000,
        });
    }
  };

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

        {/* Profile, wallet and cart */}
        <div
          id="navbar"
          className="w-70 flex items-center justify-end space-x-5"
        >
          {/* Profile icon and wallet icon when connecting to wallet */}
          {walletConnected && (
            <>
              {/* Profile */}
              <Link href={`/user-profile`} className="profile-btn relative">
                <button className="rounded-full w-12 h-12 hover:bg-gray-300 flex items-center justify-center">
                  <i className="pi pi-user text-black text-3xl"></i>
                </button>

                <div className="profile-menu absolute hidden flex-col bg-white font-medium w-36 right-0 rounded-lg shadow">
                  <Link
                    href={`/user-profile`}
                    className="py-3 w-full hover:bg-slate-200 rounded-t-lg border-b"
                  >
                    <span className="ml-4">Profile</span>
                  </Link>
                  <Link
                    href={`/my-collections`}
                    className="py-3 w-full hover:bg-slate-200 border-b"
                  >
                    <span className="ml-4">My Collections</span>
                  </Link>
                  <Link
                    href={`/create-collection`}
                    className="py-3 w-full hover:bg-slate-200 border-b"
                  >
                    <span className="ml-4">New Collection</span>
                  </Link>
                  <Link
                    href={`/create-nft`}
                    className="py-3 w-full hover:bg-slate-200 rounded-b-lg border-b"
                  >
                    <span className="ml-4">Create NFT</span>
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
                    <span className="text-base w-32 overflow-hidden text-ellipsis">
                      {web3Context.state.web3.myAddress}
                    </span>
                  </div>
                  <div className="border-b-2 w-full my-4"></div>
                  <div className="flex px-2 items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={metamaskLogo}
                        alt="avatar"
                        className="h-8 w-8"
                      />
                      <span className="text-black text-base font-bold">
                        Metamask
                      </span>
                    </div>
                    <button
                      className="p-2 bg-red-500 rounded-lg text-white font-bold"
                      onClick={() => {
                        handleLogOut();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                  <div className="mt-6 py-3 flex flex-col gap-1 border rounded-lg justify-center">
                    <div className="text-center">
                      <Tag
                        severity="success"
                        value="Total blance"
                        rounded
                        className="w-1/3 h-8 text-sm"
                      ></Tag>
                    </div>
                    <div className="text-center font-bold">
                      {ethBalance} ETH
                    </div>
                    <div className="text-center font-bold">
                      {erc20Balance} TETH
                    </div>
                  </div>
                  <div className="mt-5">
                    <Button
                      label="Transfer TETH to ETH"
                      icon="pi pi-reply"
                      className=""
                      onClick={() => setVisible(true)}
                    />
                    <Dialog
                      header="Please input the amount of TETH you want to transfer to ETH"
                      visible={visible}
                      style={{ width: "50vw" }}
                      onHide={() => setVisible(false)}
                      footer={
                        <div>
                          <Button
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={() => setVisible(false)}
                            className="p-button-text"
                          />
                          <Button
                            label="Transfer"
                            icon="pi pi-check"
                            onClick={() => handleTransferTethToEth(price)}
                            autoFocus
                          />
                        </div>
                      }
                    >
                      <div className="flex gap-3">
                        <InputNumber
                          placeholder="Input TETH"
                          value={price}
                          onValueChange={(e: any) => setPrice(e.value)}
                          minFractionDigits={1}
                          maxFractionDigits={5}
                          min={0}
                        />
                      </div>
                    </Dialog>
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
                  onClick={() => handleConnectWallet()}
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
              <div className="text-xl font-bold mx-3 pb-4 border-b-2">
                YOUR CART
              </div>
              <div className="flex justify-between items-center font-bold m-3">
                <span>{cartItemList.length} item(s)</span>
                <button
                  className="bg-red-500 p-2 text-white rounded-lg hover:bg-red-400"
                  onClick={() => handleRemoveAllFromCart()}
                >
                  Remove all
                </button>
              </div>
              <div className="space-y-2">
                {cartItemList.map((cartItem) => (
                  <div
                    key={cartItem[0].name}
                    className="cart-item flex justify-between items-center w-full py-2 px-4 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex justify-start space-x-2">
                      <Link href={`/detail/${cartItem[0].identifier}`}>
                        <img
                          src={cartItem[0].image}
                          alt="cart-item"
                          className="h-16 w-16 rounded-lg"
                        />
                      </Link>
                      <div className="flex flex-col items-start justify-start text-sm">
                        {cartItem.length > 1 && (
                          <span className="font-medium">Bundle</span>
                        )}
                        {cartItem.map((item) => (
                          <span className="font-medium">{item.name}</span>
                        ))}
                      </div>
                    </div>
                    <span className="price text-sm">
                      {showingPrice(
                        cartItem[0].listings[0]?.start_price || "0"
                      )}
                    </span>
                    <button
                      className="delete-cart-btn hidden hover:text-white"
                      onClick={() =>
                        handleRemoveFromCart(
                          web3Context,
                          cartItem[0].listings[0].order_hash
                        )
                      }
                    >
                      <i className="pi pi-trash" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t-2 mx-3 my-3 pt-3">
                <span className="text-xl font-semibold">Total price</span>
                <span className="font-semibold">
                  {showingPrice(totalPrice.toString())}
                </span>
              </div>
              <button
                className="bg-sky-500 p-4 rounded-lg text-xl font-semibold text-white hover:bg-sky-400"
                onClick={() =>
                  handleBuyShoppingCart(
                    web3Context.state.web3.myWallet,
                    web3Context.state.web3.provider,
                    web3Context.state.web3.cart
                  )
                }
              >
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
