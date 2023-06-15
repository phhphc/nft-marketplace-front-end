import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import { signEIP191 } from "@Services/ApiService";

export interface IAdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: IAdminLayoutProps) => {
  const web3Context = useContext(AppContext);
  console.log(
    "🚀 ~ file: AdminLayout.tsx:13 ~ AdminLayout ~ web3Context:",
    web3Context
  );
  return <div></div>;
};

export default AdminLayout;
