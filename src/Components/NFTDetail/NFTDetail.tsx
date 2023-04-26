import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEthereum,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart, faEye, faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faShapes,
  faCircleCheck,
  faShareNodes,
  faEllipsis,
  faChartSimple,
  faClipboard,
  faInfoCircle,
  faBars,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { Tooltip } from "primereact/tooltip";
import { Accordion, AccordionTab } from "primereact/accordion";
import { INFTCollectionItem, Order } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { sellNFT, buyTokenService } from "@Services/ApiService";
import { WEB3_ACTION_TYPES } from "@Store/index";
import { CURRENCY_UNITS } from "@Constants/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import {
  handleAddToCart,
  handleRemoveFromCart,
  showingPrice,
} from "@Utils/index";
import { Galleria } from "primereact/galleria";
import moment from "moment";
import NFTActivity from "@Components/NFTActivity/NFTActivity";
import NFTPriceHistory from "@Components/NFTPriceHistory/NFTPriceHistory";
import NFTListings from "@Components/NFTListings/NFTListings";
import NFTOffers from "@Components/NFTOffers/NFTOffers";

export interface INFTDetailProps {
  nftDetail: INFTCollectionItem[];
}

const NFTDetail = ({ nftDetail }: INFTDetailProps) => {
  const { refetch } = useNFTCollectionList({});
  const canBuy = (item: INFTCollectionItem[]) => {
    return (
      !!item[0].listings[0] &&
      item[0].owner !== web3Context.state.web3.myAddress
    );
  };
  const canSell = (item: INFTCollectionItem[]) => {
    return (
      item[0].listings.length === 0 &&
      item[0].owner === web3Context.state.web3.myAddress
    );
  };
  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const toast = useRef<Toast>(null);

  const endTime = useMemo(() => {
    return new Date(Number(nftDetail[0].listings?.[0]?.end_time));
  }, []);

  const handleSellNFT = async (item: INFTCollectionItem[]) => {
    if (!web3Context.state.web3.provider) {
      return (
        toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please login your wallet!",
          life: 3000,
        })
      );
    }
    if (price === 0) {
      return (
        toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "The price must be higher than 0!",
          life: 3000,
        })
      );
    }
    try {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
      setVisible(false);
      await sellNFT({
        toast,
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item,
        price: price.toString(),
        unit: selectedUnit,
        isApprovedForAllNFTs: web3Context.state.web3.isApprovedForAllNFTs,
      });
      web3Context.dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          isApprovedForAllNFTs: true,
        },
      });
      refetch();
    } catch (error) {
      toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to sell NFT!",
          life: 3000,
        });
    } finally {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
    }
  };

  const handleBuyToken = async (
    myWallet: any,
    provider: any,
    item?: INFTCollectionItem[]
  ) => {
    if (!web3Context.state.web3.provider) {
      return (
        toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please login your wallet!",
          life: 3000,
        })
      );
    }
    try {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
      if (item) {
        await buyTokenService({
          toast,
          orderHashes: [item[0].listings[0].order_hash],
          price: [item[0].listings[0].start_price],
          myWallet,
          provider,
        });
        refetch();
      }
    } catch (error) {
      toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "You have rejected the transaction!",
          life: 3000,
        });
    } finally {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
    }
  };

  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    if (
      web3Context.state.web3.cart
        .map((item) => item.orderHash)
        .includes(nftDetail[0].listings[0]?.order_hash)
    ) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [web3Context.state.web3.cart]);

  const itemTemplate = (selectedItem: INFTCollectionItem) => {
    return (
      <img
        src={selectedItem.image}
        alt={selectedItem.name}
        style={{ width: "100%" }}
      />
    );
  };

  const thumbnailTemplate = (selectedItem: INFTCollectionItem) => {
    return <img src={selectedItem.image} alt={selectedItem.name} />;
  };

  const onSelectedBundleItem = (event: any) => {
    setSelectedItemIndex(event.index);
  };

  return (
    <div id="nft-detail">
      <div className="grid grid-cols-5 gap-4">
        <Toast ref={toast} position="top-center" />
        <div id="left-side" className="col-span-2">
          <div className="mt-5">
            {nftDetail.length == 1 ? (
              <img
                id="image"
                src={
                  nftDetail[0].image != "<nil>" && nftDetail[0].image != ""
                    ? nftDetail[0].image
                    : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
                }
                alt="detail"
                className="nft-detail-img rounded-b-lg w-full object-cover object-center lg:w-full"
              />
            ) : (
              <div className="card">
                <Galleria
                  value={nftDetail}
                  numVisible={3}
                  item={itemTemplate}
                  thumbnail={thumbnailTemplate}
                  activeIndex={selectedItemIndex}
                  onItemChange={onSelectedBundleItem}
                />
              </div>
            )}
          </div>

          <div className="mt-5">
            <div className="table-tab border rounded-t-lg">
              <div className="table-header border-b p-5 space-x-3 font-bold">
                <FontAwesomeIcon icon={faBars} />
                <span>Description</span>
              </div>
              <div className="table-content p-5">
                {nftDetail[selectedItemIndex].description != "<nil>"
                  ? nftDetail[selectedItemIndex].description
                  : ""}
              </div>
            </div>
            <Accordion multiple>
              {/* <AccordionTab
                className="properties"
                header={
                  <div className="flex space-x-2">
                    <FontAwesomeIcon icon={faChartSimple} />
                    <p>Properties</p>
                  </div>
                }
              >
                <div className="grid grid-cols-3">
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">BACKGOUND</span>
                    <span className="text-lg text-black">Blue</span>
                    <span className="text-sm text-gray-500">
                      7% have this trait
                    </span>
                  </div>
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">FACIAL TEARS</span>
                    <span className="text-lg text-black">CMYK</span>
                    <span className="text-sm text-gray-500">
                      68% have this trait
                    </span>
                  </div>
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">BACKGOUND</span>
                    <span className="text-lg text-black">Blue</span>
                    <span className="text-sm text-gray-500">
                      7% have this trait
                    </span>
                  </div>
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">FACIAL TEARS</span>
                    <span className="text-lg text-black">CMYK</span>
                    <span className="text-sm text-gray-500">
                      68% have this trait
                    </span>
                  </div>
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">BACKGOUND</span>
                    <span className="text-lg text-black">Blue</span>
                    <span className="text-sm text-gray-500">
                      7% have this trait
                    </span>
                  </div>
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">FACIAL TEARS</span>
                    <span className="text-lg text-black">CMYK</span>
                    <span className="text-sm text-gray-500">
                      68% have this trait
                    </span>
                  </div>
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">BACKGOUND</span>
                    <span className="text-lg text-black">Blue</span>
                    <span className="text-sm text-gray-500">
                      7% have this trait
                    </span>
                  </div>
                  <div className="properties-item flex flex-col items-center bg-sky-100 h-30 p-3 m-1 rounded-lg border border-blue-300">
                    <span className="text-xs text-sky-500">FACIAL TEARS</span>
                    <span className="text-lg text-black">CMYK</span>
                    <span className="text-sm text-gray-500">
                      68% have this trait
                    </span>
                  </div>
                </div>
              </AccordionTab> */}

              {/* <AccordionTab
                className="about"
                header={
                  <div className="flex space-x-2">
                    <FontAwesomeIcon icon={faClipboard} />
                    <p>
                      About {nftDetail[selectedItemIndex].name.toUpperCase()} BY{" "}
                      {"AuthorName"}
                    </p>
                  </div>
                }
              >
                <div className="flex space-x-3">
                  <img
                    className="avatar w-6 h-6 rounded-3xl mt-2"
                    src={
                      nftDetail[selectedItemIndex].image != "<nil>"
                        ? nftDetail[selectedItemIndex].image
                        : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
                    }
                    alt=""
                  />
                  <span className="about-text">
                    <span className="space-x-1">
                      <Link className="text-blue-500" href="">
                        GEMMA
                      </Link>
                      <span>
                        (The Generative Electronic Museum of Metaverse Art) is a
                        comprehensive generative art collection by
                      </span>
                      <Link className="text-blue-500" href="">
                        Tristan Eaton
                      </Link>
                      .
                      <span>
                        Combining Eaton's stunning portraiture and layered
                        collage, each piece carries its own unique personality
                        and identity.
                      </span>
                    </span>
                    <br />
                    <span className="space-x-1">
                      <span>ICategory</span>
                      <span className="font-semibold">{"Art"}</span>
                    </span>
                  </span>
                </div>
                <div className="about-icons my-8 box-content">
                  <Tooltip target=".website" position="top">
                    Website
                  </Tooltip>
                  <i className="website cursor-pointer px-6 py-5 border-2 rounded-l-lg">
                    <FontAwesomeIcon icon={faGlobe} />
                  </i>
                  <Tooltip target=".instagram" position="top">
                    Instagram
                  </Tooltip>
                  <i className="instagram cursor-pointer px-6 py-5 border-2">
                    <FontAwesomeIcon icon={faInstagram} />
                  </i>
                  <Tooltip target=".twitter" position="top">
                    Twitter
                  </Tooltip>
                  <i className="twitter cursor-pointer px-6 py-5 border-2 rounded-r-lg">
                    <FontAwesomeIcon icon={faTwitter} />
                  </i>
                </div>
              </AccordionTab> */}
              <AccordionTab
                header={
                  <div className="flex space-x-2">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>Details</span>
                  </div>
                }
              >
                <div className="space-y-3">
                  <div className="w-full flex justify-between">
                    <span>Token</span>

                    <span className="text-blue-500 w-28 overflow-hidden text-ellipsis">
                      {nftDetail[selectedItemIndex].token}
                    </span>
                  </div>
                  <div className="w-full flex justify-between">
                    <span>Identifier</span>
                    <span className="text-blue-500 w-28 overflow-hidden text-ellipsis">
                      {nftDetail[selectedItemIndex].identifier}
                    </span>
                  </div>
                  <div className="w-full flex justify-between">
                    <span>Token Standard</span>
                    <span className="text-blue-500">{"ERC-721"}</span>
                  </div>
                  <div className="w-full flex justify-between">
                    <span>Chain</span>
                    <span className="text-blue-500">{"Ethereum"}</span>
                  </div>
                </div>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
        <div id="right-side" className="col-span-3">
          <div className="flex justify-between"></div>
          <h1 className="h-14 text-4xl flex items-center font-semibold mt-2 mb-1">
            {nftDetail[selectedItemIndex].name.toUpperCase()}
          </h1>
          <h2 className="text-lg flex justify-start items-center space-x-1">
            <span>Owned by</span>
            <Link href="/" className="text-blue-500">
              {nftDetail[selectedItemIndex].owner}
            </Link>
          </h2>
          {/* <div className="flex flex-start space-x-8 pt-5 pb-8">
          <div className="view space-x-1">
            <i>
              <FontAwesomeIcon icon={faEye} />
            </i>
            <span>{100}</span>
            <span>views</span>
          </div>
          <div className="favorite space-x-1">
            <i>
              <FontAwesomeIcon icon={faHeart} />
            </i>
            <span>{12}</span>
            <span>favorites</span>
          </div>
          <div className="category space-x-1">
            <i className="">
              <FontAwesomeIcon icon={faShapes} />
            </i>
            <span>{"Art"}</span>
          </div>
        </div> */}
          <div className="flex flex-col gap-7">
            <div className="boxes w-full border rounded-lg mt-5">
              {nftDetail[selectedItemIndex].listings &&
                moment(endTime).format() !== "Invalid date" && (
                  <div className="time-box flex flex-col border-b p-5 text-lg">
                    <div className="space-x-2 ">
                      <i>
                        <FontAwesomeIcon icon={faClock} />
                      </i>
                      <span>
                        {`Sale ends 
                  ${moment(endTime).format("MMMM Do YYYY HH:mm")}`}
                      </span>
                    </div>
                    <div className="time flex item-center space-x-14 mt-2">
                      <div className="day flex flex-col">
                        <span className="font-semibold text-2xl">
                          {endTime.getDate()}
                        </span>
                        <span>Days</span>
                      </div>
                      <div className="hour flex flex-col">
                        <span className="font-semibold text-2xl">
                          {endTime.getHours()}
                        </span>
                        <span>Hours</span>
                      </div>
                      <div className="minute flex flex-col">
                        <span className="font-semibold text-2xl">
                          {endTime.getMinutes()}
                        </span>
                        <span>Minutes</span>
                      </div>
                    </div>
                  </div>
                )}
              <div className="flex flex-col p-5 ">
                {!!nftDetail[selectedItemIndex]?.listings &&
                  !!nftDetail[0]?.listings?.[0] && (
                    <>
                      {nftDetail.length > 1 && (
                        <span className="text-md">
                          Bundle: {nftDetail.length} items
                        </span>
                      )}
                      <span className="text-md text-gray-500">
                        Current price
                      </span>
                      <div className="price flex mb-3 space-x-2">
                        <span className="text-3xl font-bold space-x-1 my-1 ">
                          <span className="price-value">
                            {nftDetail[selectedItemIndex].listings[0] && (
                              <p className="text-sm font-medium text-gray-900 uppercase">
                                {showingPrice(
                                  nftDetail[selectedItemIndex].listings[0]
                                    ?.start_price || "0"
                                )}
                                {nftDetail.length > 1 && " / 1 item"}
                              </p>
                            )}
                          </span>
                        </span>
                      </div>
                    </>
                  )}

                {canBuy(nftDetail) && (
                  <div className="flex justify-between w-full">
                    <div className="flex gap-3 justify-between">
                      {isAddedToCart ? (
                        <div
                          onClick={() =>
                            handleRemoveFromCart(
                              web3Context,
                              nftDetail[0].listings[0].order_hash
                            )
                          }
                          className="flex justify-center gap-2 w-72 bg-red-100 hover:bg-red-300 h-16 pt-4 rounded-md cursor-pointer"
                        >
                          <i
                            className="pi pi-shopping-cart text-red-600"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <div className="pl-1 pt-1 text-red-600 text-lg">
                            Remove from cart
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            handleAddToCart(
                              web3Context,
                              nftDetail[0].listings[0].order_hash,
                              1,
                              (
                                Number(nftDetail[0].listings[0]?.start_price) *
                                  nftDetail.length || 0
                              ).toString()
                            )
                          }
                          className="flex justify-center gap-2 w-72 bg-red-100 hover:bg-red-300 h-16 pt-4 rounded-md cursor-pointer"
                        >
                          <i
                            className="pi pi-cart-plus text-red-600"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <div className="pl-1 pt-1 text-red-600 text-lg">
                            Add to cart
                          </div>
                        </div>
                      )}
                      <button
                        className="w-48 bg-red-500 hover:bg-red-700 text-white h-16 rounded-md text-lg"
                        onClick={() =>
                          handleBuyToken(
                            web3Context.state.web3.myWallet,
                            web3Context.state.web3.provider,
                            nftDetail
                          )
                        }
                      >
                        Buy Now
                      </button>
                    </div>
                    <button className="w-60 bg-sky-500 hover:bg-sky-700 text-white h-16 rounded-md text-lg">
                      <i className="pi pi-tag"></i>
                      <span className="pl-2">Make offer</span>
                    </button>
                  </div>
                )}

                {canSell(nftDetail) && (
                  <div>
                    <button
                      className="w-1/2 bg-green-500 hover:bg-green-700 h-16 text-white rounded-md text-xl"
                      onClick={() => setVisible(true)}
                    >
                      Sell
                    </button>
                    <Dialog
                      header="Please input the price that you want to sell"
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
                            label="Sell"
                            icon="pi pi-check"
                            onClick={() => handleSellNFT(nftDetail)}
                            autoFocus
                          />
                        </div>
                      }
                    >
                      <div className="flex gap-3">
                        <InputNumber
                          placeholder="Input the price"
                          value={price}
                          onValueChange={(e: any) => setPrice(e.value)}
                          minFractionDigits={2}
                          maxFractionDigits={5}
                          min={0}
                        />
                        <Dropdown
                          value={selectedUnit}
                          onChange={(e) => setSelectedUnit(e.value)}
                          options={CURRENCY_UNITS}
                          optionLabel="name"
                          placeholder="Select a unit"
                          className="md:w-14rem"
                        />
                      </div>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>

            <NFTPriceHistory></NFTPriceHistory>
            <NFTListings></NFTListings>
            <NFTOffers></NFTOffers>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <NFTActivity></NFTActivity>
      </div>
    </div>
  );
};

export default NFTDetail;
