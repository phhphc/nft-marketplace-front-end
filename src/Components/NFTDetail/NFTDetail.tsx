import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faInfoCircle, faBars } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionTab } from "primereact/accordion";
import { IListing, INFTActivity, INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useContext, useState, useEffect, useMemo } from "react";
import {
  sellNFT,
  buyToken,
  makeOffer,
  cancelOrder,
} from "@Services/ApiService";
import { WEB3_ACTION_TYPES } from "@Store/index";
import {
  CHAINID_CURRENCY,
  CHAINID_CURRENCY_UNITS,
  CHAIN_ID,
  DURATION_NAME,
  DURATION_OPTIONS,
  NFT_EVENT_NAME,
  CHAINID_OFFER_CURRENCY_TRANSFER,
  ERC20_NAME,
} from "@Constants/index";
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
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";

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
    return item[0]?.owner !== web3Context.state.web3.myAddress;
  };
  const canBuy = (item: INFTCollectionItem[]) => {
    return (
      !!item[0]?.listings[0] &&
      item[0]?.owner !== web3Context.state.web3.myAddress
    );
  };
  const canSell = (item: INFTCollectionItem[]) => {
    return item[0]?.owner === web3Context.state.web3.myAddress;
  };
  const canResell = (item: INFTCollectionItem[]) => {
    return (
      item[0]?.listings.length !== 0 &&
      item[0]?.owner === web3Context.state.web3.myAddress
    );
  };
  const canDownload = (item: INFTCollectionItem[]) => {
    return item[0]?.owner === web3Context.state.web3.myAddress;
  };

  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [durationDate, setDurationDate] = useState<Date | Date[] | null>(null);

  const endTime = useMemo(() => {
    return new Date(Number(nftDetail[0]?.listings?.[0]?.end_time) * 1000);
  }, [nftDetail[0]?.listings?.[0]?.end_time]);

  const handleSellNFT = async (item: INFTCollectionItem[]) => {
    if (durationDate === null) {
      return (
        web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please input the duration!",
          life: 5000,
        })
      );
    }
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
      if (!web3Context.state.web3.authToken) {
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please login your wallet",
            life: 5000,
          });
        return;
      }
      await sellNFT({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item,
        price: price.toString(),
        unit: selectedUnit,
        startDate: Array.isArray(durationDate)
          ? durationDate[0]
          : selectedDuration.key === DURATION_NAME.START_TIME
          ? durationDate
          : null,
        endDate: Array.isArray(durationDate)
          ? durationDate[1]
          : selectedDuration.key === DURATION_NAME.END_TIME
          ? durationDate
          : null,
        beforeApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
        },
        afterApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
        },
        chainId: web3Context.state.web3.chainId,
        authToken: web3Context.state.web3.authToken,
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
      if (!web3Context.state.web3.authToken) {
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please login your wallet",
            life: 5000,
          });
        return;
      }
      if (item) {
        await buyToken({
          orderHashes: [item[0].listings[0].order_hash],
          price: [item[0].listings[0].start_price],
          myWallet: web3Context.state.web3.myWallet,
          provider: web3Context.state.web3.provider,
          chainId: web3Context.state.web3.chainId,
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
    if (durationDate === null) {
      return (
        web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please input the duration!",
          life: 5000,
        })
      );
    }
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
      if (!web3Context.state.web3.authToken) {
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please login your wallet",
            life: 5000,
          });
        return;
      }
      await makeOffer({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item,
        price: price.toString(),
        unit: selectedUnit,
        startDate: null,
        endDate: Array.isArray(durationDate) ? null : durationDate,
        chainId: web3Context.state.web3.chainId,
        authToken: web3Context.state.web3.authToken,
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
      console.log(
        "🚀 ~ file: NFTDetail.tsx:277 ~ handleMakeOffer ~ error:",
        error
      );
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
      if (!web3Context.state.web3.authToken) {
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please login your wallet",
            life: 5000,
          });
        return;
      }
      if (item) {
        await cancelOrder({
          orderHashes: item[0].listings.map(
            (listing: IListing) => listing.order_hash
          ),
          myWallet: web3Context.state.web3.myWallet,
          provider: web3Context.state.web3.provider,
          myAddress: web3Context.state.web3.myAddress,
          chainId: web3Context.state.web3.chainId,
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
  const [selectedUnit, setSelectedUnit] = useState<string>("ETH");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    if (
      web3Context.state.web3.cart
        .map((item) => item.orderHash)
        .includes(nftDetail[0]?.listings[0]?.order_hash)
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
      <div className="lg:grid lg:grid-cols-5 lg:gap-4">
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
                {nftDetail[selectedItemIndex]?.description != "<nil>"
                  ? nftDetail[selectedItemIndex]?.description
                  : ""}
              </div>
            </div>
          </div>
        </div>
        <div id="right-side" className="col-span-3">
          <div className="flex justify-between"></div>
          <h1 className="h-14 text-4xl flex items-center font-semibold mt-2 mb-1">
            {nftDetail[selectedItemIndex]?.name.toUpperCase()}
          </h1>
          <h2 className="text-lg flex justify-start items-center space-x-1">
            <div>Owned by</div>
            <span className="text-blue-500">
              {nftDetail[selectedItemIndex]?.owner ===
              web3Context.state.web3.myAddress
                ? "You"
                : nftDetail[selectedItemIndex]?.owner}
            </span>
          </h2>
          <div className="flex flex-col gap-7">
            <div className="boxes w-full border rounded-lg mt-5">
              {nftDetail[selectedItemIndex]?.listings &&
                moment(endTime).format() !== "Invalid date" && (
                  <div className="time-box flex flex-col border-b p-5 text-lg">
                    <div className="space-x-2 ">
                      <i>
                        <FontAwesomeIcon icon={faClock} />
                      </i>
                      <span>
                        {`Sale end 
                  ${moment(endTime).format("MMMM Do YYYY HH:mm")}`}
                      </span>
                    </div>
                  </div>
                )}
              <div className="flex flex-col p-5 ">
                {!!nftDetail[selectedItemIndex]?.listings &&
                  !!nftDetail[0]?.listings?.[0] && (
                    <>
                      {nftDetail.length > 1 && (
                        <span className="text-lg">
                          Bundle: {nftDetail.length} Items
                        </span>
                      )}
                      {nftDetail[selectedItemIndex]?.listings[0] && (
                        <div className="flex gap-3 mb-3 text-lg">
                          <div>Price:</div>
                          <div className="font-medium text-gray-900 uppercase self-center">
                            {showingPrice(
                              web3Context.state.web3.chainId,
                              nftDetail[0].listings[0]?.start_price || "0",
                              CHAINID_CURRENCY_UNITS.get(
                                web3Context.state.web3.chainId
                              )[0].value,
                              true
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                {canMakeOffer(nftDetail) && (
                  <div className="flex justify-between gap-3">
                    {canBuy(nftDetail) && (
                      <div className="flex justify-between h-16 w-1/2">
                        <button
                          className="buy-button bg-red-500 hover:bg-red-700 text-white text-lg rounded-l-md border-white"
                          onClick={() => handleBuyToken(nftDetail)}
                        >
                          Buy Now
                        </button>
                        {isAddedToCart ? (
                          <button
                            className="w-16 bg-red-500 hover:bg-red-700 rounded-r-md border-white"
                            onClick={() =>
                              handleRemoveFromCart(
                                web3Context,
                                nftDetail[0].listings[0].order_hash
                              )
                            }
                          >
                            <i
                              className="pi pi-shopping-cart text-white pt-1"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </button>
                        ) : (
                          <button
                            className="w-16 bg-red-500 hover:bg-red-700 rounded-r-md border-white"
                            onClick={() => {
                              if (!web3Context.state.web3.authToken) {
                                web3Context.state.web3.toast.current &&
                                  web3Context.state.web3.toast.current.show({
                                    severity: "error",
                                    summary: "Error",
                                    detail: "Please login your wallet",
                                    life: 5000,
                                  });
                                return;
                              }
                              handleAddToCart(
                                web3Context,
                                nftDetail[0].listings[0].order_hash,
                                1,
                                (
                                  Number(
                                    nftDetail[0].listings[0]?.start_price
                                  ) || 0
                                ).toString()
                              );
                            }}
                          >
                            <i
                              className="pi pi-cart-plus text-white pt-1"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </button>
                        )}
                      </div>
                    )}

                    <div className={canBuy(nftDetail) ? "w-1/2" : "w-full"}>
                      <button
                        onClick={() => setDialogMakeOffer(true)}
                        className="w-full bg-sky-500 hover:bg-sky-700 text-white h-16 rounded-md text-lg"
                      >
                        Make offer
                      </button>

                      <Dialog
                        header={
                          <div>
                            <p>
                              Please input the price that you want to make offer
                            </p>
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
                        visible={dialogMakeOffer}
                        style={{ width: "50vw", height: "23rem" }}
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
                        <div className="flex gap-3 mb-6">
                          <InputNumber
                            placeholder="Input the price"
                            value={price}
                            onValueChange={(e: any) => setPrice(e.value)}
                            minFractionDigits={2}
                            maxFractionDigits={5}
                            min={0}
                          />
                          <Dropdown
                            value={
                              CHAINID_OFFER_CURRENCY_TRANSFER.get(
                                web3Context.state.web3.chainId
                              )?.[0].value
                            }
                            onChange={(e) => setSelectedUnit(e.value)}
                            options={CHAINID_OFFER_CURRENCY_TRANSFER.get(
                              web3Context.state.web3.chainId
                            )}
                            optionLabel="name"
                            placeholder="Select a unit"
                            className="md:w-14rem"
                          />
                        </div>
                        <div className="flex gap-8 mb-2">
                          <div className="flex flex-column items-center gap-5">
                            <div className="text-xl font-bold">* Duration:</div>
                            {DURATION_OPTIONS.filter(
                              (duration) =>
                                duration.key === DURATION_NAME.END_TIME
                            ).map((duration) => {
                              return (
                                <div
                                  key={duration.key}
                                  className="flex items-center"
                                >
                                  <RadioButton
                                    inputId={duration.key}
                                    value={duration}
                                    onChange={(e) => {
                                      setSelectedDuration(e.value),
                                        setDurationDate(null);
                                    }}
                                    checked={true}
                                  />
                                  <label
                                    htmlFor={duration.key}
                                    className="ml-2"
                                  >
                                    {duration.name}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <Calendar
                          dateFormat="dd/mm/yy"
                          minDate={new Date()}
                          value={durationDate}
                          selectionMode="single"
                          onChange={(e: any) => {
                            setDurationDate(e.value);
                          }}
                          showTime
                          hourFormat="24"
                          showIcon
                          placeholder="Choose a date"
                          className="flex w-1/2"
                          touchUI
                          showButtonBar
                          hideOnDateTimeSelect
                        />
                      </Dialog>
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
                        <i
                          className={
                            "pr-3 " +
                            (canResell(nftDetail)
                              ? "pi pi-refresh"
                              : "pi pi-tag")
                          }
                        ></i>
                        {canResell(nftDetail) ? "Resell" : "Sell"}
                      </button>
                      {canResell(nftDetail) ? (
                        <button
                          className="w-1/2 bg-yellow-500 hover:bg-yellow-700 h-16 text-white rounded-md text-xl"
                          onClick={() => handleCancelOrder(nftDetail)}
                        >
                          <i className="pi pi-times pr-3"></i>
                          Cancel sale (cancel all previous orders)
                        </button>
                      ) : (
                        <button
                          onClick={() => downloadItem(nftDetail)}
                          className="w-1/2 bg-fuchsia-500 hover:bg-fuchsia-600 h-16 text-white rounded-md text-xl"
                        >
                          <i className="pi pi-download pr-3"></i>
                          Download NFT
                        </button>
                      )}
                    </div>
                    <Dialog
                      header={
                        <div>
                          <p>Please input the price that you want to sell</p>
                          {web3Context.state.web3.chainId !==
                            CHAIN_ID.MUMBAI && (
                            <p className="text-sm italic text-rose-500">
                              * 1{" "}
                              {CHAINID_CURRENCY.get(
                                web3Context.state.web3.chainId
                              )}{" "}
                              = 1,000,000,000 Gwei
                            </p>
                          )}
                          <p className="text-sm italic text-rose-500">
                            * If resell at a higher price, all previous orders
                            will be canceled
                          </p>
                        </div>
                      }
                      visible={visible}
                      style={{ width: "50vw", height: "24rem" }}
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
                      <div className="flex gap-3 mb-3">
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
                          options={CHAINID_CURRENCY_UNITS.get(
                            web3Context.state.web3.chainId
                          )}
                          optionLabel="name"
                          placeholder="Select a unit"
                          className="md:w-14rem"
                        />
                      </div>
                      <div className="flex gap-8 mb-2">
                        <div className="flex flex-column items-center gap-5">
                          <div className="text-xl font-bold">* Duration:</div>
                          {DURATION_OPTIONS.map((duration) => {
                            return (
                              <div
                                key={duration.key}
                                className="flex items-center"
                              >
                                <RadioButton
                                  inputId={duration.key}
                                  value={duration}
                                  onChange={(e) => {
                                    setSelectedDuration(e.value),
                                      setDurationDate(null);
                                  }}
                                  checked={
                                    selectedDuration.key === duration.key
                                  }
                                />
                                <label htmlFor={duration.key} className="ml-2">
                                  {duration.name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {
                        <Calendar
                          dateFormat="dd/mm/yy"
                          minDate={new Date()}
                          value={durationDate}
                          selectionMode={
                            selectedDuration.key ===
                            DURATION_NAME.START_END_TIME
                              ? "range"
                              : "single"
                          }
                          onChange={(e: any) => {
                            setDurationDate(e.value);
                          }}
                          showTime
                          hourFormat="24"
                          showIcon
                          placeholder={
                            selectedDuration.key ===
                            DURATION_NAME.START_END_TIME
                              ? "Choose a range date"
                              : "Choose a date"
                          }
                          className="flex w-3/5"
                          touchUI
                          showButtonBar
                          hideOnDateTimeSelect
                        />
                      }
                    </Dialog>
                  </div>
                )}
                {canResell(nftDetail) && canDownload(nftDetail) && (
                  <button
                    onClick={() => downloadItem(nftDetail)}
                    className="w-full mt-5 bg-fuchsia-500 hover:bg-fuchsia-600 h-16 text-white rounded-md text-xl"
                  >
                    <i className="pi pi-download pr-3"></i>
                    Download NFT
                  </button>
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
