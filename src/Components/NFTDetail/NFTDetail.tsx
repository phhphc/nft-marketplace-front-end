import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faEye, faClock } from "@fortawesome/free-regular-svg-icons";
import {
    faBoltLightning,
    faShapes,
    faCheck,
    faTicketSimple,
    faShareNodes,
    faExpand,
    faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

interface ISale {
    end: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
}

export interface INFTDetail {
    imageSrc: string;
    author: string;
    name: string;
    id: string;
    owner: string;
    view: number;
    favorite: number;
    category: string;
    sale: ISale;
    priceEth: number;
    priceDol: number;
}

import { nftDetail } from "@Components/NFTDetail/mockData";

const NFTDetail = () => {
    return (
        <div id="nft-detail" className="flex flex-wrap space-x-5 px-5">
            <div className="w-2/5 h-full border rounded-lg">
                <div className="flex items-center w-full justify-between h-10 px-4 text-slate-500">
                    <i>
                        <FontAwesomeIcon icon={faEthereum} />
                    </i>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs">{nftDetail.favorite}</span>
                        <i>
                            <FontAwesomeIcon icon={faHeart} />
                        </i>
                    </div>
                </div>
                <img
                    src={nftDetail.imageSrc}
                    alt="detail"
                    className="nft-detail-img rounded-b-lg h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
            </div>
            <div className="flex-1 h-full">
                <div className="flex justify-between">
                    <h2 className="author h-10 flex items-center space-x-2 text-blue-500">
                        <span>
                            {nftDetail.name} BY {nftDetail.author}
                        </span>
                        <i>
                            <FontAwesomeIcon icon={faCheck} />
                        </i>
                    </h2>
                    <div className="functions flex items-center space-x-8 text-xl mr-3">
                        <i>
                            <FontAwesomeIcon icon={faShareNodes} />
                        </i>
                        <i>
                            <FontAwesomeIcon icon={faExpand} />
                        </i>
                        <i>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </i>
                    </div>
                </div>
                <h1 className="name h-14 text-4xl flex items-center font-semibold mt-2 mb-1">
                    {nftDetail.name} {nftDetail.id}
                </h1>
                <h2 className="owner h-9 flex justify-start items-center space-x-1">
                    <span>Owned by</span>
                    <a href="/" className="text-blue-500">
                        {nftDetail.owner}
                    </a>
                </h2>
                <div className="flex flex-start space-x-8 pt-5 pb-8">
                    <div className="view space-x-1">
                        <i className="">
                            <FontAwesomeIcon icon={faEye} />
                        </i>
                        <span>{nftDetail.view}</span>
                        <span>views</span>
                    </div>
                    <div className="favorite space-x-1">
                        <i className="">
                            <FontAwesomeIcon icon={faHeart} />
                        </i>
                        <span>{nftDetail.favorite}</span>
                        <span>favorites</span>
                    </div>
                    <div className="category space-x-1">
                        <i className="">
                            <FontAwesomeIcon icon={faShapes} />
                        </i>
                        <span>{nftDetail.category}</span>
                    </div>
                </div>
                <div className="boxes w-full border rounded-lg">
                    <div className="time-box flex flex-col border-b p-5 text-lg">
                        <div className="space-x-2 ">
                            <i>
                                <FontAwesomeIcon icon={faClock} />
                            </i>
                            <span>Sale ends {nftDetail.sale.end}</span>
                        </div>
                        <div className="time flex item-center space-x-14 mt-2">
                            <div className="day flex flex-col">
                                <span className="font-semibold text-2xl">{nftDetail.sale.day}</span>
                                <span>Days</span>
                            </div>
                            <div className="hour flex flex-col">
                                <span className="font-semibold text-2xl">{nftDetail.sale.hour}</span>
                                <span>Hours</span>
                            </div>
                            <div className="minute flex flex-col">
                                <span className="font-semibold text-2xl">{nftDetail.sale.minute}</span>
                                <span>Minutes</span>
                            </div>
                            <div className="second flex flex-col">
                                <span className="font-semibold text-2xl">{nftDetail.sale.second}</span>
                                <span>Seconds</span>
                            </div>
                        </div>
                    </div>
                    <div className="buy-box flex flex-col p-5 ">
                        <span className="text-md text-gray-500">Current price</span>
                        <div className="price flex mb-3 space-x-2">
                            <span className="text-3xl font-bold space-x-1 my-1 ">
                                <span className="price-value">{nftDetail.priceEth}</span>
                                <span>ETH</span>
                            </span>
                            <span className="flex flex-col justify-end text-gray-500 my-1">${nftDetail.priceDol}</span>
                        </div>
                        <div className="buttons h-16 flex space-x-2 font-bold">
                            <div className="w-1/2 rounded-xl text-white bg-blue-500 flex-row-reverse flex">
                                <button className="buy-now-btn w-12">
                                    <i>
                                        <FontAwesomeIcon icon={faBoltLightning} />
                                    </i>
                                    <span className="buy-now-text ml-4 hidden">Buy now</span>
                                </button>
                                <button className="add-to-cart-btn flex-1 border-r">Add to cart</button>
                            </div>
                            <button className="make-ofter-btn w-1/2 border-2 border-slate-300 rounded-xl space-x-2 text-blue-500">
                                <i>
                                    <FontAwesomeIcon icon={faTicketSimple} />
                                </i>
                                <span>Make offer</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFTDetail;
