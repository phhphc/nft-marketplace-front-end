import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";

const UserInfor = () => {
  const [isCopied, setIsCopied] = useState("Copy");

  const handleCopyToClipboard = (event:any) =>{
    setIsCopied("Copied!");
    navigator.clipboard.writeText(event.target.innerHTML)
  }
  return (
    <div id="user-infor">
      <div className="flex justify-between">
        <div className="flex">
          <div className="nft-name font-semibold text-3xl">HUYNH NGOC BAO</div>
          <Tooltip target=".verified-nft" position="right" />
          <i
            className="verified-nft pi pi-verified text-sky-600 text-lg pl-2 pt-3"
            role="button"
          />
        </div>
        <div className="detail-link">
          <div className="flex gap-10 pt-4 text-lg">
            <Tooltip target=".icon-share" position="top" />
            <i
              role="button"
              className="icon-share pi pi-share-alt"
              data-pr-tooltip="Share"
            />

            <i role="button" className="pi pi-ellipsis-h" />
          </div>
        </div>
      </div>

      <div className="flex pt-3 text-lg">
        <Tooltip target=".icon-chain" position="mouse" />
        <i
          role="button"
          className="icon-chain pi pi-paperclip pt-1"
          data-pr-tooltip="Chain: Ethereum"
        />
        <Tooltip target=".chain-address" position="top" content={isCopied}/>
        <div role="button" className="chain-address pl-3 whitespace-nowrap w-40 overflow-hidden text-ellipsis" onClick={handleCopyToClipboard}>
          0x4C242C020256180BF0dE687d736453e234727cc9
        </div>
        <div className="pl-4 text-gray-500">Joined June 2021</div>
      </div>
      <div className="flex detail-infor pt-3 text-lg">
        Check our projects out at - Crypto Drinks - www.cryptodrinks.net |
        Diamond NFTs - www.diamondnfts.net
      </div>
    </div>
  );
};

export default UserInfor;
