import { IFormEditProfileInput } from "@Interfaces/index";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const EditProfileForm = () => {
  const [profileImageFile, setProfileImageFile] = useState<string>("");
  const [profileBannerFile, setProfileBannerFile] = useState<string>("");

  function handleChangeProfileImage(e: any) {
    setProfileImageFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeProfileImage() {
    setProfileImageFile("");
    resetField("profileImage");
  }

  function handleChangeProfileBanner(e: any) {
    setProfileBannerFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeProfileBanner() {
    setProfileBannerFile("");
    resetField("profileBanner");
  }

  const { register, resetField, control, handleSubmit, reset } =
    useForm<IFormEditProfileInput>();

  const onSubmit = async (data: IFormEditProfileInput) => {
    setProfileImageFile("");
    setProfileBannerFile("");
    reset();
  };
  return (
    <div id="edit-profile-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-around">
          <div className="pt-4">
            <label className="text-lg font-medium pl-6">Profile Image</label>
            <div className="flex pt-3">
              <div className="upload-profile-btn-wrapper">
                <button className="btn" role="button">
                  <i className="pi pi-image text-6xl" />
                </button>
                <input
                  {...register("profileImage", { required: true })}
                  type="file"
                  onChange={handleChangeProfileImage}
                  accept=".jpg, .jpeg, .png"
                  role="button"
                />
              </div>
              <img src={profileImageFile} alt="" className="profile-image" />

              {profileImageFile && (
                <div role="button" onClick={removeProfileImage}>
                  <i className="pi pi-times" />
                </div>
              )}
            </div>
          </div>
          <div className="pt-4">
            <label className="text-lg font-medium pl-6">Profile Banner</label>
            <div className="flex pt-3">
              <div className="upload-banner-btn-wrapper">
                <button className="btn" role="button">
                  <i className="pi pi-image text-6xl" />
                </button>
                <input
                  {...register("profileBanner", { required: true })}
                  type="file"
                  onChange={handleChangeProfileBanner}
                  accept=".jpg, .jpeg, .png"
                  role="button"
                />
              </div>
              <img src={profileBannerFile} alt="" className="profile-banner" />

              {profileBannerFile && (
                <div role="button" onClick={removeProfileBanner}>
                  <i className="pi pi-times" />
                </div>
              )}
            </div>
          </div>
        </div>

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Name</label>
              <div>
                <InputText
                  {...field}
                  {...register("username", { required: true })}
                  className="w-full"
                />
              </div>
            </div>
          )}
          name="username"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Bio</label>

              <div>
                <InputText {...field} className="w-full" />
              </div>
            </div>
          )}
          name="bio"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <div className="pt-4">
              <label className="text-lg font-medium">Email</label>

              <div>
                <InputText {...field} className="w-full" />
              </div>
            </div>
          )}
          name="email"
          control={control}
        />
        <div className="flex justify-end pt-4">
          <Button label="Save" />
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
