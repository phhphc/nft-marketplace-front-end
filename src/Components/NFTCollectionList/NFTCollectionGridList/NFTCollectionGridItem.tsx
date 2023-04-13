import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import Link from "next/link";
import { INFTCollectionItem, Order, OrderParameters } from "@Interfaces/index";
import { sellNFT, buyTokenService } from "@Services/ApiService";
import { NFT_COLLECTION_MODE, CURRENCY_UNITS } from "@Constants/index";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { WEB3_ACTION_TYPES } from "@Store/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import {
  handleAddToCart,
  handleRemoveFromCart,
  showingPrice,
} from "@Utils/index";
import { Checkbox } from "primereact/checkbox";

export interface INFTCollectionGridItemProps {
  item: INFTCollectionItem[];
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
}

const NFTCollectionGridItem = ({
  item,
  viewType,
}: INFTCollectionGridItemProps) => {
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

  const [price, setPrice] = useState<number>(0);
  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const toast = useRef<Toast>(null);

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
      setVisible(false);
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
    item?: INFTCollectionItem[]
  ) => {
    try {
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
          detail: "Fail to buy NFT!",
          life: 3000,
        });
    }
  };

  const [visible, setVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

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
  console.log("🚀 ~ file: NFTCollectionGridItem.tsx:160 ~ checked:", checked);

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

  return (
    <div
      key={item[0].name}
      className="relative nft-collection-item cursor-pointer"
    >
      <Toast ref={toast} position="top-center" />
      <Link
        href={{
          pathname: `/detail/${item[0].identifier}`,
        }}
        className="block aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none"
      >
        <div className="relative">
          {canSell(item) && (
            <Checkbox
              onChange={onClickItemSellBundle}
              checked={checked}
              value={item[0]}
              className="absolute top-0 right-0"
            ></Checkbox>
          )}
          <img
            src={
              item[0].image != "<nil>" && item[0].image != ""
                ? item[0].image
                : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
            }
            alt="NFT Item"
            className="h-full w-full object-cover object-center lg:h-full lg:w-full nft-collection-img"
          />
        </div>
      </Link>
      {viewType !== COLLECTION_VIEW_TYPE.ICON_VIEW && (
        <div>
          <div className="p-3 h-20">
            <h3 className="font-bold uppercase break-words text-sm">
              {item[0].name || "Item name"}
            </h3>
            {item[0].listings && (
              <p className="flex gap-1 text-sm font-medium text-gray-900">
                {showingPrice(item[0].listings[0]?.start_price || "0")}
              </p>
            )}
          </div>
          {canBuy(item) && (
            <div className="flex gap-3 justify-between w-full">
              {isAddedToCart ? (
                <div
                  onClick={() =>
                    handleRemoveFromCart(
                      web3Context,
                      item[0].listings[0].order_hash
                    )
                  }
                  className="flex justify-center gap-1 w-44 bg-red-200 hover:bg-red-300 h-10 pt-2 rounded-md"
                >
                  <div className=" text-red-600 text-base">
                    Remove from cart
                  </div>
                </div>
              ) : (
                <div
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
                  className="flex justify-center gap-2 w-44 bg-red-200 hover:bg-red-300 h-10 pt-2 rounded-md"
                >
                  <i className="pi pi-cart-plus text-red-600 pt-1"></i>
                  <div className=" text-red-600 text-base">Add to cart</div>
                </div>
              )}
              <button
                className="w-20 bg-red-500 hover:bg-red-700 text-white rounded-md"
                onClick={() =>
                  handleBuyToken(
                    web3Context.state.web3.myWallet,
                    web3Context.state.web3.provider,
                    item
                  )
                }
              >
                Buy Now
              </button>
            </div>
          )}
          {canSell(item) && (
            <div>
              <button
                className="w-full bg-green-500 hover:bg-green-700 h-10 text-white rounded-md"
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
                      onClick={() => handleSellNFT(item)}
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
      )}
    </div>
  );
};

export default NFTCollectionGridItem;
