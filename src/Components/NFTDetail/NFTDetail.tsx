import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faInfoCircle, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { Accordion, AccordionTab } from "primereact/accordion";
import { INFTActivity, INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import {
  sellNFT,
  buyToken,
  makeOffer,
  cancelOrder,
} from "@Services/ApiService";
import { WEB3_ACTION_TYPES } from "@Store/index";
import {
  CURRENCY_UNITS,
  NFT_EVENT_NAME,
  OFFER_CURRENCY_UNITS,
} from "@Constants/index";
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
import NFTListing from "@Components/NFTListing/NFTListing";
import NFTOffer from "@Components/NFTOffer/NFTOffer";
import NFTPredictPrice from "@Components/NFTPredictPrice/NFTPredictPrice";

export interface INFTDetailProps {
  nftDetail: INFTCollectionItem[];
  nftActivity: INFTActivity[];
  nftActivityRefetch: () => void;
  refetch: () => void;
}

const NFTDetail = ({
  nftDetail,
  refetch,
  nftActivity,
  nftActivityRefetch,
}: INFTDetailProps) => {
  const nftListing = nftActivity.filter(
    (nft) => nft.name.toLowerCase() === NFT_EVENT_NAME.LISTING.toLowerCase()
  );
  const nftOffer = nftActivity.filter(
    (nft) => nft.name.toLowerCase() === NFT_EVENT_NAME.OFFER.toLowerCase()
  );
  const nftSale = nftActivity.filter(
    (nft) => nft.name.toLowerCase() === NFT_EVENT_NAME.SALE.toLowerCase()
  );
  const canMakeOffer = (item: INFTCollectionItem[]) => {
    return item[0].owner !== web3Context.state.web3.myAddress;
  };
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
  const canDownload = (item: INFTCollectionItem[]) => {
    return item[0].owner === web3Context.state.web3.myAddress;
  };
  const isSelling = (item: INFTCollectionItem[]) => {
    return (
      !canBuy(item) &&
      !canSell(item) &&
      item[0].owner === web3Context.state.web3.myAddress
    );
  };

  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const endTime = useMemo(() => {
    return new Date(Number(nftDetail[0]?.listings?.[0]?.end_time));
  }, []);

  const handleSellNFT = async (item: INFTCollectionItem[]) => {
    if (price === 0) {
      return (
        web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "The price must be higher than 0!",
          life: 5000,
        })
      );
    }
    try {
      setVisible(false);
      await sellNFT({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item,
        price: price.toString(),
        unit: selectedUnit,
        beforeApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
        },
        afterApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
        },
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Sell NFT successfully!",
          life: 5000,
        });
      refetch();
      nftActivityRefetch();
    } catch (error) {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to sell NFT!",
          life: 5000,
        });
    }
  };

  const handleBuyToken = async (item?: INFTCollectionItem[]) => {
    try {
      if (item) {
        await buyToken({
          orderHashes: [item[0].listings[0].order_hash],
          price: [item[0].listings[0].start_price],
          myWallet: web3Context.state.web3.myWallet,
          provider: web3Context.state.web3.provider,
        });
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Buy NFT successfully!",
            life: 5000,
          });
        refetch();
        nftActivityRefetch();
      }
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to buy NFT!",
          life: 5000,
        });
    }
  };

  const handleMakeOffer = async (item: INFTCollectionItem) => {
    if (price === 0) {
      return (
        web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "The price must be higher than 0!",
          life: 5000,
        })
      );
    }
    try {
      setDialogMakeOffer(false);
      await makeOffer({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item,
        price: price.toString(),
        unit: selectedUnit,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Make offer successfully!",
          life: 5000,
        });
      refetch();
      nftActivityRefetch();
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to make offer!",
          life: 5000,
        });
    }
  };

  const handleCancelOrder = async (item?: INFTCollectionItem[]) => {
    try {
      if (item) {
        await cancelOrder({
          orderHash: item[0].listings[0].order_hash,
          myWallet: web3Context.state.web3.myWallet,
          provider: web3Context.state.web3.provider,
          myAddress: web3Context.state.web3.myAddress,
        });
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Cancel sale successfully!",
            life: 5000,
          });
        refetch();
      }
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to cancel sale!",
          life: 5000,
        });
    }
  };

  const downloadItem = (items: INFTCollectionItem[]) => {
    items.forEach((item: INFTCollectionItem) => {
      const url = item.image;
      fetch(url, {
        mode: "cors",
      })
        .then((response) => response.blob())
        .then((blob) => {
          let blobUrl = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.download = `${item.name}`;
          a.href = blobUrl;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
    });
  };

  const [visible, setVisible] = useState(false);
  const [dialogMakeOffer, setDialogMakeOffer] = useState(false);
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
            <div>Owned by</div>
            <span className="text-blue-500">
              {nftDetail[selectedItemIndex].owner ===
              web3Context.state.web3.myAddress
                ? "You"
                : nftDetail[selectedItemIndex].owner}
            </span>
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
                        <span className="text-lg">
                          Bundle: {nftDetail.length} items
                        </span>
                      )}
                      {nftDetail[selectedItemIndex].listings[0] && (
                        <div className="flex gap-3 mb-3 text-lg">
                          <div>Price:</div>
                          <div className="font-medium text-gray-900 uppercase self-center">
                            {showingPrice(
                              nftDetail[selectedItemIndex].listings[0]
                                ?.start_price || "0"
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                {canMakeOffer(nftDetail) && (
                  <div className="mb-3">
                    <button
                      onClick={() => setDialogMakeOffer(true)}
                      className="w-full bg-sky-500 hover:bg-sky-700 text-white h-16 rounded-md text-lg"
                    >
                      <i
                        className="pi pi-tag pr-3"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                      Make offer
                    </button>

                    <Dialog
                      header={
                        <div>
                          <p>
                            Please input the price that you want to make offer
                          </p>
                          <p className="text-sm italic text-rose-500">
                            * 1 TETH = 1 ETH
                          </p>
                        </div>
                      }
                      visible={dialogMakeOffer}
                      style={{ width: "50vw" }}
                      onHide={() => setDialogMakeOffer(false)}
                      footer={
                        <div>
                          <Button
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={() => setDialogMakeOffer(false)}
                            className="p-button-text"
                          />
                          <Button
                            label="Make offer"
                            icon="pi pi-check"
                            onClick={() => handleMakeOffer(nftDetail[0])}
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
                          value={OFFER_CURRENCY_UNITS[0].value}
                          onChange={(e) => setSelectedUnit(e.value)}
                          options={OFFER_CURRENCY_UNITS}
                          optionLabel="name"
                          placeholder="Select a unit"
                          className="md:w-14rem"
                        />
                      </div>
                    </Dialog>
                  </div>
                )}

                {canBuy(nftDetail) && (
                  <div>
                    <div className="flex gap-3">
                      {isAddedToCart ? (
                        <button
                          onClick={() =>
                            handleRemoveFromCart(
                              web3Context,
                              nftDetail[0].listings[0].order_hash
                            )
                          }
                          className="w-1/2 bg-red-100 hover:bg-red-300 h-16 rounded-md text-xl text-red-600"
                        >
                          <i
                            className="pi pi-shopping-cart text-red-600 pr-3"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          Remove from cart
                        </button>
                      ) : (
                        <button
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
                          className="w-1/2 bg-red-100 hover:bg-red-300 h-16 rounded-md text-lg text-red-600"
                        >
                          <i
                            className="pi pi-cart-plus text-red-600 pr-3"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          Add to cart
                        </button>
                      )}
                      <button
                        className="w-1/2 bg-red-500 hover:bg-red-700 text-white h-16 rounded-md text-lg"
                        onClick={() => handleBuyToken(nftDetail)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}

                {canSell(nftDetail) && (
                  <div>
                    <div className="flex gap-3">
                      <button
                        className="w-1/2 bg-green-500 hover:bg-green-700 h-16 text-white rounded-md text-xl"
                        onClick={() => setVisible(true)}
                      >
                        Sell
                      </button>
                      <button
                        onClick={() => downloadItem(nftDetail)}
                        className="w-1/2 bg-fuchsia-500 hover:bg-fuchsia-600 h-16 text-white rounded-md text-xl"
                      >
                        <i className="pi pi-download pr-3"></i>
                        Download your NFT
                      </button>
                    </div>
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

                {isSelling(nftDetail) && canDownload(nftDetail) && (
                  <div>
                    <div className="flex gap-3">
                      <button
                        className="w-1/2 bg-yellow-500 hover:bg-yellow-700 h-16 text-white rounded-md text-xl"
                        onClick={() => handleCancelOrder(nftDetail)}
                      >
                        Cancel sale
                      </button>
                      <button
                        onClick={() => downloadItem(nftDetail)}
                        className="w-1/2 bg-fuchsia-500 hover:bg-fuchsia-600 h-16 text-white rounded-md text-xl"
                      >
                        <i className="pi pi-download pr-3"></i>
                        Download your NFT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <NFTPredictPrice nftListing={nftListing} nftOffer={nftOffer} />
            <NFTPriceHistory nftSale={nftSale}></NFTPriceHistory>
            <NFTListing nftListing={nftListing}></NFTListing>
            <NFTOffer nftOffer={nftOffer}></NFTOffer>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Accordion activeIndex={0}>
          <AccordionTab header="Item Activity">
            <NFTActivity nftActivity={nftActivity}></NFTActivity>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  );
};

export default NFTDetail;
