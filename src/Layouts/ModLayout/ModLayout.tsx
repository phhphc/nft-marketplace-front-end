import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import { Message } from "primereact/message";
import { SUPPORTED_NETWORK } from "@Constants/index";
import useNotificationByOwner from "@Hooks/useNotificationByOwner";

export interface IMainLayoutProps {
  children: React.ReactNode;
}

const ModLayout = ({ children }: IMainLayoutProps) => {
  return <div>This is only for mod</div>;
};

export default ModLayout;
