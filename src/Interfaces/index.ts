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
}

export interface INFTCollectionItem {
  token_id: number;
  owner: string;
  contract_addr: string;
  metadata?: IMetaData;
  listing?: IListing;
}

export interface IListing {
  listing_id: number;
  price: number;
  seller: string;
}

export interface IFormCollectionInput {
  logoImage: string;
  featuredImage: string;
  bannerImage: string;
  name: string;
  url: string;
  desc: string;
  category: { label: string; value: string };
  link: string;
  blockchain: { label: string; value: string };
}

export interface IFormNewNFTInput {
  featuredImage: string;
  name: string;
  url: string;
  desc: string;
  collection: { label: string; value: string };
  supply: string;
  blockchain: { label: string; value: string };
}

export interface ICategory {
  categoryName: string;
  code: string;
}

export interface IBlockchain {
  blockchainName: string;
  code: string;
}

export interface ICollection {
  collectionName: string;
  code: string;
}
