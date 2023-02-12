import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { INFTCollectionItem } from "@Interfaces/index";
import {
  uploadNFTToMarketplaceService,
  buyTokenService,
} from "@Services/ApiService";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { useContext, useState } from "react";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

export interface INFTCollectionGridItemProps {
  item: INFTCollectionItem;
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
  setCountFetchNftCollectionList: React.Dispatch<React.SetStateAction<number>>;
}

const NFTCollectionGridItem = ({
  item,
  mode,
  viewType,
  setCountFetchNftCollectionList,
}: INFTCollectionGridItemProps) => {
  const web3Context = useContext(AppContext);
  const handleUploadNFTToMarketplace = async (tokenId: number) => {
    try {
      await uploadNFTToMarketplaceService({
        ownerAddress: web3Context.state.web3.myAddress,
        tokenId,
        price: price.toString(),
        unit: selectedUnit,
      });
      setCountFetchNftCollectionList((prev) => prev + 1);
    } catch (error) {}
  };

  const handleBuyToken = async (listingId: number, listingPrice: Number) => {
    try {
      await buyTokenService({
        listingId,
        listingPrice,
      });
      setCountFetchNftCollectionList((prev) => prev + 1);
    } catch (error) {}
  };

  const [visible, setVisible] = useState(false);

  const [price, setPrice] = useState<number>(0);

  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const units = [
    { name: "Ether", value: "ether" },
    { name: "Gwei", value: "gwei" },
  ];

  return (
    <div
      key={item.token_id}
      className="relative nft-collection-item cursor-pointer"
    >
      <Link
        // href={`/detail?mode=${mode === NFT_COLLECTION_MODE.CAN_BUY ? 'buy' : 'sell'}/${item.token_id}`}
        href={{
          pathname: `/detail/${item.token_id}`,
          query: { mode: mode===NFT_COLLECTION_MODE.CAN_BUY ? "buy" : "sell" },
        }}
        className="block min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80"
      >
        <img
          src={
            item.metadata.image ||
            "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
          }
          alt="NFT Item"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full nft-collection-img"
        />
      </Link>
      {viewType !== COLLECTION_VIEW_TYPE.ICON_VIEW && (
        <div>
          <div className="p-4 h-28">
            <h3 className="font-bold uppercase">
              {item.metadata.name || "Item name"}
            </h3>
            <p className="text-sm font-medium text-gray-900 uppercase">
              {mode === NFT_COLLECTION_MODE.CAN_BUY
                ? (item?.listing?.price || 0) / 1000000000 < 1000000000
                  ? `${(item?.listing?.price || 0) / 1000000000} GWEI`
                  : `${(item?.listing?.price || 0) / 1000000000000000000} ETH`
                : ""}
            </p>
          </div>
          {mode === NFT_COLLECTION_MODE.CAN_BUY ? (
            <div
              className="w-full text-white font-bold text-center flex-row-reverse flex opacity-0 nft-collection-item-bottom"
              onClick={() =>
                handleBuyToken(
                  item.listing?.listing_id || 0,
                  item.listing?.price || 0
                )
              }
            >
              <button className="bg-blue-500 py-2 px-4 buy-now-btn rounded-br-md">
                <i className="fa-1x">
                  <FontAwesomeIcon icon={faBoltLightning} />
                </i>
                <div className="ml-4 hidden buy-now-text">Buy now</div>
              </button>
              <button className="bg-blue-500 mr-0.5 py-2 flex-1 px-4 add-to-cart-btn rounded-bl-md">
                Add to cart
              </button>
            </div>
          ) : (
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
