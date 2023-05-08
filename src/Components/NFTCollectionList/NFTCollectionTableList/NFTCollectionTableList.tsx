import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { INFTCollectionItem } from "@Interfaces/index";
import { showingPrice } from "@Utils/index";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { CURRENCY_UNITS } from "@Constants/index";
import { sellNFT } from "@Services/ApiService";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";

export interface INFTCollectionTableListProps {
  nftCollectionList: INFTCollectionItem[][];
  refetch: () => void;
  hideSellBundle?: boolean;
}

const NFTCollectionTableList = ({
  nftCollectionList,
  refetch,
  hideSellBundle = false,
}: INFTCollectionTableListProps) => {
  const web3Context = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedNFTs, setSelectedNFTs] = useState<INFTCollectionItem[][]>([]);
  const router = useRouter();

  useEffect(() => {
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.SET_BUNDLE,
      payload: selectedNFTs
        .map((item) => item[0])
        .filter((item: INFTCollectionItem) => item.listings.length),
    });
  }, [selectedNFTs]);

  const canBuy = (item: INFTCollectionItem[]) => {
    return (
      !!item[0].listings[0] &&
      item[0].owner !== web3Context.state.web3.myAddress
    );
  };

  const canSell = (item: INFTCollectionItem[]) => {
    return (
      item[0].listings.length === 0 &&
      item[0].owner === web3Context.state.web3.myAddress
    );
  };

  const isSelling = (item: INFTCollectionItem[]) => {
    return (
      !canBuy(item) &&
      !canSell(item) &&
      item[0].owner === web3Context.state.web3.myAddress
    );
  };

  const imageBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <img
        src={
          rowData[0]?.image != "<nil>" && rowData[0]?.image != ""
            ? rowData[0].image
            : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
        }
        alt="item image"
        className="product-image"
      />
    );
  };

  const priceBodyTemplate = (rowData: INFTCollectionItem[]): string => {
    return rowData.length == 1
      ? showingPrice(rowData[0]?.listings[0]?.start_price || "0")
      : showingPrice(
          String(
            Number(rowData[0].listings[0]?.start_price || 0) * rowData.length
          )
        );
    // return showingPrice(rowData[0]?.listings[0]?.start_price || "0");
  };

  const nameBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <div>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/detail/${rowData[0].identifier}`)}
        >
          {rowData.length == 1
            ? rowData[0].name || "Item name"
            : rowData.map((item) => <div>{item.name || "Item name"}</div>)}
        </a>
      </div>
    );
  };

  const quantityBodyTemplate = (rowData: INFTCollectionItem[]): number => {
    return rowData.length;
  };

  const ownerBodyTemplate = (rowData: INFTCollectionItem[]): string => {
    return rowData[0]?.owner;
  };

  const statusBodyTemplate = (rowData: INFTCollectionItem[]): string => {
    if (canBuy(rowData)) {
      return "You can buy this NFT";
    } else if (canSell(rowData)) {
      return "You can sell this NFT";
    } else if (isSelling(rowData)) {
      return "Your NFT is selling";
    }
    return "";
  };

  const handleSellBundle = async () => {
    try {
      await sellNFT({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item: web3Context.state.web3.listItemsSellBundle,
        price: price.toString(),
        unit: selectedUnit,
        beforeApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
        },
        afterApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
        },
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Sell bundle NFT successfully!",
          life: 5000,
        });
      refetch();
      setVisible(false);
    } catch (error) {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to sell NFT as bundle!",
          life: 5000,
        });
    }
  };

  return (
    <>
      {nftCollectionList?.length > 0 ? (
        <>
          {web3Context.state.web3.listItemsSellBundle.length > 0 &&
            !hideSellBundle && (
              <div className="flex justify-end mb-8">
                <Button onClick={() => setVisible(true)}>Sell as bundle</Button>
                <Dialog
                  header="Please input the price that you want to sell as bundle"
                  visible={visible}
                  style={{ width: "50vw" }}
                  onHide={() => setVisible(false)}
                  footer={
                    <div>
                      <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => setVisible(false)}
                        className="p-button-text"
                      />
                      <Button
                        label="Sell"
                        icon="pi pi-check"
                        onClick={() => handleSellBundle()}
                        autoFocus
                      />
                    </div>
                  }
                >
                  <div className="flex gap-3">
                    <InputNumber
                      placeholder="Input the price"
                      value={price}
                      onValueChange={(e: any) => setPrice(e.value)}
                      minFractionDigits={2}
                      maxFractionDigits={5}
                      min={0}
                    />
                    <Dropdown
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.value)}
                      options={CURRENCY_UNITS}
                      optionLabel="name"
                      placeholder="Select a unit"
                      className="md:w-14rem"
                    />
                  </div>
                </Dialog>
              </div>
            )}
          <div className="nft-collection-table-list">
            <div className="datatable-templating-demo ">
              <div className="card">
                <DataTable
                  value={nftCollectionList}
                  selection={selectedNFTs}
                  selectionMode="checkbox"
                  onSelectionChange={(e) => {
                    setSelectedNFTs(e.value);
                  }}
                  dataKey="0.identifier"
                  responsiveLayout="scroll"
                >
                  {!hideSellBundle && (
                    <Column
                      selectionMode="multiple"
                      headerStyle={{ width: "3em" }}
                    ></Column>
                  )}
                  <Column
                    field="name"
                    header="Name"
                    body={nameBodyTemplate}
                  ></Column>
                  <Column
                    header="Quantity"
                    body={quantityBodyTemplate}
                  ></Column>
                  <Column header="Image" body={imageBodyTemplate}></Column>
                  <Column
                    field="price"
                    header="Price"
                    body={priceBodyTemplate}
                  ></Column>
                  <Column
                    field="owner"
                    header="Owner"
                    body={ownerBodyTemplate}
                  ></Column>
                  <Column
                    field="status"
                    header="Status"
                    body={statusBodyTemplate}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">There is no item to display</div>
      )}
    </>
  );
};

export default NFTCollectionTableList;
