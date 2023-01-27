import { IOption } from "@Interfaces/index";

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
