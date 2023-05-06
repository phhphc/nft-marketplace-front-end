import { IFormEditProfileInput, IProfile } from "@Interfaces/index";
import { saveProfileService } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef, useState, useContext } from "react";
import { Controller, useForm } from "react-hook-form";

export interface IEditProfileFormProps {
  profileRefetch: () => void;
  onSubmitted: () => void;
  profile: IProfile;
}

const EditProfileForm = ({
  profileRefetch,
  onSubmitted,
  profile,
}: IEditProfileFormProps) => {
  const [isDeletedProfileImageFile, setIsDeletedProfileImageFile] =
    useState<boolean>(false);
  const [isDeletedProfileBannerFile, setIsDeletedProfileBannerFile] =
    useState<boolean>(false);
  const [profileImageFile, setProfileImageFile] = useState<string>(
    profile?.metadata?.image_url || ""
  );
  const [profileBannerFile, setProfileBannerFile] = useState<string>(
    profile?.metadata?.banner_url || ""
  );
  const web3Context = useContext(AppContext);

  function handleChangeProfileImage(e: any) {
    setIsDeletedProfileImageFile(false);
    setProfileImageFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeProfileImage() {
    setIsDeletedProfileImageFile(true);
    setProfileImageFile("");
    resetField("profileImage");
  }

  function handleChangeProfileBanner(e: any) {
    setIsDeletedProfileBannerFile(false);
    setProfileBannerFile(URL.createObjectURL(e.target.files[0]));
  }

  function removeProfileBanner() {
    setIsDeletedProfileBannerFile(true);
    setProfileBannerFile("");
    resetField("profileBanner");
  }

  const { register, resetField, control, handleSubmit, reset } =
    useForm<IFormEditProfileInput>();

  const onSubmit = async (data: IFormEditProfileInput) => {
    try {
      await saveProfileService({
        username: data.username,
        bio: data.bio,
        email: data.email,
        profileImage: !isDeletedProfileImageFile
          ? data.profileImage[0] || profile?.metadata?.image_url
          : undefined,
        profileBanner: !isDeletedProfileBannerFile
          ? data.profileBanner[0] || profile?.metadata?.banner_url
          : undefined,
        address: web3Context.state.web3.myAddress,
        signature:
          "0x528c15b2906218f648a19ec8967303d45cb0ef4165dd0e0d83f95d09ba175db361e3f90e24d1d5854c",
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Edit profile successfully!",
          life: 5000,
        });
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to edit profile!",
          life: 5000,
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
                  defaultValue={profile?.username || ""}
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
                <InputText
                  {...field}
                  {...register("bio", { required: false })}
                  className="w-full"
                  defaultValue={profile?.metadata?.bio || ""}
                />
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
                <InputText
                  {...field}
                  {...register("email", {
                    required: false,
                  })}
                  type="email"
                  className="w-full"
                  defaultValue={profile?.metadata?.email || ""}
                />
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
