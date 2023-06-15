import Image from "next/image";
import logo from "@Assets/logo.png";
import metamaskLogo from "@Assets/metamask-logo.png";
import { Tooltip } from "primereact/tooltip";
import { Sidebar } from "primereact/sidebar";
import Link from "next/link";
import { AppContext, ICart } from "@Store/index";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ethers } from "ethers";
import { WEB3_ACTION_TYPES } from "@Store/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import { INFTCollectionItem, INotification } from "@Interfaces/index";
import { handleRemoveFromCart, showingPrice } from "@Utils/index";
import {
  buyToken,
  setViewedNotifService,
  signEIP191,
  transferCurrency,
} from "@Services/ApiService";
import { erc20Abi } from "@Constants/erc20Abi";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import {
  CHAINID_CURRENCY,
  CHAIN_ID,
  CHAINID_CURRENCY_TRANSFER,
  ERC20_ADDRESS,
  NFT_EVENT_NAME,
  NOTIFICATION_INFO,
  CHAINID_CURRENCY_UNITS,
  ERC20_NAME,
} from "@Constants/index";
import { Badge } from "primereact/badge";
import { ListBox } from "primereact/listbox";
import moment from "moment";
import { useRouter } from "next/router";
import { TabView, TabPanel } from "primereact/tabview";

export interface IHeaderProps {
  notification: INotification[];
  notificationRefetch: () => void;
}

const Header = ({ notification, notificationRefetch }: IHeaderProps) => {
  const logOutInterval = useRef<any>();
  const web3Context = useContext(AppContext);

  // Wallet
  const [walletConnected, setWalletConnected] = useState(false);
  const [refetch, setRefetch] = useState<number>(0);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [ethBalance, setEthBalance] = useState(0);
  const [erc20Balance, setErc20Balance] = useState(0);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [isUnreadNotifs, setIsUnreadNotifs] = useState<boolean>(false);
  const router = useRouter();

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
      type: WEB3_ACTION_TYPES.LOGOUT,
    });
  };

  useEffect(() => {
    const getMoney = async () => {
      if (
        web3Context.state.web3.provider &&
        web3Context.state.web3.myWallet &&
        web3Context.state.web3.myAddress
      ) {
        if (await window.ethereum?._metamask?.isUnlocked())
          setWalletConnected(true);
        const ETHBalance = await web3Context.state.web3.provider.getBalance(
          web3Context.state.web3.myAddress
        );
        const erc20Address = ERC20_ADDRESS.get(web3Context.state.web3.chainId)!;

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
    ethBalance,
    erc20Balance,
    refetch,
  ]);

  useEffect(() => {
    logOutInterval.current = setInterval(() => {
      if (!window?.ethereum?._state?.isUnlocked) {
        handleLogOut();
      }
    }, 2000);
    return () => clearInterval(logOutInterval.current);
  }, []);

  // Cart
  const { nftCollectionList } = useNFTCollectionList({
    provider: web3Context.state.web3.provider,
    myWallet: web3Context.state.web3.myWallet,
    chainId: web3Context.state.web3.chainId,
  });
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
      if (!provider) {
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please login your wallet",
            life: 5000,
          });
        return;
      }
      if (cart.length) {
        await buyToken({
          orderHashes: cart.map((item) => item.orderHash),
          price: cart.map((item) => item.price),
          myWallet,
          provider,
          chainId: web3Context.state.web3.chainId,
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

  const handleTransferCurrency = async (price: Number, unit: string) => {
    setVisible(false);
    setWalletModalVisible(false);
    try {
      if (price && unit) {
        await transferCurrency({
          provider: web3Context.state.web3.provider,
          myWallet: web3Context.state.web3.myWallet,
          price: String(price),
          unit: unit,
          chainId: web3Context.state.web3.chainId,
        });
      } else {
        return (
          web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please input the value!",
            life: 5000,
          })
        );
      }
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Transfer successfully!",
          life: 5000,
        });
      setRefetch((prev) => prev + 1);
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

  const setViewedNotification = async (notif: INotification) => {
    try {
      await setViewedNotifService({
        eventName: notif.event_name,
        orderHash: notif.order_hash,
        chainId: web3Context.state.web3.chainId,
      });
      notificationRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const clickToNotification = (notif: INotification) => {
    setNotificationVisible(false);
    setIsUnreadNotifs(false);
    setViewedNotification(notif);
    if (NOTIFICATION_INFO.OFFER_RECEIVED === notif.info) {
      router.push({
        pathname: "/user-profile",
        query: { notif: "offer_received" },
      });
    } else {
      router.push(`/detail/${notif.token_id}`);
    }
  };

  const handleLogin = async () => {
    const data = await signEIP191({
      provider: web3Context.state.web3.provider,
      myAddress: web3Context.state.web3.myAddress,
      chainId: web3Context.state.web3.chainId,
    });
    console.log("🚀 ~ file: Header.tsx:320 ~ handleLogin ~ data:", data);
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.LOGIN,
      payload: data.auth_token,
    });
  };

  const notificationListTemplate = (notif: INotification) => {
    let notiSentence = "";
    switch (notif.info) {
      case NOTIFICATION_INFO.LISTING_SOLD:
        notiSentence = `Your NFT: ${notif.nft_name} is sold`;
        break;
      case NOTIFICATION_INFO.LISTING_EXPIRED:
        notiSentence = `Your NFT: ${notif.nft_name} has expired to listing`;
        break;
      case NOTIFICATION_INFO.OFFER_RECEIVED:
        notiSentence = `You have an offer to your NFT: ${notif.nft_name}`;
        break;
      case NOTIFICATION_INFO.OFFER_ACCEPTED:
        notiSentence = `Your offer to NFT: ${notif.nft_name} is fulfilled`;
        break;
      case NOTIFICATION_INFO.OFFER_EXPIRED:
        notiSentence = `Your offer to NFT: ${notif.nft_name} has expired`;
        break;
      default:
        notiSentence;
    }

    return (
      <div
        onClick={() => {
          clickToNotification(notif);
        }}
        className={
          "p-2 rounded-md " +
          (notif.is_viewed === false ? "font-medium" : "font-normal")
        }
      >
        <div className="flex gap-3 items-center rounded">
          <img
            alt={notif.nft_name}
            src={notif.nft_image}
            style={{ width: "4rem", height: "4rem" }}
            className="rounded-full"
          />
          <div className="flex flex-col w-full">
            <div>{notiSentence}</div>
            <div className="flex justify-between mt-1">
              <div className="text-sm text-emerald-500">
                {moment(notif.date).startOf("minute").fromNow()}
              </div>
              {!notif.is_viewed && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewedNotification(notif);
                  }}
                >
                  <Tag
                    className="hover:bg-green-700"
                    severity="success"
                    value="Click as read"
                  ></Tag>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="header" className="fixed top-0 right-0 left-0 h-24 z-10">
      <div className="flex h-full w-full bg-gray-100 shadow items-center justify-between px-10">
        {/* Logo */}
        <Link href="/" id="logo">
          <Image className="h-16 w-36" src={logo} alt="Clover logo" />
        </Link>

        {/* Search bar */}
        {/* <span id="search-bar" className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search NFTs, collections, and accounts"
            className="w-96 h-10"
          />
        </span> */}

        {walletConnected && (
          <div
            id="navbar"
            className="w-70 flex items-center justify-end space-x-5"
          >
            {/* Profile icon and wallet icon when connecting to wallet */}
            {web3Context.state.web3.authToken ? (
              <button
                onClick={() => {
                  handleLogOut();
                }}
              >
                Log out
              </button>
            ) : (
              <button onClick={handleLogin}>Login</button>
            )}
            {web3Context.state.web3.authToken && (
              <>
                {/* Notification */}
                <button
                  className="w-10 h-10 rounded-full hover:bg-gray-300"
                  onClick={() => {
                    setNotificationVisible(true), setIsUnreadNotifs(false);
                  }}
                >
                  <i className="pi pi-bell p-overlay-badge text-black text-3xl">
                    {notification.filter(
                      (notif: INotification) => notif.is_viewed === false
                    ).length > 0 && (
                      <Badge
                        value={
                          notification.filter(
                            (notif: INotification) => notif.is_viewed === false
                          ).length
                        }
                        severity="danger"
                      ></Badge>
                    )}
                  </i>
                </button>
                <Sidebar
                  position="right"
                  visible={notificationVisible}
                  onHide={() => {
                    setNotificationVisible(false);
                  }}
                >
                  <h2 className="text-2xl font-bold mb-3">Notifications</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsUnreadNotifs(false)}
                      className={
                        "px-5 py-1 rounded-md font-medium " +
                        (isUnreadNotifs
                          ? "hover:bg-slate-200"
                          : "bg-sky-200 text-blue-700 rounded-md")
                      }
                    >
                      All {"(" + notification.length + ")"}
                    </button>
                    <button
                      onClick={() => setIsUnreadNotifs(true)}
                      className={
                        "px-3 py-1 rounded-md font-medium " +
                        (isUnreadNotifs
                          ? "bg-sky-200 text-blue-700 rounded-md"
                          : "hover:bg-slate-200")
                      }
                    >
                      Unread{" "}
                      {"(" +
                        notification.filter(
                          (notif: INotification) => notif.is_viewed === false
                        ).length +
                        ")"}
                    </button>
                  </div>
                  <div className="">
                    <TabView className="w-full">
                      <TabPanel header="Listing" className="w-full">
                        <ListBox
                          options={
                            isUnreadNotifs
                              ? notification.filter(
                                  (notif: INotification) =>
                                    notif.is_viewed == false &&
                                    notif.event_name ===
                                      NFT_EVENT_NAME.LISTING.toLowerCase()
                                )
                              : notification.filter(
                                  (notif: INotification) =>
                                    notif.event_name ===
                                    NFT_EVENT_NAME.LISTING.toLowerCase()
                                )
                          }
                          optionLabel="name"
                          itemTemplate={notificationListTemplate}
                          className="w-full"
                        />
                      </TabPanel>
                      <TabPanel header="Offer" className="w-full">
                        <ListBox
                          options={
                            isUnreadNotifs
                              ? notification.filter(
                                  (notif: INotification) =>
                                    notif.is_viewed == false &&
                                    notif.event_name ===
                                      NFT_EVENT_NAME.OFFER.toLowerCase()
                                )
                              : notification.filter(
                                  (notif: INotification) =>
                                    notif.event_name ===
                                    NFT_EVENT_NAME.OFFER.toLowerCase()
                                )
                          }
                          optionLabel="name"
                          itemTemplate={notificationListTemplate}
                          className="w-full"
                        />
                      </TabPanel>
                      <TabPanel header="Sale" className="w-full">
                        <ListBox
                          options={
                            isUnreadNotifs
                              ? notification.filter(
                                  (notif: INotification) =>
                                    notif.is_viewed == false &&
                                    notif.event_name ===
                                      NFT_EVENT_NAME.SALE.toLowerCase()
                                )
                              : notification.filter(
                                  (notif: INotification) =>
                                    notif.event_name ===
                                    NFT_EVENT_NAME.SALE.toLowerCase()
                                )
                          }
                          optionLabel="name"
                          itemTemplate={notificationListTemplate}
                          className="w-full"
                        />
                      </TabPanel>
                    </TabView>
                  </div>
                </Sidebar>
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
                              web3Context.state.web3.chainId,
                              cartItem[0].listings[0]?.start_price || "0",
                              CHAINID_CURRENCY_UNITS.get(
                                web3Context.state.web3.chainId
                              )[0].value,
                              true
                            )}
                          </span>
                          <button
                            className="delete-cart-btn hidden"
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
                        {showingPrice(
                          web3Context.state.web3.chainId,
                          totalPrice.toString(),
                          CHAINID_CURRENCY_UNITS.get(
                            web3Context.state.web3.chainId
                          )[0].value,
                          true
                        )}
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
                        {ethBalance}{" "}
                        {CHAINID_CURRENCY.get(web3Context.state.web3.chainId)}
                      </div>
                      <div className="text-center font-bold">
                        {erc20Balance}{" "}
                        {ERC20_NAME.get(web3Context.state.web3.chainId)}
                      </div>
                    </div>
                    <div className="mt-5">
                      <button
                        className="bg-violet-500 hover:bg-violet-600 h-16 rounded-md text-xl w-full text-white"
                        onClick={() => setVisible(true)}
                      >
                        Transfer{" "}
                        {CHAINID_CURRENCY.get(web3Context.state.web3.chainId)}{" "}
                        <span>
                          <i className="pi pi-arrow-right-arrow-left pl-2 pr-2"></i>
                          {ERC20_NAME.get(web3Context.state.web3.chainId)}
                        </span>
                      </button>
                      <Dialog
                        header={
                          <div>
                            <p>Please input the type you want to transfer</p>
                            <p className="text-sm italic text-rose-500">
                              * 1{" "}
                              {ERC20_NAME.get(web3Context.state.web3.chainId)} =
                              1{" "}
                              {CHAINID_CURRENCY.get(
                                web3Context.state.web3.chainId
                              )}
                            </p>
                          </div>
                        }
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
                              onClick={() =>
                                handleTransferCurrency(price, selectedUnit)
                              }
                              autoFocus
                            />
                          </div>
                        }
                      >
                        <div className="flex gap-3">
                          <Dropdown
                            value={selectedUnit}
                            onChange={(e) => {
                              setSelectedUnit(e.value);
                            }}
                            options={CHAINID_CURRENCY_TRANSFER.get(
                              web3Context.state.web3.chainId
                            )}
                            optionLabel="name"
                            placeholder="Select a transfer type"
                            className="md:w-14rem"
                          />
                          <InputNumber
                            placeholder="Input balance"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
