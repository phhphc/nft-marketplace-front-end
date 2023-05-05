import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import EditProfileForm from "@Components/EditProfileForm/EditProfileForm";
import { IProfile } from "@Interfaces/index";

export interface IUserInfoProps {
  profile: IProfile;
  profileRefetch: () => void;
}

const UserInfor = ({ profile, profileRefetch }: IUserInfoProps) => {
  const web3Context = useContext(AppContext);
  const [isCopied, setIsCopied] = useState("Copy");
  const [visible, setVisible] = useState(false);

  const handleCopyToClipboard = (event: any) => {
    setIsCopied("Copied!");
    navigator.clipboard.writeText(event.target.innerHTML);
  };

  return (
    <div id="user-infor" className="mt-16">
      <div className="flex justify-between">
        <div className="font-semibold text-3xl">
          {profile?.username ? profile.username : "Unnamed"}
        </div>
        <i
          className="pi pi-user-edit cursor-pointer"
          style={{ fontSize: "2rem" }}
          onClick={() => setVisible(true)}
        ></i>
        <Tooltip target=".pi-user-edit" position="left">
          Edit Profile
        </Tooltip>
        <Dialog
          header="Edit your profile"
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          <EditProfileForm
            profileRefetch={profileRefetch}
            onSubmitted={() => {
              setVisible(false);
            }}
            profile={profile}
          ></EditProfileForm>
        </Dialog>
      </div>

      <div className="font-normal text-xl mt-3">
        Email: {profile?.metadata?.email ? profile?.metadata?.email : ""}
      </div>
      <div className="font-normal text-xl mt-3">
        Bio: {profile?.metadata?.bio ? profile?.metadata?.bio : ""}
      </div>
      <div className="flex pt-3 text-lg">
        <Tooltip target=".icon-chain" position="mouse" />
        <i
          role="button"
          className="icon-chain pi pi-tag pt-1"
          data-pr-tooltip="Chain: Ethereum"
        />
        <Tooltip target=".chain-address" position="top" content={isCopied} />
        <div
          role="button"
          className="chain-address pl-3"
          onClick={handleCopyToClipboard}
        >
          {web3Context.state.web3.myAddress}
        </div>
      </div>
    </div>
  );
};

export default UserInfor;
