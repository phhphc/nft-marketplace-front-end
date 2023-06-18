import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";
import { useContext } from "react";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { Message } from "primereact/message";
import { SUPPORTED_NETWORK } from "@Constants/index";
import useNotificationByOwner from "@Hooks/useNotificationByOwner";
import useUser from "@Hooks/useUser";

export interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IMainLayoutProps) => {
  const web3Context = useContext(AppContext);
  const { user } = useUser(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  const { notification, refetch: notificationRefetch } = useNotificationByOwner(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId,
    web3Context.state.web3.authToken
  );

  const isBlock = !!user?.is_block;

  if (isBlock && web3Context.state.web3.authToken)
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.LOGOUT,
      payload: { myAddress: web3Context.state.web3.myAddress },
    });
  return (
    <div>
      {!!web3Context.state.web3.chainId && (
        <>
          <Header
            notification={notification}
            notificationRefetch={notificationRefetch}
          />
          <div className="px-5 pb-5 mt-24 min-h-screen">{children}</div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default MainLayout;
