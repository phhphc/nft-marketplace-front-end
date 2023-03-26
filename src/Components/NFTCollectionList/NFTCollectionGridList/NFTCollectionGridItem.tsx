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

export interface INFTCollectionGridItemProps {
  item: INFTCollectionItem;
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
}

const NFTCollectionGridItem = ({
  item,
  viewType,
}: INFTCollectionGridItemProps) => {
  const { refetch } = useNFTCollectionList();
  const canBuy = (item: INFTCollectionItem) => {
    return !item.listings[0];
  };

  const [price, setPrice] = useState<number>(0);
  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const toast = useRef<Toast>(null);
  const canSell = (item: INFTCollectionItem) => {
    return item.owner === web3Context.state.web3.myAddress;
  };
  const handleSellNFT = async (item: INFTCollectionItem) => {
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
    item?: INFTCollectionItem
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
        await buyTokenService({ toast, item, myWallet, provider });
        refetch();
      }
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

  const handleAddToCart = (tokenId: string, quantity: number = 1) => {
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

  const handleRemoveFromCart = (tokenId: string, quantity: number = 1) => {
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

  const [selectedUnit, setSelectedUnit] = useState<string>("");

  useEffect(() => {
    if (item.identifier in web3Context.state.web3.cart) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [web3Context.state.web3.cart]);

  return (
    <div
      key={item.identifier}
      className="relative nft-collection-item cursor-pointer"
    >
      <Toast ref={toast} position="top-center" />
      <Link
        href={{
          pathname: `/detail/${item.identifier}`,
        }}
        className="block aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none"
      >
        <img
          src={
            item.image != "<nil>"
              ? item.image
              : "https://toigingiuvedep.vn/wp-content/uploads/2021/06/hinh-anh-hoat-hinh-de-thuong-1.jpg"
          }
          alt="NFT Item"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full nft-collection-img"
        />
      </Link>
      {viewType !== COLLECTION_VIEW_TYPE.ICON_VIEW && (
        <div>
          <div className="p-4 h-20">
            <h3 className="font-bold uppercase">
              {item.identifier || "Item name"}
            </h3>
            {item.listings && (
              <p className="text-sm font-medium text-gray-900 uppercase">
                {Number(item.listings[0]?.start_price || 0) / 1000000000 <
                1000000000
                  ? `${
                      Number(item.listings[0]?.start_price || 0) / 1000000000
                    } GWEI`
                  : `${
                      Number(item.listings[0]?.start_price || 0) /
                      1000000000000000000
                    } ETH`}
              </p>
            )}
          </div>
          {canBuy(item) && (
            <div className="flex gap-3 justify-between w-full">
              {isAddedToCart ? (
                <div
                  onClick={() => handleRemoveFromCart(item.identifier)}
                  className="flex justify-center gap-2 w-44 bg-red-200 hover:bg-red-300 h-10 pt-2 rounded-md"
                >
                  <i
                    className="pi pi-shopping-cart text-red-600"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div className="pl-1 text-red-600">Remove from cart</div>
                </div>
              ) : (
                <div
                  onClick={() => handleAddToCart(item.identifier)}
                  className="flex justify-center gap-2 w-44 bg-red-200 hover:bg-red-300 h-10 pt-2 rounded-md"
                >
                  <i
                    className="pi pi-cart-plus text-red-600"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div className="pl-1 text-red-600">Add to cart</div>
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
