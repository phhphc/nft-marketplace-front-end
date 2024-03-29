import { IOption, IDropDown, IDurationOption } from "@Interfaces/index";
import { mumbaiErc20Abi } from "./mumbaiErc20Abi";
import { sepoliaErc20Abi } from "./sepoliaErc20Abi";

export enum COLLECTION_VIEW_TYPE {
  LARGE_GRID = "LARGE_GRID",
  MEDIUM_GRID = "MEDIUM_GRID",
  ICON_VIEW = "ICON_VIEW",
  LIST = "LIST",
}

export enum COLLECTION_FILTER_TITLE {
  STATUS = "Status",
  PRICE = "Price",
  QUANTITY = "Quantity",
  RARITY_RANK = "Rarity Rank",
  CURRENCY = "Currency",
}

export enum QUANTITY_FILTER_NAME {
  ALL_ITEMS = "All items",
  SINGLE_ITEMS = "Single items",
  BUNDLES = "Bundles",
}

export enum STATUS_FILTER_NAME {
  BUY_NOW = "Buy now",
  ON_AUCTION = "On Auction",
}

export const QUANTITY_OPTIONS: IOption[] = [
  { name: QUANTITY_FILTER_NAME.ALL_ITEMS, key: QUANTITY_FILTER_NAME.ALL_ITEMS },
  {
    name: QUANTITY_FILTER_NAME.SINGLE_ITEMS,
    key: QUANTITY_FILTER_NAME.SINGLE_ITEMS,
  },
  { name: QUANTITY_FILTER_NAME.BUNDLES, key: QUANTITY_FILTER_NAME.BUNDLES },
];

export const NONE_OPTION: IOption = {
  name: "none",
  key: "none",
};

export const STATUS_OPTIONS: IOption[] = [
  { name: STATUS_FILTER_NAME.BUY_NOW, key: STATUS_FILTER_NAME.BUY_NOW },
  {
    name: STATUS_FILTER_NAME.ON_AUCTION,
    key: STATUS_FILTER_NAME.ON_AUCTION,
  },
];

export enum NFT_USER_PROFILE_TABS {
  COLLECTED = "COLLECTED",
  CREATED = "CREATED",
  FAVORITED = "FAVORITED",
}

export const NFT_USER_PROFILE_TABS_LIST = [
  NFT_USER_PROFILE_TABS.COLLECTED,
  NFT_USER_PROFILE_TABS.CREATED,
  NFT_USER_PROFILE_TABS.FAVORITED,
];

export const SORT_OPTIONS_CODE = {
  PRICE_LOW_TO_HIGH: "1",
  PRICE_HIGH_TO_LOW: "2",
};

export const SORT_OPTIONS: IDropDown[] = [
  { name: "Price low to high", code: SORT_OPTIONS_CODE.PRICE_LOW_TO_HIGH },
  { name: "Price high to low", code: SORT_OPTIONS_CODE.PRICE_HIGH_TO_LOW },
];

export enum NFT_COLLECTION_MODE {
  CAN_BUY = "CAN_BUY",
  CAN_SELL = "CAN_SELL",
}

export const orderType = {
  OrderComponents: [
    { name: "offerer", type: "address" },
    { name: "offer", type: "OfferItem[]" },
    { name: "consideration", type: "ConsiderationItem[]" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "salt", type: "uint256" },
    { name: "counter", type: "uint256" },
  ],
  OfferItem: [
    { name: "itemType", type: "uint8" },
    { name: "token", type: "address" },
    { name: "identifier", type: "uint256" },
    { name: "startAmount", type: "uint256" },
    { name: "endAmount", type: "uint256" },
  ],
  ConsiderationItem: [
    { name: "itemType", type: "uint8" },
    { name: "token", type: "address" },
    { name: "identifier", type: "uint256" },
    { name: "startAmount", type: "uint256" },
    { name: "endAmount", type: "uint256" },
    { name: "recipient", type: "address" },
  ],
};

export const DATA_MAPPING_SNAKIZE: any = {};

export const DATA_MAPPING_CAMELIZE: any = {
  type_number: "itemType",
  token_address: "token",
};

export const NORMAL_STRING_MAPPING: string[] = [
  "item_type",
  "type_number",
  "order_type",
  "startAmount",
  "endAmount",
  "identifier",
  "startTime",
  "endTime",
];

export const TO_NUMBER_MAPPING: any = {
  item_type: 1,
  order_type: 1,
  itemType: 1,
  startTime: 1,
};

export const TO_NUMBER_MAPPING_WITH_ITEM_TYPE: any = {
  startAmount: "0x01",
  endAmount: "0x01",
};

export const MAPPING_STRING_TO_BIG_NUMBER = [
  "endTime",
  "endAmount",
  "startAmount",
];

export const CURRENCY = {
  ETHER: "ETH",
  GWEI: "Gwei",
  WETHER: "WETH",
  MATIC: "MATIC",
  WMATIC: "WMATIC",
};

export const CURRENCY_UNITS = [
  { name: CURRENCY.ETHER, value: CURRENCY.ETHER },
  { name: CURRENCY.GWEI, value: CURRENCY.GWEI },
];

export const MUMBAI_CURRENCY_UNITS = [
  { name: CURRENCY.MATIC, value: CURRENCY.MATIC },
];

export const OFFER_CURRENCY_UNITS = [
  { name: CURRENCY.WETHER, value: CURRENCY.WETHER },
];

export const MUMBAI_OFFER_CURRENCY_UNITS = [
  { name: CURRENCY.WMATIC, value: CURRENCY.WMATIC },
];

export const CURRENCY_TRANSFER = [
  { name: CURRENCY.ETHER + " To " + CURRENCY.WETHER, value: CURRENCY.ETHER },
  { name: CURRENCY.WETHER + " To " + CURRENCY.ETHER, value: CURRENCY.WETHER },
];

export const MUMBAI_CURRENCY_TRANSFER = [
  { name: CURRENCY.MATIC + " To " + CURRENCY.WMATIC, value: CURRENCY.MATIC },
  { name: CURRENCY.WMATIC + " To " + CURRENCY.MATIC, value: CURRENCY.WMATIC },
];

export const STRING_HEX_TO_NUMBER: any = {
  itemType: 1,
};

export const NOT_ON_SALE = "NOT_ON_SALE";

export const NFT_EVENT_NAME = {
  SALE: "Sale",
  LISTING: "Listing",
  OFFER: "Offer",
  TRANSFER: "Transfer",
  MINTED: "Minted",
};

export enum DURATION_NAME {
  NONE = "None",
  START_TIME = "Start time",
  END_TIME = "End time",
  START_END_TIME = "Start - End time",
}

export const DURATION_OPTIONS: IDurationOption[] = [
  // { name: DURATION_NAME.NONE, key: DURATION_NAME.NONE },
  // { name: DURATION_NAME.START_TIME, key: DURATION_NAME.START_TIME },
  { name: DURATION_NAME.END_TIME, key: DURATION_NAME.END_TIME },
  { name: DURATION_NAME.START_END_TIME, key: DURATION_NAME.START_END_TIME },
];

export enum NOTIFICATION_INFO {
  LISTING_SOLD = "listing_sold",
  LISTING_EXPIRED = "listing_expired",
  OFFER_RECEIVED = "offer_received",
  OFFER_ACCEPTED = "offer_accepted",
  OFFER_EXPIRED = "offer_expired",
}

export const CHAIN_ID = {
  SEPOLIA: 11155111,
  MUMBAI: 80001,
};

export const SUPPORTED_NETWORK = Object.values(CHAIN_ID);

export const MKP_ADDRESS = new Map<number, string>([
  [CHAIN_ID.SEPOLIA, process.env.NEXT_PUBLIC_SEPOLIA_MKP_ADDRESS!],
  [CHAIN_ID.MUMBAI, process.env.NEXT_PUBLIC_MUMBAI_MKP_ADDRESS!],
]);

export const ERC20_ADDRESS = new Map<number, string>([
  [CHAIN_ID.SEPOLIA, process.env.NEXT_PUBLIC_SEPOLIA_ERC20_ADDRESS!],
  [CHAIN_ID.MUMBAI, process.env.NEXT_PUBLIC_MUMBAI_ERC20_ADDRESS!],
]);

export const BACKEND_URL_VERSION = new Map<number, string>([
  [CHAIN_ID.SEPOLIA, "v0.1"],
  [CHAIN_ID.MUMBAI, "v0.2"],
]);

export const CHAINID_CURRENCY = new Map<number, string>([
  [CHAIN_ID.SEPOLIA, CURRENCY.ETHER],
  [CHAIN_ID.MUMBAI, CURRENCY.MATIC],
]);

export const CHAINID_CURRENCY_UNITS = new Map<number, any>([
  [CHAIN_ID.SEPOLIA, CURRENCY_UNITS],
  [CHAIN_ID.MUMBAI, MUMBAI_CURRENCY_UNITS],
]);

export const CHAINID_CURRENCY_TRANSFER = new Map<number, any>([
  [CHAIN_ID.SEPOLIA, CURRENCY_TRANSFER],
  [CHAIN_ID.MUMBAI, MUMBAI_CURRENCY_TRANSFER],
]);

export const CHAINID_OFFER_CURRENCY_TRANSFER = new Map<number, any>([
  [CHAIN_ID.SEPOLIA, OFFER_CURRENCY_UNITS],
  [CHAIN_ID.MUMBAI, MUMBAI_OFFER_CURRENCY_UNITS],
]);

export const ERC20_NAME = new Map<number, string>([
  [CHAIN_ID.SEPOLIA, CURRENCY.WETHER],
  [CHAIN_ID.MUMBAI, CURRENCY.WMATIC],
]);

export const ERC20_ABI = new Map<number, any>([
  [CHAIN_ID.SEPOLIA, sepoliaErc20Abi],
  [CHAIN_ID.MUMBAI, mumbaiErc20Abi],
]);
