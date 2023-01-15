import { INFTCollectionItem } from "./NFTCollectionGridList";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";

export interface INFTCollectionGridItemProps {
  item: INFTCollectionItem;
  viewType: COLLECTION_VIEW_TYPE;
}

const NFTCollectionGridItem = ({
  item,
  viewType,
}: INFTCollectionGridItemProps) => {
  return (
    <div key={item.id} className="relative nft-collection-item cursor-pointer">
      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
        <img
          src={item.imageSrc}
          alt="NFT Item"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full nft-collection-img"
        />
      </div>
      {viewType !== COLLECTION_VIEW_TYPE.ICON_VIEW && (
        <div>
          <div className="p-4">
            <h3 className="font-bold uppercase">{item.name}</h3>
            <p className="text-sm font-medium text-gray-900 uppercase">
              {item.price} ETH
            </p>
          </div>
          <div className="w-full text-white font-bold text-center flex-row-reverse flex opacity-0 nft-collection-item-bottom">
            <button className="bg-blue-500 py-2 px-4 buy-now-btn rounded-br-md">
              <i className="fa-1x">
                <FontAwesomeIcon icon={faBoltLightning} />
              </i>
              <span className="ml-4 hidden buy-now-text">Buy now</span>
            </button>
            <button className="bg-blue-500 mr-0.5 py-2 flex-1 px-4 add-to-cart-btn rounded-bl-md">
              Add to cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTCollectionGridItem;
