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
import { useContext } from "react";
import { AppContext } from "@Store/index";

export interface INFTCollectionGridItemProps {
  item: INFTCollectionItem;
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
}

const NFTCollectionGridItem = ({
  item,
  mode,
  viewType,
}: INFTCollectionGridItemProps) => {
  const web3Context = useContext(AppContext);
  const handleUploadNFTToMarketplace = async (tokenId: number) => {
    await uploadNFTToMarketplaceService({
      ownerAddress: web3Context.state.web3.myAddress,
      tokenId,
    });
  };

  const handleBuyToken = async (listingId: number, listingPrice: number) => {
    await buyTokenService({
      listingId,
      listingPrice,
    });
  };

  return (
    <div
      key={item.token_id}
      className="relative nft-collection-item cursor-pointer"
    >
      <Link
        href={`/detail/${item.token_id}`}
        className="block min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80"
      >
        <img
          src={
            item.imageSrc ||
            "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
          }
          alt="NFT Item"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full nft-collection-img"
        />
      </Link>
      {viewType !== COLLECTION_VIEW_TYPE.ICON_VIEW && (
        <div>
          <div className="p-4">
            <h3 className="font-bold uppercase">
              {item.token_id || "Item name"}
            </h3>
            <p className="text-sm font-medium text-gray-900 uppercase">
              {(item?.listing?.price || 0) / 1000000000} GWEI
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
            <div
              className="w-full text-white font-bold text-center flex-row-reverse flex opacity-0 nft-collection-item-bottom"
              onClick={() => handleUploadNFTToMarketplace(item.token_id)}
            >
              <button className="bg-blue-500 mr-0.5 py-2 flex-1 px-4 add-to-cart-btn rounded-bl-md">
                Sell
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTCollectionGridItem;
