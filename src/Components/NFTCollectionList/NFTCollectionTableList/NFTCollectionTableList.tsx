import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IListing, INFTCollectionItem } from "@Interfaces/index";
import { showingPrice } from "@Utils/index";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import {
  CHAINID_CURRENCY,
  CHAINID_CURRENCY_UNITS,
  DURATION_NAME,
  DURATION_OPTIONS,
  CHAINID_OFFER_CURRENCY_TRANSFER,
  ERC20_NAME,
} from "@Constants/index";
import {
  buyToken,
  cancelOrder,
  makeOffer,
  sellNFT,
} from "@Services/ApiService";
import { Tag } from "primereact/tag";
import { Checkbox } from "primereact/checkbox";
import { Tooltip } from "primereact/tooltip";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { handleAddToCart, handleRemoveFromCart } from "@Utils/index";

export interface INFTCollectionTableListProps {
  nftCollectionList: INFTCollectionItem[][];
  refetch: () => void;
  hideSellBundle?: boolean;
}

const NFTCollectionTableList = ({
  nftCollectionList,
  refetch,
  hideSellBundle = false,
}: INFTCollectionTableListProps) => {
  const web3Context = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [visibleBundle, setVisibleBundle] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("ETH");
  const [selectedNFTs, setSelectedNFTs] = useState<INFTCollectionItem[][]>([]);
  const [dialogMakeOffer, setDialogMakeOffer] = useState(false);
  // const [checked, setChecked] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [durationDate, setDurationDate] = useState<Date | Date[] | null>(null);

  const router = useRouter();

  useEffect(() => {
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.SET_BUNDLE,
      payload: selectedNFTs
        .map((item) => item[0])
        .filter((item: INFTCollectionItem) => item.listings.length),
    });
  }, [selectedNFTs]);

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
    } catch (error) {
      console.log(error);
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

  const handleMakeOffer = async (item: INFTCollectionItem) => {
    if (durationDate === null) {
      return (
        web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please input the end time!",
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

  const onClickItemSellBundle = (event: any) => {
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

  const canMakeOffer = (item: INFTCollectionItem[]) => {
    return item[0]?.owner !== web3Context.state.web3.myAddress;
  };

  const isSelling = (item: INFTCollectionItem[]) => {
    return (
      !canBuy(item) &&
      !canSell(item) &&
      item[0]?.owner === web3Context.state.web3.myAddress
    );
  };

  const imageBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <img
        src={
          rowData[0]?.image != "<nil>" && rowData[0]?.image != ""
            ? rowData[0].image
            : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
        }
        alt="item image"
        className="product-image"
      />
    );
  };

  const priceBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      rowData[0].listings[0] &&
      showingPrice(
        web3Context.state.web3.chainId,
        rowData[0].listings[0]?.start_price || "0",
        CHAINID_CURRENCY_UNITS.get(web3Context.state.web3.chainId)[0].value,
        true
      )
    );
  };

  const nameBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <div>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/detail/${rowData[0].identifier}`)}
        >
          {rowData.length == 1
            ? rowData[0].name || "Item name"
            : rowData.map((item) => <div>{item.name || "Item name"}</div>)}
        </a>
      </div>
    );
  };

  const ownerBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <div className="text-ellipsis overflow-hidden w-48">
        {web3Context.state.web3.myAddress === rowData[0]?.owner
          ? "You"
          : rowData[0]?.owner}
      </div>
    );
  };

  const actionBodyTemplate = (rowData: INFTCollectionItem[]) => {
    const [checked, setChecked] = useState(false);
    // const [isAddedToCart, setIsAddedToCart] = useState(false);
    // if (
    //   web3Context.state.web3.cart
    //     .map((item) => item.orderHash)
    //     .includes(rowData[0].listings[0]?.order_hash)
    // ) {
    //   setIsAddedToCart(true);
    // } else {
    //   setIsAddedToCart(false);
    // }
    if (canBuy(rowData)) {
      return (
        <div className="flex gap-3">
          <Tag
            severity="info"
            value="Make offer"
            onClick={() => setDialogMakeOffer(true)}
            className="cursor-pointer text-base hover:bg-sky-700"
          ></Tag>
          <Dialog
            header={
              <div>
                <p>Please input the price that you want to make offer</p>
                <p className="text-sm italic text-rose-500">
                  * 1 {ERC20_NAME.get(web3Context.state.web3.chainId)} = 1{" "}
                  {CHAINID_CURRENCY.get(web3Context.state.web3.chainId)}
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
                  onClick={() => handleMakeOffer(rowData[0])}
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
                  )[0].value
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
                  (duration) => duration.key === DURATION_NAME.END_TIME
                ).map((duration) => {
                  return (
                    <div key={duration.key} className="flex items-center">
                      <RadioButton
                        inputId={duration.key}
                        value={duration}
                        onChange={(e) => {
                          setSelectedDuration(e.value), setDurationDate(null);
                        }}
                        checked={true}
                      />
                      <label htmlFor={duration.key} className="ml-2">
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
          <Tag
            severity="danger"
            value="Buy now"
            onClick={() => handleBuyToken(rowData)}
            className="cursor-pointer text-base hover:bg-rose-700"
            style={{ width: "6rem" }}
          ></Tag>
          {web3Context.state.web3.cart
            .map((item) => item.orderHash)
            .includes(rowData[0].listings[0]?.order_hash) ? (
            <button
              className="w-8 h-8 bg-red-500 hover:bg-red-700 rounded-md border-white"
              onClick={() =>
                handleRemoveFromCart(
                  web3Context,
                  rowData[0].listings[0].order_hash
                )
              }
            >
              <i
                className="pi pi-shopping-cart text-white pt-1"
                style={{ fontSize: "1rem" }}
              ></i>
            </button>
          ) : (
            <button
              className="w-8 h-8 bg-red-500 hover:bg-red-700 rounded-md border-white"
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
                  rowData[0].listings[0].order_hash,
                  1,
                  (Number(rowData[0].listings[0]?.start_price) || 0).toString()
                );
              }}
            >
              <i
                className="pi pi-cart-plus text-white pt-1"
                style={{ fontSize: "1rem" }}
              ></i>
            </button>
          )}
        </div>
      );
    } else if (canSell(rowData)) {
      return (
        <div className="flex gap-5 items-center">
          <div>
            <Tag
              severity="success"
              value={canResell(rowData) ? "Resell" : "Sell"}
              onClick={() => setVisible(true)}
              className="cursor-pointer text-base hover:bg-green-700"
              style={{ width: "6rem" }}
            ></Tag>
            <Dialog
              header={
                <div>
                  <p>Please input the price that you want to sell</p>
                  <p className="text-sm italic text-rose-500">
                    * 1 {CHAINID_CURRENCY.get(web3Context.state.web3.chainId)} =
                    1,000,000,000 Gwei
                  </p>
                  <p className="text-sm italic text-rose-500">
                    * If resell at a higher price, all previous orders will be
                    canceled
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
                    onClick={() => handleSellNFT(rowData)}
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
                      <div key={duration.key} className="flex items-center">
                        <RadioButton
                          inputId={duration.key}
                          value={duration}
                          onChange={(e) => {
                            setSelectedDuration(e.value), setDurationDate(null);
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
              {
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
                  hideOnDateTimeSelect
                />
              }
            </Dialog>
          </div>
          {!hideSellBundle && !canResell(rowData) && (
            <div>
              <Checkbox
                onChange={(e: any) => {
                  setChecked(e.checked), onClickItemSellBundle(e);
                }}
                checked={checked}
                value={rowData[0]}
                className="bundle"
                data-pr-tooltip="Tick to sell bundle"
              ></Checkbox>
              <Tooltip target=".bundle" />
            </div>
          )}
          {canResell(rowData) && (
            <Tag
              severity="warning"
              value="Cancel sell"
              onClick={() => handleCancelOrder(rowData)}
              className="cursor-pointer text-base hover:bg-yellow-700"
              style={{ width: "6rem" }}
            ></Tag>
          )}
        </div>
      );
    } else if (canMakeOffer(rowData)) {
      return (
        <div>
          <Tag
            severity="info"
            value="Make offer"
            onClick={() => setDialogMakeOffer(true)}
            className="cursor-pointer text-base hover:bg-sky-700"
          ></Tag>
          <Dialog
            header={
              <div>
                <p>Please input the price that you want to make offer</p>
                <p className="text-sm italic text-rose-500">
                  * 1 {ERC20_NAME.get(web3Context.state.web3.chainId)} = 1{" "}
                  {CHAINID_CURRENCY.get(web3Context.state.web3.chainId)}
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
                  onClick={() => handleMakeOffer(rowData[0])}
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
                  )[0].value
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
                  (duration) => duration.key === DURATION_NAME.END_TIME
                ).map((duration) => {
                  return (
                    <div key={duration.key} className="flex items-center">
                      <RadioButton
                        inputId={duration.key}
                        value={duration}
                        onChange={(e) => {
                          setSelectedDuration(e.value), setDurationDate(null);
                        }}
                        checked={true}
                      />
                      <label htmlFor={duration.key} className="ml-2">
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
      );
    }
    return "";
  };

  const handleSellBundle = async () => {
    setVisibleBundle(false);
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
      await sellNFT({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item: web3Context.state.web3.listItemsSellBundle,
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
          detail: "Sell bundle NFT successfully!",
          life: 5000,
        });
      web3Context.state.web3.listItemsSellBundle = [];
      refetch();
      setVisible(false);
    } catch (error) {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to sell NFT as bundle!",
          life: 5000,
        });
    }
  };

  return (
    <>
      {nftCollectionList?.length > 0 ? (
        <>
          {web3Context.state.web3.listItemsSellBundle.length > 0 &&
            !hideSellBundle && (
              <div className="fixed bottom-0 right-0 z-10 bg-slate-200 w-full">
                <Button
                  onClick={() => setVisibleBundle(true)}
                  className="left-1/2 text-center"
                >
                  Sell as bundle
                </Button>
                <Dialog
                  header={
                    <div>
                      <p>
                        Please input the price that you want to sell as bundle
                      </p>
                      <p className="text-sm italic text-rose-500">
                        * 1{" "}
                        {CHAINID_CURRENCY.get(web3Context.state.web3.chainId)} =
                        1,000,000,000 Gwei
                      </p>
                      <p className="text-sm italic text-rose-500">
                        * If resell at a higher price, all previous orders will
                        be canceled
                      </p>
                    </div>
                  }
                  visible={visibleBundle}
                  style={{ width: "50vw", height: "24rem" }}
                  onHide={() => setVisibleBundle(false)}
                  footer={
                    <div>
                      <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => setVisibleBundle(false)}
                        className="p-button-text"
                      />
                      <Button
                        label="Sell"
                        icon="pi pi-check"
                        onClick={() => handleSellBundle()}
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
                  {
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
                      hideOnDateTimeSelect
                    />
                  }
                </Dialog>
              </div>
            )}
          <div className="nft-collection-table-list">
            <div className="datatable-templating-demo ">
              <div className="card">
                <DataTable
                  scrollable
                  value={nftCollectionList}
                  // selection={selectedNFTs}
                  // selectionMode="checkbox"
                  // onSelectionChange={(e) => {
                  //   setSelectedNFTs(e.value);
                  // }}
                  dataKey="0.identifier"
                  responsiveLayout="scroll"
                  rowHover={true}
                >
                  {/* {!hideSellBundle && (
                    <Column
                      selectionMode="multiple"
                      headerStyle={{ width: "3em" }}
                    ></Column>
                  )} */}
                  <Column
                    field="name"
                    header="Name"
                    body={nameBodyTemplate}
                    sortable
                  ></Column>
                  <Column header="Image" body={imageBodyTemplate}></Column>
                  <Column
                    field="price"
                    header="Price"
                    body={priceBodyTemplate}
                    sortable
                  ></Column>
                  <Column
                    field="owner"
                    header="Owner"
                    body={ownerBodyTemplate}
                    className="w-20"
                  ></Column>
                  <Column header="Action" body={actionBodyTemplate}></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">There is no item to display</div>
      )}
    </>
  );
};

export default NFTCollectionTableList;
