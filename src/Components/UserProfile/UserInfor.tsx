import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "@Store/index";

const UserInfor = () => {
  const web3Context = useContext(AppContext);
  const [isCopied, setIsCopied] = useState("Copy");

  const handleCopyToClipboard = (event: any) => {
    setIsCopied("Copied!");
    navigator.clipboard.writeText(event.target.innerHTML);
  };
  return (
    <div id="user-infor">
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
