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

export const SORT_OPTIONS: IDropDown[] = [
  { name: "Price low to high", code: "1" },
  { name: "Price high to low", code: "2" },
];

export enum NFT_COLLECTION_MODE {
  CAN_BUY = "CAN_BUY",
  CAN_SELL = "CAN_SELL",
}

export const orderType = {
  OrderComponents: [
    { name: "offerer", type: "address" },
    { name: "zone", type: "address" },
    { name: "offer", type: "OfferItem[]" },
    { name: "consideration", type: "ConsiderationItem[]" },
    { name: "orderType", type: "uint8" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "zoneHash", type: "bytes32" },
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

export const DATA_MAPPING_SNAKIZE: any = {
  identifier: "token_id",
  itemType: "type_number",
  token: "token_address",
};

export const DATA_MAPPING_CAMELIZE: any = {
  type_number: "itemType",
  token_id: "identifier",
  token_address: "token",
};

export const NORMAL_STRING_MAPPING: string[] = [
  "type_number",
  "order_type",
  "salt",
  "startAmount",
  "endAmount",
  "totalOriginalConsiderationItems",
];

export const TO_NUMBER_MAPPING: any = {
  startAmount: 1000000000000000000,
  endAmount: 1000000000000000000,
  totalOriginalConsiderationItems: 1,
};

export const CURRENCY = {
  ETHER: "Ether",
  GWEI: "Gwei",
};

export const CURRENCY_UNITS = [
  { name: CURRENCY.ETHER, value: CURRENCY.ETHER },
  { name: CURRENCY.GWEI, value: CURRENCY.ETHER },
];
