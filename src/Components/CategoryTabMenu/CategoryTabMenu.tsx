import { ICategory, ICollectionItem } from "@Interfaces/index";
import { TabMenu } from "primereact/tabmenu";
import { Carousel } from "primereact/carousel";
import { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import Link from "next/link";
import moment from "moment";
import useCollectionListByCategory from "@Hooks/useCollectionListByCategory";
import { AppContext } from "@Store/index";

export interface ICollectionTabMenu {}

const CategoryTabMenu = ({}: ICollectionTabMenu) => {
  const categories: ICategory[] = [
    { label: "All", value: "All" },
    { label: "Art", value: "Art" },
    { label: "Gaming", value: "Gaming" },
    { label: "Photography", value: "Photography" },
    { label: "Memberships", value: "Memberships" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const web3Context = useContext(AppContext);

  const { collectionList, refetch } = useCollectionListByCategory(
    selectedCategory,
    web3Context.state.web3.chainId
  );
  function handleChangeActive(event: any) {
    setActiveIndex(event.index);
    setSelectedCategory(event.value.value);
  }

  useEffect(() => {
    refetch();
  }, [selectedCategory, web3Context.state.web3.chainId]);

  const categoryTemplate = (selectedCategory: ICollectionItem) => {
    return (
      <Link
        href={`/collection/${selectedCategory.name}?token=${selectedCategory.token}`}
      >
        <div className="bg-yellow-50 drop-shadow-2xl m-3 text-center py-5 px-3">
          <div className="mb-3 flex justify-center">
            <img
              src={`${
                selectedCategory.metadata.logo
                  ? selectedCategory.metadata.logo
                  : "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg"
              }`}
              alt={selectedCategory.name}
              className="shadow-2xl w-5/6 rounded-xl"
            />
          </div>
          <div>
            <h4 className="mb-1 font-medium text-2xl">
              {selectedCategory.name}
            </h4>
            <div className="mt-5">
              <Tag severity="danger" className="text-xl">
                <i className="pi pi-clock pb-2">
                  <span>
                    {" "}
                    {moment(selectedCategory.created_at).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                </i>
              </Tag>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div id="category-tab-menu">
      <div className="card">
        <TabMenu
          model={categories}
          activeIndex={activeIndex}
          onTabChange={handleChangeActive}
        />
      </div>
      {collectionList.length > 0 ? (
        <div className="card">
          <Carousel
            value={collectionList}
            numVisible={3}
            numScroll={3}
            itemTemplate={categoryTemplate}
          />
        </div>
      ) : (
        <p className="text-center mt-48 text-3xl">
          There is no collection belongs to this category to show
        </p>
      )}
    </div>
  );
};

export default CategoryTabMenu;
