import NFTCollectionGridItem from "./NFTCollectionGridItem";
import {
  CHAINID_CURRENCY,
  COLLECTION_VIEW_TYPE,
  CHAINID_CURRENCY_UNITS,
  DURATION_NAME,
  DURATION_OPTIONS,
} from "@Constants/index";
import { INFTCollectionItem } from "@Interfaces/index";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { Paginator } from "primereact/paginator";
import { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { sellNFT } from "@Services/ApiService";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";

export interface INFTCollectionGridListProps {
  nftCollectionList: INFTCollectionItem[][];
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
  refetch: () => void;
  hideSellBundle?: boolean;
}

const NFTCollectionGridList = ({
  nftCollectionList,
  viewType,
  mode,
  refetch,
  hideSellBundle = false,
}: INFTCollectionGridListProps) => {
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("ETH");
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [durationDate, setDurationDate] = useState<Date | Date[] | null>(null);

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
    setFirst(0);
    setRows(12);
  }, [nftCollectionList]);

  const web3Context = useContext(AppContext);

  const handleSellBundle = async () => {
    if (durationDate === null) {
      return (
        web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please input the duration!",
          life: 5000,
        })
      );
    }
    if (price === 0) {
      return (
        web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "The price must be higher than 0!",
          life: 5000,
        })
      );
    }
    try {
      setVisible(false);
      if (!web3Context.state.web3.authToken) {
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please login your wallet",
            life: 5000,
          });
        return;
      }
      await sellNFT({
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        myWallet: web3Context.state.web3.myWallet,
        item: web3Context.state.web3.listItemsSellBundle,
        price: price.toString(),
        unit: selectedUnit,
        startDate: Array.isArray(durationDate)
          ? durationDate[0]
          : selectedDuration.key === DURATION_NAME.START_TIME
          ? durationDate
          : null,
        endDate: Array.isArray(durationDate)
          ? durationDate[1]
          : selectedDuration.key === DURATION_NAME.END_TIME
          ? durationDate
          : null,
        beforeApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
        },
        afterApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
        },
        chainId: web3Context.state.web3.chainId,
        authToken: web3Context.state.web3.authToken,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Sell bundle NFT successfully!",
          life: 5000,
        });
      web3Context.state.web3.listItemsSellBundle = [];
      refetch();
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
        <div>
          {web3Context.state.web3.listItemsSellBundle.length > 0 &&
            !hideSellBundle && (
              <div className="fixed bottom-0 right-0 z-10 bg-slate-100 w-full">
                <Button
                  onClick={() => setVisible(true)}
                  className="left-1/2 text-center"
                >
                  Sell as bundle
                </Button>

                <Dialog
                  header={
                    <div>
                      <p>
                        Please input the price that you want to sell as bundle
                      </p>
                      <p className="text-sm italic text-rose-500">
                        * 1{" "}
                        {CHAINID_CURRENCY.get(web3Context.state.web3.chainId)} =
                        1,000,000,000 Gwei
                      </p>
                      <p className="text-sm italic text-rose-500">
                        * If resell at a higher price, all previous orders will
                        be canceled
                      </p>
                    </div>
                  }
                  visible={visible}
                  style={{ width: "50vw", height: "24rem" }}
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
                  <div className="flex gap-3 mb-3">
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
                      options={CHAINID_CURRENCY_UNITS.get(
                        web3Context.state.web3.chainId
                      )}
                      optionLabel="name"
                      placeholder="Select a unit"
                      className="md:w-14rem"
                    />
                  </div>
                  <div className="flex gap-8 mb-2">
                    <div className="flex flex-column items-center gap-5">
                      <div className="text-xl font-bold">* Duration:</div>
                      {DURATION_OPTIONS.map((duration) => {
                        return (
                          <div key={duration.key} className="flex items-center">
                            <RadioButton
                              inputId={duration.key}
                              value={duration}
                              onChange={(e) => {
                                setSelectedDuration(e.value),
                                  setDurationDate(null);
                              }}
                              checked={selectedDuration.key === duration.key}
                            />
                            <label htmlFor={duration.key} className="ml-2">
                              {duration.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {(
                    <Calendar
                      dateFormat="dd/mm/yy"
                      minDate={new Date()}
                      value={durationDate}
                      selectionMode={
                        selectedDuration.key === DURATION_NAME.START_END_TIME
                          ? "range"
                          : "single"
                      }
                      onChange={(e: any) => {
                        setDurationDate(e.value);
                      }}
                      showTime
                      hourFormat="24"
                      showIcon
                      placeholder={
                        selectedDuration.key === DURATION_NAME.START_END_TIME
                          ? "Choose a range date"
                          : "Choose a date"
                      }
                      className="flex w-3/5"
                      touchUI
                      showButtonBar
                      hideOnDateTimeSelect
                    />
                  )}
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
                refetch={refetch}
                hideSellBundle={hideSellBundle}
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
