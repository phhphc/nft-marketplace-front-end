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

const AdminLayout = ({ children }: IMainLayoutProps) => {
  const web3Context = useContext(AppContext);
  const { notification, refetch: notificationRefetch } = useNotificationByOwner(
    web3Context.state.web3.myAddress
  );
  return <div>This is only for admin</div>;
};

export default AdminLayout;
