import {
  COLLECTION_VIEW_TYPE,
  DURATION_NAME,
  DURATION_OPTIONS,
} from "@Constants/index";
import Link from "next/link";
import { INFTCollectionItem } from "@Interfaces/index";
import {
  sellNFT,
  buyToken,
  cancelOrder,
  hideNFTService,
} from "@Services/ApiService";
import { NFT_COLLECTION_MODE, CURRENCY_UNITS } from "@Constants/index";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Galleria } from "primereact/galleria";
import { WEB3_ACTION_TYPES } from "@Store/index";
import {
  handleAddToCart,
  handleRemoveFromCart,
  showingPrice,
} from "@Utils/index";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { SplitButton } from "primereact/splitbutton";
import { useRouter } from "next/router";
import { Tooltip } from "primereact/tooltip";

export interface INFTCollectionGridItemProps {
  item: INFTCollectionItem[];
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
  refetch: () => void;
  hideSellBundle?: boolean;
}

const NFTCollectionGridItem = ({
  item,
  viewType,
  refetch,
  hideSellBundle = false,
}: INFTCollectionGridItemProps) => {
  const canBuy = (item: INFTCollectionItem[]) => {
    return (
      !!item[0].listings[0] &&
      item[0].owner !== web3Context.state.web3.myAddress
    );
  };

  const canSell = (item: INFTCollectionItem[]) => {
    return item[0].owner === web3Context.state.web3.myAddress;
  };

  const canResell = (item: INFTCollectionItem[]) => {
    return (
      item[0].listings.length !== 0 &&
      item[0].owner === web3Context.state.web3.myAddress
    );
  };

  const isSelling = (item: INFTCollectionItem[]) => {
    return (
      !canBuy(item) &&
      !canSell(item) &&
      item[0].owner === web3Context.state.web3.myAddress
    );
  };

  const router = useRouter();
  const [price, setPrice] = useState<number>(0);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [durationDate, setDurationDate] = useState<Date | Date[] | null>(null);
  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
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
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Sell NFT successfully!",
          life: 5000,
        });
      refetch();
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

  const hideNFT = async (item: INFTCollectionItem[], isHidden: boolean) => {
    try {
      await hideNFTService({
        token: item[0].token,
        identifier: item[0].identifier,
        isHidden: isHidden,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: isHidden
            ? "Unpublish NFT successfully!"
            : "Publish NFT successfully!",
          life: 5000,
        });
      refetch();
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: isHidden ? "Fail to unpublish NFT!" : "Fail to publish NFT!",
          life: 5000,
        });
    }
  };

  const [visible, setVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedItemBundleIndex, setSelectedItemBundleIndex] = useState(0);

  useEffect(() => {
    if (
      web3Context.state.web3.cart
        .map((item) => item.orderHash)
        .includes(item[0].listings[0]?.order_hash)
    ) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [web3Context.state.web3.cart]);

  const [checked, setChecked] = useState(false);

  const onClickItemSellBundle = (event: any) => {
    setChecked(event.checked);
    if (event.checked) {
      web3Context.dispatch({
        type: WEB3_ACTION_TYPES.ADD_BUNDLE,
        payload: event.value,
      });
    } else {
      web3Context.dispatch({
        type: WEB3_ACTION_TYPES.REMOVE_BUNDLE,
        payload: event.value.identifier,
      });
    }
  };

  const itemTemplate = (selectedItem: INFTCollectionItem) => {
    return (
      <Link
        href={{
          pathname: `/detail/${selectedItem.identifier}`,
        }}
      >
        <img
          crossOrigin="anonymous"
          src={selectedItem.image}
          alt={selectedItem.name}
          style={{ width: "100%" }}
        />
      </Link>
    );
  };

  const thumbnailTemplate = (selectedItem: INFTCollectionItem) => {
    return <img src={selectedItem.image} alt={selectedItem.name} />;
  };

  const onSelectedBundleItem = (event: any) => {
    setSelectedItemBundleIndex(event.index);
  };

  const moreActions = [
    {
      label: "View detail",
      icon: "pi pi-external-link",
      value: "detail",
      command: () => {
        router.push(`/detail/${item[0].identifier}`);
      },
    },
    {
      label: "Download NFT",
      icon: "pi pi-download",
      value: "download",
      command: () => {
        downloadItem(item);
      },
    },
  ];

  if (item[0].isHidden) {
    moreActions.push({
      label: "Publish NFT",
      icon: "pi pi-globe",
      value: "publish",
      command: () => {
        hideNFT(item, false);
      },
    });
  }
  if (!item[0].isHidden) {
    moreActions.push({
      label: "Unpublish NFT",
      icon: "pi pi-lock",
      value: "unpublish",
      command: () => {
        hideNFT(item, true);
      },
    });
  }
  if (canResell(item)) {
    moreActions.push({
      label: "Cancel sale",
      icon: "pi pi-times",
      value: "cancelSale",
      command: () => {
        handleCancelOrder(item);
      },
    });
  }

  return (
    <div key={item[0].name} className="relative nft-collection-item">
      <div className="block aspect-w-1 aspect-h-1 w-full  rounded-md bg-gray-200 lg:aspect-none">
        <div className="relative">
          {!canResell(item) && canSell(item) && !hideSellBundle && (
            <Checkbox
              onChange={onClickItemSellBundle}
              checked={checked}
              value={item[0]}
              className="absolute top-0 right-0"
            ></Checkbox>
          )}
          {item.length == 1 ? (
            <Link
              href={{
                pathname: `/detail/${item[0].identifier}`,
              }}
            >
              <img
                crossOrigin="anonymous"
                src={
                  item[0].image != "<nil>" && item[0].image != ""
                    ? item[0].image
                    : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
                }
                alt="NFT Item"
                className="h-full w-full object-cover object-center lg:h-full lg:w-full nft-collection-img"
              />
            </Link>
          ) : (
            <div className="card">
              <Galleria
                value={item}
                numVisible={3}
                style={{ maxWidth: "640px" }}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
                activeIndex={selectedItemBundleIndex}
                onItemChange={onSelectedBundleItem}
              />
            </div>
          )}
        </div>
      </div>
      {viewType !== COLLECTION_VIEW_TYPE.ICON_VIEW && (
        <div>
          <div className="p-3 h-28">
            <div className="flex justify-between">
              {item.length == 1 ? (
                <h3 className="font-bold uppercase break-words text-sm">
                  {item[0].name || "Item name"}
                </h3>
              ) : (
                <h3 className="font-bold uppercase break-words text-sm">
                  {item[selectedItemBundleIndex].name}
                </h3>
              )}
              {item[0].owner === web3Context.state.web3.myAddress &&
                (item[0].isHidden ? (
                  <i
                    className="pi pi-lock hidden-nft"
                    data-pr-tooltip="Your NFT is unpublished"
                    data-pr-position="left"
                  ></i>
                ) : (
                  <i
                    className="pi pi-globe hidden-nft"
                    data-pr-tooltip="Your NFT is published"
                    data-pr-position="left"
                  ></i>
                ))}
              <Tooltip target=".hidden-nft" />
            </div>
            {item[0].listings && (
              <p className="flex gap-1 text-sm font-medium text-gray-900 pt-1">
                {showingPrice(item[0].listings[0]?.start_price || "0")}
              </p>
            )}
          </div>
          {/* {canBuy(item) && (
            <SplitButton
              className="w-full absolute bottom-0 left-0 right-0"
              label="Buy now"
              onClick={() => handleBuyToken(item)}
              severity="danger"
              dropdownIcon="pi pi-cart-plus"
            />
          )} */}
          {canBuy(item) && (
            <div className="flex justify-between w-full absolute bottom-0 left-0 right-0">
              <button
                className="buy-button h-12 bg-red-500 hover:bg-red-700 text-white font-bold text-base rounded-l-md border-white"
                onClick={() => handleBuyToken(item)}
              >
                Buy Now
              </button>
              {isAddedToCart ? (
                // <div
                //   onClick={() =>
                //     handleRemoveFromCart(
                //       web3Context,
                //       item[0].listings[0].order_hash
                //     )
                //   }
                //   className="flex justify-center gap-1 w-44 bg-red-200 hover:bg-red-300 h-10 pt-2 rounded-md cursor-pointer"
                // >
                //   <div className=" text-red-600 text-base">
                //     Remove from cart
                //   </div>
                // </div>
                <button
                  className="w-12 h-12 bg-red-500 hover:bg-red-700 rounded-r-md border-white"
                  onClick={() =>
                    handleRemoveFromCart(
                      web3Context,
                      item[0].listings[0].order_hash
                    )
                  }
                >
                  <i
                    className="pi pi-shopping-cart text-white pt-1"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </button>
              ) : (
                // <div
                //   onClick={() =>
                //     handleAddToCart(
                //       web3Context,
                //       item[0].listings[0].order_hash,
                //       1,
                //       (
                //         Number(item[0].listings[0]?.start_price) *
                //           item.length || 0
                //       ).toString()
                //     )
                //   }
                //   className="flex justify-center gap-2 w-44 bg-red-200 hover:bg-red-300 h-10 pt-2 rounded-md cursor-pointer"
                // >
                //   <i className="pi pi-cart-plus text-red-600 pt-1"></i>
                //   <div className=" text-red-600 text-base">Add to cart</div>
                // </div>
                <button
                  className="w-12 h-12 bg-red-500 hover:bg-red-700 rounded-r-md border-white"
                  onClick={() =>
                    handleAddToCart(
                      web3Context,
                      item[0].listings[0].order_hash,
                      1,
                      (
                        Number(item[0].listings[0]?.start_price) *
                          item.length || 0
                      ).toString()
                    )
                  }
                >
                  <i
                    className="pi pi-cart-plus text-white pt-1"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </button>
              )}
            </div>
          )}
          {canSell(item) && (
            <div className="flex">
              {/* <button
                className="w-4/5 bg-green-500 hover:bg-green-700 h-10 text-white rounded-md absolute bottom-0 left-0 right-0"
                onClick={() => setVisible(true)}
              >
                Sell
              </button> */}
              <SplitButton
                className="w-full absolute bottom-0 left-0 right-0"
                label={`${canResell(item) ? "Resell" : "Sell"}`}
                onClick={() => setVisible(true)}
                model={moreActions}
                severity="success"
                dropdownIcon="pi pi-ellipsis-h"
              />
              <Dialog
                header="Please input the price that you want to sell"
                visible={visible}
                style={{ width: "50vw", height: "22rem" }}
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
                      onClick={() => handleSellNFT(item)}
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
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.value)}
                    options={CURRENCY_UNITS}
                    optionLabel="name"
                    placeholder="Select a unit"
                    className="md:w-14rem"
                  />
                </div>
                <div className="flex gap-8 mb-2">
                  <div className="flex flex-column items-center gap-5">
                    <div className="text-xl font-bold">Duration:</div>
                    {DURATION_OPTIONS.map((duration) => {
                      return (
                        <div key={duration.key} className="flex items-center">
                          <RadioButton
                            inputId={duration.key}
                            value={duration}
                            onChange={(e) => {
                              setSelectedDuration(e.value),
                                setDurationDate(null);
                            }}
                            checked={selectedDuration.key === duration.key}
                          />
                          <label htmlFor={duration.key} className="ml-2">
                            {duration.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {selectedDuration.key !== DURATION_NAME.NONE && (
                  <Calendar
                    dateFormat="dd/mm/yy"
                    minDate={new Date()}
                    value={durationDate}
                    selectionMode={
                      selectedDuration.key === DURATION_NAME.START_END_TIME
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
                      selectedDuration.key === DURATION_NAME.START_END_TIME
                        ? "Choose a range date"
                        : "Choose a date"
                    }
                    className="flex w-3/5"
                    touchUI
                    showButtonBar
                  />
                )}
              </Dialog>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTCollectionGridItem;
