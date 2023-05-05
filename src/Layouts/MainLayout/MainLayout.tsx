import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import { Message } from "primereact/message";
import { SUPPORTED_NETWORK } from "@Constants/index";

export interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IMainLayoutProps) => {
  const web3Context = useContext(AppContext);
  console.log(web3Context.state.web3.chainId);
  return (
    <div>
      <Header />
      {SUPPORTED_NETWORK.some(
        (networkChainId: number) =>
          networkChainId === web3Context.state.web3.chainId
      ) ? (
        <div className="px-5 pb-5 mt-24 min-h-screen">{children}</div>
      ) : (
        <div className="mt-24 min-h-screen">
          <Message
            severity="warn"
            text="You must to connect to Sepolia test network!"
            className="flex h-40"
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MainLayout;
