import React, { useRef, useState, useContext } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { IBlockchain, ICollection, IFormNewNFTInput } from "@Interfaces/index";
import { createNFTService } from "@Services/ApiService";
import { AppContext } from "@Store/index";

const CreateNFT = () => {
  const web3Context = useContext(AppContext);
  const collections: ICollection[] = [
    { collectionName: "Art", code: "art" },
    { collectionName: "Domain names", code: "domain" },
    { collectionName: "Gaming", code: "gaming" },
    { collectionName: "Memberships", code: "membership" },
    { collectionName: "Music", code: "music" },
    { collectionName: "PFPs", code: "pfp" },
    { collectionName: "Photography", code: "photograph" },
    { collectionName: "Sports Collectibles", code: "sport" },
    { collectionName: "Virtual Worlds", code: "virtual" },
    { collectionName: "No category", code: "no" },
  ];

  const blockchains: IBlockchain[] = [
    { blockchainName: "Ethereum", code: "ethereum" },
    { blockchainName: "Polygon", code: "polygon" },
  ];

  const [featuredFile, setFeaturedFile] = useState<string>("");
  function handleChangeFeatured(e: any) {
    setFeaturedFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeFeaturedImage() {
    setFeaturedFile("");
    resetField("featuredImage");
  }

  const { register, resetField, control, handleSubmit } =
    useForm<IFormNewNFTInput>();

  const onSubmit = async (data: IFormNewNFTInput) => {
    await createNFTService({
      ...data,
      featuredImage: data.featuredImage[0],
      collection: data.collection.value,
      blockchain: data.blockchain.value,
    });
  };

  return (
    <div className="create-collection w-1/2 ml-auto mr-auto">
      <h1 className="text-4xl font-semibold pt-6">Create New Item</h1>
      <div className="pt-6 pb-1 text-sm">
        <span className="text-red-500">*</span> Required fields
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-4">
          <label className="text-lg font-medium">
            Image, Video, Audio, or 3D Model *
          </label>
          <p className="text-gray-500">
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF. Max size: 100 MB
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
              <label className="text-lg font-medium">Name *</label>
              <div>
                <InputText
                  {...field}
                  placeholder="Example: Rare Clovers"
                  className="w-full"
                />
              </div>
            </div>
          )}
          name="name"
          control={control}
        />

        <Controller
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
        />

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Description</label>
              <p className="text-gray-500">
                The description will be included on the item's detail page
                underneath its image. Markdown syntax is supported.
              </p>
              <div>
                <InputTextarea
                  {...field}
                  className="w-full h-44"
                  placeholder="Provide a detailed description of your item"
                />
              </div>
            </div>
          )}
          name="desc"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Collection</label>
              <Dropdown
                {...field}
                options={collections}
                optionLabel="collectionName"
                placeholder="Select a collection"
                className="w-full md:w-14rem"
              />
            </div>
          )}
          name="collection"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Supply</label>
              <p className="text-gray-500">
                The number of items that can be minted. No gas cost to you!
              </p>
              <div>
                <span className="w-full">
                  <InputText {...field} placeholder="1" className="w-full" />
                </span>
              </div>
            </div>
          )}
          name="supply"
          control={control}
        />

        <Controller
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
        />

        {/* <input type="submit" /> */}
        <div className="card flex justify-content-center pt-4">
          <Button label="Submit" />
        </div>
      </form>
    </div>
  );
};

export default CreateNFT;
