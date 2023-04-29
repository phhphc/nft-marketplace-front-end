import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import { Dialog } from "primereact/dialog";
import EditProfileForm from "@Components/EditProfileForm/EditProfileForm";

const UserInfor = () => {
  const web3Context = useContext(AppContext);
  const [isCopied, setIsCopied] = useState("Copy");
  const [visible, setVisible] = useState(false);

  const handleCopyToClipboard = (event: any) => {
    setIsCopied("Copied!");
    navigator.clipboard.writeText(event.target.innerHTML);
  };

  return (
    <div id="user-infor" className="mt-8">
      <div className="flex justify-between">
        <div className="font-semibold text-3xl">Unnammed</div>
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
          <EditProfileForm></EditProfileForm>
        </Dialog>
      </div>

      <div className="font-normal text-xl mt-3">Joined date</div>
      <div className="font-normal text-xl mt-3">Bio</div>
      <div className="flex pt-3 text-lg">
        <Tooltip target=".icon-chain" position="mouse" />
        <i
          role="button"
          className="icon-chain pi pi-paperclip pt-1"
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
