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
