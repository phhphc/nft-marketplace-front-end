import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { INFTCollectionItem } from "@Interfaces/index";
import {
  uploadNFTToMarketplaceService,
  buyTokenService,
} from "@Services/ApiService";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { WEB3_ACTION_TYPES } from "@Store/index";

export interface INFTCollectionGridItemProps {
  item: INFTCollectionItem;
  viewType: COLLECTION_VIEW_TYPE;
  setCountFetchNftCollectionList: React.Dispatch<React.SetStateAction<number>>;
}

const NFTCollectionGridItem = ({
  item,
  viewType,
  setCountFetchNftCollectionList,
}: INFTCollectionGridItemProps) => {
  const web3Context = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const toast = useRef<Toast>(null);

  const handleUploadNFTToMarketplace = async (tokenId: number) => {
    try {
      await uploadNFTToMarketplaceService({
        ownerAddress: web3Context.state.web3.myAddress,
        tokenId,
        price: price.toString(),
        unit: selectedUnit,
      });
      setCountFetchNftCollectionList((prev) => prev + 1);
      setVisible(false);
      toast.current &&
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Sell NFT successfully!",
          life: 15000,
        });
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

  const handleBuyToken = async (listingId: number, listingPrice: Number) => {
    try {
      await buyTokenService({
        listingId,
        listingPrice,
      });
      toast.current &&
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Buy NFT successfully!",
          life: 3000,
        });
      setCountFetchNftCollectionList((prev) => prev + 1);
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
  const units = [
    { name: "Ether", value: "ether" },
    { name: "Gwei", value: "gwei" },
  ];

  useEffect(() => {
    if (item.token_id in web3Context.state.web3.cart) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [web3Context.state.web3.cart]);

  return (
    <div
      key={item.token_id}
      className="relative nft-collection-item cursor-pointer h-96"
    >
      <Toast ref={toast} position="top-center" />
      <Link
        href={{
          pathname: `/detail/${item.token_id}`,
        }}
        className="block aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none"
      >
        <img
          src={
            item.metadata?.image ||
            "https://toigingiuvedep.vn/wp-content/uploads/2021/06/hinh-anh-hoat-hinh-de-thuong-1.jpg"
          }
          alt="NFT Item"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full nft-collection-img"
        />
      </Link>
      {viewType !== COLLECTION_VIEW_TYPE.ICON_VIEW && (
        <div>
          <div className="p-4 h-28">
            <h3 className="font-bold uppercase">
              {item.metadata?.name || "Item name"}
            </h3>
            {item.listing && (
              <p className="text-sm font-medium text-gray-900 uppercase">
                {item.listing &&
                item.listing.seller.toLowerCase() !==
                  web3Context.state.web3.myAddress.toLowerCase()
                  ? (item?.listing?.price || 0) / 1000000000 < 1000000000
                    ? `${(item?.listing?.price || 0) / 1000000000} GWEI`
                    : `${(item?.listing?.price || 0) / 1000000000000000000} ETH`
                  : ""}
              </p>
            )}
          </div>
          {item.listing &&
            item.listing.seller.toLowerCase() !==
              web3Context.state.web3.myAddress.toLowerCase() && (
              <div className="w-full text-white font-bold text-center flex-row-reverse flex opacity-0 nft-collection-item-bottom">
                <>
                  <button
                    className="bg-blue-500 py-2 px-4 buy-now-btn rounded-br-md"
                    onClick={() =>
                      handleBuyToken(
                        item.listing?.listing_id || 0,
                        item.listing?.price || 0
                      )
                    }
                  >
                    <i className="fa-1x">
                      <FontAwesomeIcon icon={faBoltLightning} />
                    </i>
                    <div className="ml-4 hidden buy-now-text">Buy now</div>
                  </button>
                  {isAddedToCart ? (
                    <button
                      className="bg-blue-500 mr-0.5 py-2 flex-1 px-4 add-to-cart-btn rounded-bl-md"
                      onClick={() => handleRemoveFromCart(item.token_id)}
                    >
                      Remove from cart
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 mr-0.5 py-2 flex-1 px-4 add-to-cart-btn rounded-bl-md"
                      onClick={() => handleAddToCart(item.token_id)}
                    >
                      Add to cart
                    </button>
                  )}
                </>
              </div>
            )}
          {!item.listing &&
            item.owner.toLowerCase() ===
              web3Context.state.web3.myAddress.toLowerCase() && (
              <div className="w-full text-white font-bold text-center flex-row-reverse flex opacity-0 nft-collection-item-bottom">
                <button
                  className="bg-blue-500 mr-0.5 py-2 flex-1 px-4 add-to-cart-btn rounded-bl-md"
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
                        onClick={() =>
                          handleUploadNFTToMarketplace(item.token_id)
                        }
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
                      options={units}
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
