import { DataTable } from "primereact/datatable";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { Column } from "primereact/column";
import { useState } from "react";
import { useRouter } from "next/router";

export interface INFTCollectionItem {
  id: string;
  imageSrc: string;
  name: string;
  price: number;
}

export interface INFTCollectionTableListProps {
  nftCollectionList: INFTCollectionItem[];
  viewType: COLLECTION_VIEW_TYPE;
}

const NFTCollectionTableList = ({
  nftCollectionList,
}: INFTCollectionTableListProps) => {
  const [selectedNFTs, setSelectedNFTs] = useState(null);
  const router = useRouter();

  const imageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={`${rowData.imageSrc}`}
        alt={rowData.imageSrc}
        className="product-image"
      />
    );
  };

  const priceBodyTemplate = (rowData: any) => {
    return rowData.price;
  };

  const nameBodyTemplate = (rowData: any) => {
    return (
      <div>
        <a style={{cursor: "pointer"}} onClick={() => router.push("/detail")}>{rowData.name}</a>
      </div>
    );
  };

  return (
    <div className="nft-collection-table-list">
      <div className="datatable-templating-demo ">
        <div className="card">
          <DataTable
            value={nftCollectionList}
            selection={selectedNFTs}
            onSelectionChange={(e) => setSelectedNFTs(e.value)}
            dataKey="id"
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
            ></Column>
            <Column field="name" header="Name" body={nameBodyTemplate}></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column
              field="price"
              header="Current Price"
              body={priceBodyTemplate}
            ></Column>
            <Column header="Best Offer"></Column>
            <Column header="Last Sale"></Column>
            <Column header="Owner"></Column>
            <Column header="Time Listed"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default NFTCollectionTableList;
