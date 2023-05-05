import { IOption, IDropDown } from "@Interfaces/index";

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
  ETHER: "Ether",
  GWEI: "Gwei",
  TETHER: "TEther",
};

export const CURRENCY_UNITS = [
  { name: CURRENCY.ETHER, value: CURRENCY.ETHER },
  { name: CURRENCY.GWEI, value: CURRENCY.GWEI },
];

export const OFFER_CURRENCY_UNITS = [
  { name: CURRENCY.TETHER, value: CURRENCY.TETHER },
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

export const SUPPORTED_NETWORK = [11155111];
