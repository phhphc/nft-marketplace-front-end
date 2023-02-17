import React, { useRef, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

interface IFormInput {
  logoImage: string;
  featuredImage: string;
  bannerImage: string;
  name: string;
  url: string;
  desc: string;
  category: { label: string; value: string };
  link: string;
  blockchain: { label: string; value: string };
}

interface Category {
  categoryName: string;
  code: string;
}

interface Blockchain {
  blockchainName: string;
  code: string;
}

const CreateCollection = () => {
  const categories: Category[] = [
    { categoryName: "Art", code: "art" },
    { categoryName: "Domain names", code: "domain" },
    { categoryName: "Gaming", code: "gaming" },
    { categoryName: "Memberships", code: "membership" },
    { categoryName: "Music", code: "music" },
    { categoryName: "PFPs", code: "pfp" },
    { categoryName: "Photography", code: "photograph" },
    { categoryName: "Sports Collectibles", code: "sport" },
    { categoryName: "Virtual Worlds", code: "virtual" },
    { categoryName: "No category", code: "no" },
  ];

  const blockchains: Blockchain[] = [
    { blockchainName: "Ethereum", code: "ethereum" },
    { blockchainName: "Polygon", code: "polygon" },
  ];

  const [logoFile, setLogoFile] = useState("");
  function handleChangeLogo(e: any) {
    console.log(e.target.files);
    setLogoFile(URL.createObjectURL(e.target.files[0]));
  }

  const [featuredFile, setFeaturedFile] = useState("");
  function handleChangeFeatured(e: any) {
    console.log(e.target.files);
    setFeaturedFile(URL.createObjectURL(e.target.files[0]));
  }

  const [bannerFile, setBannerFile] = useState("");
  function handleChangeBanner(e: any) {
    console.log(e.target.files);
    setBannerFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeLogoImage() {
    setLogoFile("");
  }

  function removeFeaturedImage() {
    setFeaturedFile("");
  }

  function removeBannerImage() {
    setBannerFile("");
  }

  const { control, handleSubmit } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => {
    alert(JSON.stringify(data));
  };

  return (
    <div className="create-collection w-5/12 ml-auto mr-auto">
      <h1 className="text-4xl font-semibold pt-6">Create a Collection</h1>
      <div className="pt-6 pb-1 text-sm">
        <span className="text-red-500">*</span> Required fields
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          render={({ field }) => (
            <div>
              <label className="text-lg font-medium">Logo image *</label>
              <p>
                This image will also be used for navigation. 350 x 350
                recommended.
              </p>
              <div className="flex pt-3">
                <div className="upload-logo-btn-wrapper">
                  <button className="btn">
                    <i className="pi pi-image text-6xl" />
                  </button>
                  <input
                    {...field}
                    type="file"
                    onChange={handleChangeLogo}
                    accept=".jpg, .jpeg, .png"
                    role="button"
                  />
                </div>
                <Image
                  src={logoFile}
                  className="logoImage"
                  alt="Image"
                  preview
                />
                {logoFile != "" && (
                  <div role="button" onClick={removeLogoImage}>
                    <i className="pi pi-times" />
                  </div>
                )}
              </div>
            </div>
          )}
          name="logoImage"
          control={control}
        />
        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Featured image</label>
              <p>
                This image will be used for featuring your collection on the
                homepage, category pages, or other promotional areas of OpenSea.
                600 x 400 recommended.
              </p>
              <div className="flex pt-3">
                <div className="upload-featured-btn-wrapper">
                  <button className="btn" role="button">
                    <i className="pi pi-image text-6xl" />
                  </button>
                  <input
                    {...field}
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
            </div>
          )}
          name="featuredImage"
          control={control}
        />
        <Controller
          render={({ field }) => (
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
                    {...field}
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
          )}
          name="bannerImage"
          control={control}
        />

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
        />

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

        <Controller
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
        />

        <Controller
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
        />

        {/* <input type="submit" /> */}
        <div className="card flex justify-content-center pt-4">
          <Button label="Submit" />
        </div>
      </form>
    </div>
  );
};

export default CreateCollection;
