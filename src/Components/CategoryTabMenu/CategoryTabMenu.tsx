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

  const products = [
    {
      token: "1",
      name: "LoL 1",
      description:
        "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform.",
      image:
        "https://i.seadn.io/gcs/files/7ed181433ee09174f09a0e31b563d313.png?auto=format&w=256",
    },
    {
      token: "2",
      name: "LoL 2",
      description:
        "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform.",
      image:
        "https://i.seadn.io/gcs/files/3c09e6238b3031aa57737e8cb6a03189.png?auto=format&w=256",
    },
    {
      token: "3",
      name: "LoL 3",
      description:
        "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform.",
      image:
        "https://i.seadn.io/gcs/files/a2a810c40338c7c7415a0b3162d5b4c9.gif?auto=format&w=256",
    },
    {
      token: "4",
      name: "LoL 4",
      description:
        "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform.",
      image:
        "https://i.seadn.io/gcs/files/8c7b672833142c9a4c93cc1c48212632.jpg?auto=format&w=500&h=500",
    },
    {
      token: "5",
      name: "LoL 5",
      description:
        "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform.",
      image:
        "https://i.seadn.io/gae/cZ0lurTxSFfA6lZ_5670kU-GB_okeuTv1QSxCWWF_A0goQOGnRxZvVIOnHl3Rkfeqq-Gdmn0CZbcR7_N_UYM00gJD3w7nCwEU0Ns8yY?auto=format&w=500&h=500",
    },
  ];

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
      <Link href="/">
        <div className="bg-yellow-50 drop-shadow-2xl m-3 text-center py-5 px-3">
          <div className="mb-3 flex justify-center">
            <img
              src={`${
                selectedCategory.image
                  ? selectedCategory.image
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
    <div>
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
