import { ICollectionItem } from "@Interfaces/index";
import moment from "moment";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export interface IMyCollectionsProps {
  myCollections: ICollectionItem[];
}

const MyCollectionsList = ({ myCollections }: IMyCollectionsProps) => {
  return (
    <div id="my-collections-list" className="w-5/6 ml-auto mr-auto">
      <h1 className="text-4xl font-semibold pt-6">My Collections</h1>
      <p className="pt-6 pb-6 text-lg">
        Create, curate, and manage collections of unique NFTs to share and sell.
      </p>
      <Link href="/create-collection">
        <Button className="text-xl rounded-lg">
          Create a collection
        </Button>
      </Link>
      <div className="grid grid-cols-3 gap-7 pt-6">
        {myCollections.map((collection) => (
          <div key={collection.token}>
            <Link
              href={`/collection/${collection.name}?token=${collection.token}`}
            >
              <Card
                title={`${collection.name}`}
                footer={
                  <div>
                    <Tag severity="danger" className="text-xl">
                      <i className="pi pi-clock pb-2">
                        <span> {moment(collection.created_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
                      </i>
                    </Tag>
                  </div>
                }
                header={
                  <img
                    alt={`${collection.name}`}
                    src={`${
                      collection.metadata.banner
                        ? collection.metadata.banner
                        : "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg"
                    }`}
                    className="rounded-t-lg"
                  />
                }
              >
                <p className="m-0">{collection.metadata.description}</p>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCollectionsList;
