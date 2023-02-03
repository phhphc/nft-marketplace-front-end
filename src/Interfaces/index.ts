export interface IOption {
  name: string;
  key: string;
}

export interface IDropDown {
  name: string;
  code: string;
}

export interface INFTCollectionItem {
  token_id: string;
  owner: string;
  imageSrc?: string;
  name?: string;
  listing?: IListing;
}

export interface IListing {
  listing_id: number;
  price: number;
  owner: string;
}
