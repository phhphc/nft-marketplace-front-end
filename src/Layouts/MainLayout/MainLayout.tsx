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
  return (
    <div>
      <Header />
        <div className="px-5 pb-5 mt-24 min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
