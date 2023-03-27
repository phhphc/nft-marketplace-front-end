import React, { useContext, useRef, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
  ICategory,
  IBlockchain,
  IFormCollectionInput,
} from "@Interfaces/index";
import { createNFTCollectionService } from "@Services/ApiService";
import { AppContext } from "@Store/index";

const CreateCollection = () => {
  const categories: ICategory[] = [
    { categoryName: "Art", value: "Art" },
    { categoryName: "Domain names", value: "Domain" },
    { categoryName: "Gaming", value: "Gaming" },
    { categoryName: "Memberships", value: "Membership" },
    { categoryName: "Music", value: "Music" },
    { categoryName: "PFPs", value: "Pfp" },
    { categoryName: "Photography", value: "Photograph" },
    { categoryName: "Sports Collectibles", value: "Sport" },
    { categoryName: "Virtual Worlds", value: "Virtual" },
    { categoryName: "No category", value: "No" },
  ];

  const blockchains: IBlockchain[] = [
    { blockchainName: "Ethereum", value: "ethereum" },
    { blockchainName: "Polygon", value: "polygon" },
  ];

  const [logoFile, setLogoFile] = useState("");
  function handleChangeLogo(e: any) {
    setLogoFile(URL.createObjectURL(e.target.files[0]));
  }

  const [featuredFile, setFeaturedFile] = useState("");
  function handleChangeFeatured(e: any) {
    setFeaturedFile(URL.createObjectURL(e.target.files[0]));
  }

  const [bannerFile, setBannerFile] = useState("");
  function handleChangeBanner(e: any) {
    setBannerFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeLogoImage() {
    setLogoFile("");
    resetField("logoImage");
  }

  function removeFeaturedImage() {
    setFeaturedFile("");
    resetField("featuredImage");
  }

  function removeBannerImage() {
    setBannerFile("");
    resetField("bannerImage");
  }

  const web3Context = useContext(AppContext);
  const owner = web3Context.state.web3.myAddress;

  const toast = useRef<Toast>(null);

  const { register, resetField, control, handleSubmit } =
    useForm<IFormCollectionInput>();

  const onSubmit = async (data: IFormCollectionInput) => {
    await createNFTCollectionService({
      ...data,
      logoImage: data.logoImage[0],
      // featuredImage: data.featuredImage[0],
      bannerImage: data.bannerImage[0],
      owner,
      toast
    });
  };

  return (
    <div className="create-collection w-5/12 ml-auto mr-auto">
      <h1 className="text-4xl font-semibold pt-6">Create a Collection</h1>
      <div className="pt-6 pb-1 text-sm">
        <span className="text-red-500">*</span> Required fields
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-lg font-medium">Logo image *</label>
          <p>
            This image will also be used for navigation. 350 x 350 recommended.
          </p>
          <div className="flex pt-3">
            <div className="upload-logo-btn-wrapper">
              <button className="btn">
                <i className="pi pi-image text-6xl" />
              </button>
              <input
                {...register("logoImage", { required: true })}
                type="file"
                onChange={handleChangeLogo}
                accept=".jpg, .jpeg, .png"
                role="button"
              />
            </div>
            <Image src={logoFile} className="logoImage" alt="Image" preview />
            {logoFile != "" && (
              <div role="button" onClick={removeLogoImage}>
                <i className="pi pi-times" />
              </div>
            )}
          </div>
        </div>

        {/* <div className="pt-4">
          <label className="text-lg font-medium">Featured image</label>
          <p>
            This image will be used for featuring your collection on the
            homepage, category pages, or other promotional areas of OpenSea. 600
            x 400 recommended.
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
            {featuredFile != "" && (
              <div role="button" onClick={removeFeaturedImage}>
                <i className="pi pi-times" />
              </div>
            )}
          </div>
        </div> */}

        <div className="pt-4">
          <label className="text-lg font-medium">Banner image</label>
          <p>
            This image will appear at the top of your collection page. Avoid
            including too much text in this banner image, as the dimensions
            change on different devices. 1400 x 350 recommended.
          </p>
          <div className="flex pt-3">
            <div className="upload-banner-btn-wrapper">
              <button className="btn" role="button">
                <i className="pi pi-image text-6xl" />
              </button>
              <input
                {...register("bannerImage", { required: true })}
                type="file"
                onChange={handleChangeBanner}
                accept=".jpg, .jpeg, .png"
                role="button"
              />
            </div>
            <Image
              src={bannerFile}
              alt="Image"
              className="bannerImage"
              preview
            />
            {bannerFile != "" && (
              <div
                role="button"
                className="z-0 absolute times-banner"
                onClick={removeBannerImage}
              >
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

        {/* <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">URL</label>
              <p>
                Customize your URL on OpenSea. Must only contain lowercase
                letters, numbers, and hyphens.
              </p>
              <InputText
                {...field}
                placeholder="https://clover/collection/rare-colvers"
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
              <div>
                <InputTextarea {...field} className="w-full h-44" />
              </div>
            </div>
          )}
          name="desc"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Category</label>
              <Dropdown
                {...field}
                options={categories}
                optionLabel="categoryName"
                placeholder="Select a category"
                className="w-full md:w-14rem"
              />
            </div>
          )}
          name="category"
          control={control}
        />

        {/* <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Link</label>
              <div>
                <span className="p-input-icon-left w-full">
                  <i className="pi pi-globe" />
                  <InputText
                    {...field}
                    placeholder="Your site"
                    className="w-full"
                  />
                </span>
              </div>
            </div>
          )}
          name="link"
          control={control}
        /> */}

        {/* <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Blockchain</label>
              <p>
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

        <div className="card flex justify-content-center pt-4">
          <Button label="Submit" />
        </div>
      </form>
    </div>
  );
};

export default CreateCollection;
