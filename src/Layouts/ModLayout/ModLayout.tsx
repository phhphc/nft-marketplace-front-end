import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import { Message } from "primereact/message";
import { SUPPORTED_NETWORK } from "@Constants/index";
import useNotificationByOwner from "@Hooks/useNotificationByOwner";
import useUser from "@Hooks/useUser";
import { ROLE_NAME } from "@Interfaces/index";

export interface IModLayoutProps {
  children: React.ReactNode;
}

const ModLayout = ({ children }: IModLayoutProps) => {
  const web3Context = useContext(AppContext);

  const { user } = useUser(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  if (!user) return <></>;

  const isMod = !!user?.roles?.some(
    (item: any) =>
      item.name === ROLE_NAME.ADMIN || item.name === ROLE_NAME.MODERATOR
  );

  return <div>{isMod ? children : "This is only for moderator"}</div>;
};

export default ModLayout;
