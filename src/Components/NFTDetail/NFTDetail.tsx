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
import { useContext, useState, useEffect, useRef } from "react";
import { sellNFT, buyTokenService } from "@Services/ApiService";
import { useRouter } from "next/router";
import { WEB3_ACTION_TYPES } from "@Store/index";
import { CURRENCY_UNITS } from "@Constants/index";

export interface INFTDetailProps {
  nftDetail: INFTCollectionItem;
}

const NFTDetail = ({ nftDetail }: INFTDetailProps) => {
  const canBuy = (item: INFTCollectionItem) => {
    return (
      item.listing &&
      item.listing.seller.toLowerCase() !==
        web3Context.state.web3.myAddress.toLowerCase()
    );
  };
  const canSell = (item: INFTCollectionItem) => {
    return (
      !item.listing &&
      item.owner.toLowerCase() ===
        web3Context.state.web3.myAddress.toLowerCase()
    );
  };
  const router = useRouter();
  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const toast = useRef<Toast>(null);

  const handleSellNFT = async (tokenId: number) => {
    try {
      await sellNFT({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        tokenId,
        price: price.toString(),
        unit: selectedUnit,
      });
      toast.current &&
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Sell NFT successfully!",
          life: 3000,
        });
      router.push("/collection/collection-name-example");
    } catch (error) {
      toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to sell NFT!",
          life: 3000,
        });
    }
  };

  const handleBuyToken = async (
    myWallet: any,
    provider: any,
    order?: Order
  ) => {
    try {
      if (order) await buyTokenService({ order, myWallet, provider });
      toast.current &&
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Buy NFT successfully!",
          life: 3000,
        });
    } catch (error) {
      console.log(error);
      toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to buy NFT!",
          life: 3000,
        });
    }
  };

  const handleAddToCart = (tokenId: number, quantity: number = 1) => {
    const currCart = web3Context.state.web3.cart;
    const newCart = { ...currCart, [tokenId]: quantity };
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.CHANGE,
      payload: {
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        cart: newCart,
      },
    });
  };

  const handleRemoveFromCart = (tokenId: number, quantity: number = 1) => {
    const currCart = web3Context.state.web3.cart;
    const newCart: any = { ...currCart };
    delete newCart[[tokenId].toString()];
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.CHANGE,
      payload: {
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        cart: newCart,
      },
    });
  };

  const [visible, setVisible] = useState(false);

  const [price, setPrice] = useState<number>(0);

  const [selectedUnit, setSelectedUnit] = useState<string>("");

  useEffect(() => {
    if (nftDetail.token_id in web3Context.state.web3.cart) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [web3Context.state.web3.cart]);

  return (
    <div id="nft-detail" className="flex flex-wrap space-x-5 px-3">
      <Toast ref={toast} position="top-center" />
      <div id="left-side" className="w-5/12 h-full">
        <div
          id="image-head-bar"
          className="border rounded-t-lg flex items-center w-full justify-between h-12 px-4 text-black font-bold"
        >
          <Tooltip target=".chain" position="top">
            {"Ethereum"}
          </Tooltip>
          <i className="chain cursor-pointer">
            <FontAwesomeIcon icon={faEthereum} />
          </i>
          <div className="flex items-center space-x-2">
            <span className="text-xs">{12}</span>
            <Tooltip target=".favorite" position="top">
              Favorite
            </Tooltip>
            <i className="favorite cursor-pointer">
              <FontAwesomeIcon icon={faHeart} />
            </i>
          </div>
        </div>
        <img
          id="image"
          src={nftDetail.metadata?.image}
          alt="detail"
          className="nft-detail-img rounded-b-lg h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
        <div id="table" className="mt-5">
          <div className="table-tab border rounded-t-lg">
            <div className="table-header border-b p-5 space-x-3 font-bold">
              <FontAwesomeIcon icon={faBars} />
              <span>Description</span>
            </div>
            <div className="table-content p-5">
              {nftDetail.metadata?.description}
            </div>
          </div>
          <Accordion multiple>
            <AccordionTab
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
            </AccordionTab>

            <AccordionTab
              className="about"
              header={
                <div className="flex space-x-2">
                  <FontAwesomeIcon icon={faClipboard} />
                  <p>
                    About {nftDetail.metadata?.name.toUpperCase()} BY{" "}
                    {"AuthorName"}
                  </p>
                </div>
              }
            >
              <div className="flex space-x-3">
                <img
                  className="avatar w-6 h-6 rounded-3xl mt-2"
                  src={nftDetail.metadata?.image}
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
                      collage, each piece carries its own unique personality and
                      identity.
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
            </AccordionTab>
            <AccordionTab
              className="details"
              header={
                <div className="flex space-x-2">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <p>Details</p>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="w-full flex justify-between">
                  <span>Contract Address</span>
                  <Link
                    className="text-blue-500 w-28 overflow-hidden text-ellipsis"
                    href=""
                  >
                    <span>{nftDetail.contract_addr}</span>
                  </Link>
                </div>
                <div className="w-full flex justify-between">
                  <span>Token ID</span>
                  <Link className="text-blue-500" href="">
                    {nftDetail.token_id}
                  </Link>
                </div>
                <div className="w-full flex justify-between">
                  <span>Token Standard</span>
                  <span className="text-gray-500">ERC-721</span>
                </div>
                <div className="w-full flex justify-between">
                  <span>Chain</span>
                  <span className="text-gray-500">{"Ethereum"}</span>
                </div>
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
      <div id="right-side" className="flex-1">
        <div className="flex justify-between">
          <Link
            href="/"
            className="author h-12 flex items-center space-x-2 text-blue-500"
          >
            <span>
              {nftDetail.metadata?.name.toUpperCase()} BY {"AuthorName"}
            </span>
            <i>
              <FontAwesomeIcon icon={faCircleCheck} />
            </i>
          </Link>
          <div className="functions flex items-center space-x-8 text-xl mr-3">
            <Tooltip target=".share" position="top">
              Share
            </Tooltip>
            <i className="share cursor-pointer">
              <FontAwesomeIcon icon={faShareNodes} />
            </i>
            <Tooltip target=".more" position="top">
              More
            </Tooltip>
            <i className="more cursor-pointer">
              <FontAwesomeIcon icon={faEllipsis} />
            </i>
          </div>
        </div>
        <h1 className="name h-14 text-4xl flex items-center font-semibold mt-2 mb-1">
          {nftDetail.metadata?.name.toUpperCase()}
        </h1>
        <h2 className="owner h-9 flex justify-start items-center space-x-1">
          <span>Owned by</span>
          <Link href="/" className="text-blue-500">
            {nftDetail.listing ? nftDetail.listing.seller : nftDetail.owner}
          </Link>
        </h2>
        <div className="flex flex-start space-x-8 pt-5 pb-8">
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
        </div>
        <div className="boxes w-full border rounded-lg">
          {nftDetail.listing && (
            <div className="time-box flex flex-col border-b p-5 text-lg">
              <div className="space-x-2 ">
                <i>
                  <FontAwesomeIcon icon={faClock} />
                </i>
                <span>Sale ends {"January 20, 2023 at 8:50 AM GMT+7"}</span>
              </div>
              <div className="time flex item-center space-x-14 mt-2">
                <div className="day flex flex-col">
                  <span className="font-semibold text-2xl">{"02"}</span>
                  <span>Days</span>
                </div>
                <div className="hour flex flex-col">
                  <span className="font-semibold text-2xl">{"09"}</span>
                  <span>Hours</span>
                </div>
                <div className="minute flex flex-col">
                  <span className="font-semibold text-2xl">{"17"}</span>
                  <span>Minutes</span>
                </div>
                <div className="second flex flex-col">
                  <span className="font-semibold text-2xl">{"02"}</span>
                  <span>Seconds</span>
                </div>
              </div>
            </div>
          )}
          <div className="buy-box flex flex-col p-5 ">
            {!!nftDetail?.listing && (
              <>
                <span className="text-md text-gray-500">Current price</span>
                <div className="price flex mb-3 space-x-2">
                  <span className="text-3xl font-bold space-x-1 my-1 ">
                    <span className="price-value">
                      {(nftDetail?.listing?.price || 0) / 1000000000 <
                      1000000000
                        ? `${
                            (nftDetail?.listing?.price || 0) / 1000000000
                          } GWEI`
                        : `${
                            (nftDetail?.listing?.price || 0) /
                            1000000000000000000
                          } ETH`}
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
                      onClick={() => handleRemoveFromCart(nftDetail.token_id)}
                      className="flex justify-center gap-2 w-72 bg-red-100 h-16 pt-4 rounded-md"
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
                      onClick={() => handleAddToCart(nftDetail.token_id)}
                      className="flex justify-center gap-2 w-72 bg-red-100 h-16 pt-4 rounded-md"
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
                    className="w-48 bg-red-500 text-white h-16 rounded-md text-lg"
                    onClick={() =>
                      handleBuyToken(
                        web3Context.state.web3.myWallet,
                        web3Context.state.web3.provider,
                        nftDetail.order
                      )
                    }
                  >
                    Buy Now
                  </button>
                </div>
                <button className="w-60 bg-sky-500 text-white h-16 rounded-md text-lg">
                  <i className="pi pi-tag"></i>
                  <span className="pl-2">Make offer</span>
                </button>
              </div>
            )}

            {canSell(nftDetail) && (
              <div>
                <button
                  className="w-1/2 bg-green-500 h-16 text-white rounded-md text-xl"
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
                        onClick={() => handleSellNFT(nftDetail.token_id)}
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
                      min={0.00001}
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
      </div>
    </div>
  );
};

export default NFTDetail;
