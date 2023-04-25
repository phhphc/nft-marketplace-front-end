import NFTCollectionGridItem from "./NFTCollectionGridItem";
import { COLLECTION_VIEW_TYPE, CURRENCY_UNITS } from "@Constants/index";
import { INFTCollectionItem } from "@Interfaces/index";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { Paginator } from "primereact/paginator";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { sellNFT } from "@Services/ApiService";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

export interface INFTCollectionGridListProps {
  nftCollectionList: INFTCollectionItem[][];
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
  setCountFetch?: React.Dispatch<React.SetStateAction<number>>;
}

const NFTCollectionGridList = ({
  nftCollectionList,
  viewType,
  mode,
  setCountFetch,
}: INFTCollectionGridListProps) => {
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const toast = useRef<Toast>(null);

  const size = 12;
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [items, setItems] = useState<INFTCollectionItem[][]>([]);

  const onPageChange = (event: any) => {
    setItems(
      nftCollectionList.slice(event.page * size, event.page * size + size)
    );
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    setItems(nftCollectionList.slice(0, size));
  }, [nftCollectionList]);

  const web3Context = useContext(AppContext);

  const handleSellBundle = async () => {
    try {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
      setVisible(false);
      await sellNFT({
        toast,
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item: web3Context.state.web3.listItemsSellBundle,
        price: price.toString(),
        unit: selectedUnit,
        isApprovedForAllNFTs: web3Context.state.web3.isApprovedForAllNFTs,
      });
      web3Context.dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          isApprovedForAllNFTs: true,
        },
      });
      setCountFetch && setCountFetch((prev) => prev + 1);
    } catch (error) {
      toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to sell NFT as bundle!",
          life: 3000,
        });
    } finally {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
    }
  };

  return (
    <>
      {nftCollectionList?.length > 0 ? (
        <div>
          {web3Context.state.web3.listItemsSellBundle.length > 0 && (
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

          <div
            className={`grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:gap-x-8 col-span-4 nft-collection-grid-list ${
              viewType === COLLECTION_VIEW_TYPE.LARGE_GRID
                ? "lg:grid-cols-4"
                : "lg:grid-cols-3"
            }`}
          >
            {items.map((item) => (
              <NFTCollectionGridItem
                key={item[0].name}
                item={item}
                viewType={viewType}
                mode={mode}
                setCountFetch={setCountFetch}
              />
            ))}
          </div>
          <div className="card pt-12">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={nftCollectionList.length}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      ) : (
        <div className="text-center">There is no item to display</div>
      )}
    </>
  );
};

export default NFTCollectionGridList;
