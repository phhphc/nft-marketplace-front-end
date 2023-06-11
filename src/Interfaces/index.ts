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
  isHidden: boolean;
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

export interface IDurationOption {
  name: string;
  key: string;
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
  offerToken: string;
  offerIdentifier: BigNumber;
  offerAmount: BigNumber;
  startTime: string | BigNumber | number;
  endTime: string | BigNumber | number;
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
  offer: OfferItem[];
  consideration: ConsiderationItem[];
  startTime: string | BigNumber | number;
  endTime: string | BigNumber | number;
  salt: string;
  // conduitKey: string;
};

export type OrderComponents = OrderParameters & {
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

export interface IOfferItem {
  name: string;
  token: string;
  token_id: string;
  quantity: number;
  type: string;
  price: string;
  from: string;
  order_hash: string;
  nft_image: string;
  nft_name: string;
  end_time: string;
  is_cancelled: boolean;
  is_fulfilled: boolean;
  is_expired: boolean;
  status: string;
  owner: string;
}

export interface INFTEvent {
  label: string;
  value: string;
}

export interface INFTActivity {
  name: string;
  token: string;
  token_id: string;
  quantity: number;
  type: "single" | "bundle";
  price: string;
  from: string;
  to: string;
  date: Date;
  link: string;
  nft_name: string;
  nft_image: string;
  is_cancelled: boolean;
  is_fulfilled: boolean;
}

export interface IFormEditProfileInput {
  profileImage: string;
  profileBanner: string;
  username: string;
  bio: string;
  email: string;
}

export interface IMakeOfferItem {
  owner: string;
  offerer: string;
  offererAddress: string;
  offer: OfferItem[];
  consideration: ConsiderationItem[];
  orderHash: string;
  itemName: string;
  identifier: string;
  itemImage: string;
  price: string;
  startTime: string;
  endTime: string;
  isCancelled: boolean;
  isFulfilled: boolean;
  isExpired: boolean;
  status: string;
}

export interface IMetaDataProfile {
  banner_url?: string;
  bio?: string;
  email?: string;
  image_url?: string;
}

export interface IProfile {
  address?: string;
  metadata?: IMetaDataProfile;
  username?: string;
}

export interface INotification {
  is_viewed: boolean;
  info: string;
  event_name: string;
  order_hash: string;
  address: string;
  token: string;
  token_id: string;
  quantity: number;
  type: string;
  price: string;
  from: string;
  to: string;
  date: string;
  owner: string;
  nft_image: string;
  nft_name: string;
}
