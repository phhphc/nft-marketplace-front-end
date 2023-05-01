import { IFormEditProfileInput } from "@Interfaces/index";
import { saveProfileService } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState, useContext } from "react";
import { Controller, useForm } from "react-hook-form";

export interface IEditProfileFormProps {
  profileRefetch: () => void;
  onSubmitted: () => void;
}

const EditProfileForm = ({
  profileRefetch,
  onSubmitted,
}: IEditProfileFormProps) => {
  const [profileImageFile, setProfileImageFile] = useState<string>("");
  const [profileBannerFile, setProfileBannerFile] = useState<string>("");
  const web3Context = useContext(AppContext);

  const toast = useRef<Toast>(null);

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
    try {
      await saveProfileService({
        ...data,
        profileImage: data.profileImage[0],
        profileBanner: data.profileBanner[0],
        address: web3Context.state.web3.myAddress,
        signature:
          "0x528c15b2906218f648a19ec8967303d45cb0ef4165dd0e0d83f95d09ba175db361e3f90e24d1d5854c",
        toast,
      });
    } catch (error) {
      toast.current &&
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to edit profile!",
          life: 3000,
        });
    } finally {
      setProfileImageFile("");
      setProfileBannerFile("");
      reset();
      profileRefetch();
      onSubmitted();
    }
  };
  return (
    <div id="edit-profile-form">
      <Toast ref={toast} position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-around">
          <div className="pt-4 relative">
            <label className="text-lg font-medium pl-6">Profile Image</label>
            <div className="flex pt-3">
              <div className="upload-profile-btn-wrapper">
                <button className="btn" role="button">
                  <i className="pi pi-image text-6xl" />
                </button>
                <input
                  {...register("profileImage", { required: false })}
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
          <div className="pt-4 relative">
            <label className="text-lg font-medium pl-6">Profile Banner</label>
            <div className="flex pt-3">
              <div className="upload-banner-btn-wrapper">
                <button className="btn" role="button">
                  <i className="pi pi-image text-6xl" />
                </button>
                <input
                  {...register("profileBanner", { required: false })}
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
                  {...register("username", { required: false })}
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
