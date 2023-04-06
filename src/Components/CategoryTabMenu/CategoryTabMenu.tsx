import { ICategory, ICollectionItem } from "@Interfaces/index";
import { TabMenu } from "primereact/tabmenu";
import { Carousel } from "primereact/carousel";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import Link from "next/link";

export interface ICollectionTabMenu {
  allCollectionList: ICollectionItem[];
}

const CategoryTabMenu = ({ allCollectionList }: ICollectionTabMenu) => {
  const categories: ICategory[] = [
    { label: "All", value: "All" },
    { label: "Art", value: "Art" },
    { label: "Gaming", value: "Gaming" },
    { label: "Photography", value: "Photography" },
    { label: "Memberships", value: "Memberships" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(allCollectionList);
  function handleChangeActive(event: any) {
    setActiveIndex(event.index);
    setSelectedCategory(filterCategory(allCollectionList, event.value.value));
  }

  useEffect(() => {
    setSelectedCategory(allCollectionList);
  }, [allCollectionList]);

  const filterCategory = (
    collectionList: ICollectionItem[],
    category: string
  ) => {
    if (category !== "All") {
      return collectionList.filter(
        (collection: ICollectionItem) => collection.category === category
      );
    } else return collectionList;
  };

  const categoryTemplate = (selectedCategory: ICollectionItem) => {
    return (
      <Link href={`/collection/${selectedCategory.name}?token=${selectedCategory.token}`}>
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
            <div className="mt-5 flex justify-between items-center gap-2">
              <Tag severity="danger" className="text-xl">
                <i className="pi pi-clock pb-2">
                  <span> {selectedCategory.created_at.toString()}</span>
                </i>
              </Tag>

              <Button
                icon="pi pi-star-fill"
                className="p-button-success p-button-rounded"
              />
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
      {selectedCategory.length > 0 ? (
        <div className="card">
          <Carousel
            value={selectedCategory}
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
