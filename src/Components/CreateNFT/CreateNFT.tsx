import React, { useRef, useState, useContext, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { IBlockchain, ICollection, IFormNewNFTInput } from "@Interfaces/index";
import { createNFTService } from "@Services/ApiService";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { ICollectionItem } from "@Interfaces/index";

export interface ICreateNFTProps {
  collectionList: ICollectionItem[];
}

const CreateNFT = ({ collectionList }: ICreateNFTProps) => {
  const web3Context = useContext(AppContext);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [inputDesc, setInputDesc] = useState("");

  let collections: ICollectionItem[];
  if (collectionList) {
    collections = collectionList?.map((collection: ICollectionItem) => {
      return { ...collection, value: collection.token };
    });
  }

  // const blockchains: IBlockchain[] = [
  //   { blockchainName: "Ethereum", value: "ethereum" },
  //   { blockchainName: "Polygon", value: "polygon" },
  // ];

  const [featuredFile, setFeaturedFile] = useState<string>("");

  function handleChangeFeatured(e: any) {
    setFeaturedFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeFeaturedImage() {
    setFeaturedFile("");
    resetField("featuredImage");
  }

  const handleInputDesc = (e: any) => {
    setInputDesc(e.target.value);
  };

  const { register, resetField, control, handleSubmit, reset } =
    useForm<IFormNewNFTInput>();

  const onSubmit = async (data: IFormNewNFTInput) => {
    try {
      setIsSubmit(true);
      await createNFTService({
        ...data,
        featuredImage: data.featuredImage[0],
        provider: web3Context.state.web3.provider,
        myWallet: web3Context.state.web3.myWallet,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Create NFT successfully!",
          life: 5000,
        });
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to create NFT!",
          life: 5000,
        });
    } finally {
      setIsSubmit(false);
      reset();
      setFeaturedFile("");
      setInputDesc("");
    }
  };

  return (
    <div className="create-nft lg:w-1/2 ml-auto mr-auto">
      <h1 className="text-4xl font-semibold pt-6">Create NFT</h1>
      <div className="pt-6 text-sm">* Required fields</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-1">
          <label className="text-lg font-medium">* Image</label>
          <p className="text-gray-500">
            File types supported: JPG, JPEG, PNG, AVIF
          </p>
          <div className="flex pt-3">
            <div className="upload-featured-btn-wrapper">
              <button className="btn" role="button">
                <i className="pi pi-image text-6xl" />
              </button>
              <input
                {...register("featuredImage", { required: true })}
                type="file"
                onChange={handleChangeFeatured}
                accept=".jpg, .jpeg, .png"
                role="button"
              />
            </div>
            <Image
              src={featuredFile}
              alt="Image"
              className="featuredImage"
              preview
            />

            {featuredFile && (
              <div role="button" onClick={removeFeaturedImage}>
                <i className="pi pi-times" />
              </div>
            )}
          </div>
        </div>

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">* Name</label>
              <div>
                <InputText
                  {...field}
                  {...register("name", { required: true })}
                  placeholder="Example: Rare Clovers"
                  className="w-full"
                />
              </div>
            </div>
          )}
          name="name"
          control={control}
        />

        {/* <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">External link</label>
              <p className="text-gray-500">
                OpenSea will include a link to this URL on this item's detail
                page, so that users can click to learn more about it. You are
                welcome to link to your own webpage with more details.
              </p>
              <InputText
                {...field}
                placeholder="https://clover/item/rare-colvers"
                className="w-full"
              />
            </div>
          )}
          name="url"
          control={control}
        /> */}

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Description</label>
              <div className="h-40">
                <textarea
                  {...field}
                  {...register("description")}
                  value={inputDesc}
                  onChange={handleInputDesc}
                  className="w-full h-40 border border-solid border-gray-300 rounded-md p-3"
                  placeholder="Provide a detailed description of your NFT"
                ></textarea>
              </div>
            </div>
          )}
          name="description"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">* Collection</label>
              <Dropdown
                {...field}
                options={collections}
                optionLabel="name"
                placeholder="Select a collection"
                className="w-full md:w-14rem"
              />
            </div>
          )}
          name="collection"
          control={control}
        />

        {/* <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Supply</label>
              <p className="text-gray-500">
                The number of items that can be minted. No gas cost to you!
              </p>
              <div>
                <span className="w-full">
                  <InputText
                    {...field}
                    value={"1"}
                    {...register("supply", { required: true })}
                    placeholder="1"
                    className="w-full"
                  />
                </span>
              </div>
            </div>
          )}
          name="supply"
          control={control}
        /> */}

        {/* <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Blockchain</label>
              <p className="text-gray-500">
                Select the blockchain where you'd like new items from this
                collection to be added by default.
              </p>
              <Dropdown
                {...field}
                options={blockchains}
                optionLabel="blockchainName"
                placeholder="Select a blockchain"
                className="w-full md:w-14rem"
              />
            </div>
          )}
          name="blockchain"
          control={control}
        /> */}

        {/* <input type="submit" /> */}
        <div className="card flex justify-content-center pt-4">
          <Button label="Create" disabled={isSubmit} />
        </div>
      </form>
    </div>
  );
};

export default CreateNFT;
