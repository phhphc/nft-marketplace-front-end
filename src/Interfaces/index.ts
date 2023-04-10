export interface IOption {
  name: string;
  key: string;
}

export interface IDropDown {
  name: string;
  code: string;
}

export interface IMetaData {
  name: string;
  description: string;
  image: string;
  logo: string;
  banner: string;
}

export interface INFTCollectionItem {
  identifier: string;
  owner: string;
  token: string;
  name: string;
  description: string;
  image: string;
  listings: IListing[];
}

export interface IListing {
  order_hash: string;
  item_type: number;
  start_price: string;
  end_price: string;
  start_time: string;
  end_time: string;
}

export interface IFormCollectionInput {
  logoImage: string;
  featuredImage: string;
  bannerImage: string;
  name: string;
  url: string;
  description: string;
  category: string;
  link: string;
  blockchain: string;
}

export interface IFormNewNFTInput {
  featuredImage: string;
  name: string;
  url: string;
  description: string;
  collection: string;
  supply: string;
  blockchain: string;
}

export interface ICategory {
  label: string;
  value: string;
}

export interface IBlockchain {
  blockchainName: string;
  value: string;
}

export interface ICollection {
  collectionName: string;
  value: string;
}

import type { BigNumber } from "ethers";

export type AdditionalRecipient = {
  amount: BigNumber;
  recipient: string;
};

export type FulfillmentComponent = {
  orderIndex: number;
  itemIndex: number;
};

export type Fulfillment = {
  offerComponents: FulfillmentComponent[];
  considerationComponents: FulfillmentComponent[];
};

export type CriteriaResolver = {
  orderIndex: number;
  side: 0 | 1;
  index: number;
  identifier: BigNumber;
  criteriaProof: string[];
};

export type BasicOrderParameters = {
  considerationToken: string;
  considerationIdentifier: BigNumber;
  considerationAmount: BigNumber;
  offerer: string;
  zone: string;
  offerToken: string;
  offerIdentifier: BigNumber;
  offerAmount: BigNumber;
  basicOrderType: number;
  startTime: string | BigNumber | number;
  endTime: string | BigNumber | number;
  zoneHash: string;
  salt: string;
  offererConduitKey: string;
  fulfillerConduitKey: string;
  totalOriginalAdditionalRecipients: BigNumber;
  additionalRecipients: AdditionalRecipient[];
  signature: string;
};

export type OfferItem = {
  itemType: number;
  token: string;
  identifier: BigNumber | string;
  startAmount: BigNumber;
  endAmount: BigNumber;
};
export type ConsiderationItem = {
  itemType: number;
  token: string;
  identifier: BigNumber;
  startAmount: BigNumber;
  endAmount: BigNumber;
  recipient: string;
};

export type OrderParameters = {
  offerer: string;
  zone: string;
  offer: OfferItem[];
  consideration: ConsiderationItem[];
  orderType: number;
  startTime: string | BigNumber | number;
  endTime: string | BigNumber | number;
  zoneHash: string;
  salt: string;
  // conduitKey: string;
  totalOriginalConsiderationItems: string | BigNumber | number;
};

export type OrderComponents = Omit<
  OrderParameters,
  "totalOriginalConsiderationItems"
> & {
  counter: BigNumber;
};

export type Order = {
  parameters: OrderParameters;
  signature: string;
};

export type AdvancedOrder = {
  parameters: OrderParameters;
  numerator: string | BigNumber | number;
  denominator: string | BigNumber | number;
  signature: string;
  extraData: string;
};

export type BulkOrder = {
  tree: Array<Array<Array<Array<Array<Array<Array<OrderComponents>>>>>>>;
};

export type Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

export interface ICollectionItem {
  metadata: IMetaData;
  token: string;
  owner: string;
  name: string;
  description: string;
  category: string;
  created_at: Date;
  image: string;
}
