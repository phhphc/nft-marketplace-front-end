import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";
import { useContext } from "react";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { signEIP191 } from "@Services/ApiService";
import useUser from "@Hooks/useUser";
import { ROLE_NAME } from "@Interfaces/index";
import useNotificationByOwner from "@Hooks/useNotificationByOwner";
import { SUPPORTED_NETWORK } from "@Constants/index";
import { Message } from "primereact/message";

export interface IAdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: IAdminLayoutProps) => {
  const web3Context = useContext(AppContext);

  if (!SUPPORTED_NETWORK.includes(web3Context.state.web3.chainId)) {
    return (
      <div className="mt-24 min-h-screen">
        <Message
          severity="warn"
          text="You must to connect to Sepolia or Mumbai test network!"
          className="flex h-40"
        />
      </div>
    );
  }
  const { notification, refetch: notificationRefetch } = useNotificationByOwner(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId,
    web3Context.state.web3.authToken
  );

  const { user } = useUser(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  if (!user) return <></>;

  const isBlock = !!user?.is_block;

  if (isBlock && web3Context.state.web3.authToken)
    web3Context.dispatch({
      type: WEB3_ACTION_TYPES.LOGOUT,
      payload: { myAddress: web3Context.state.web3.myAddress },
    });

  const isAdmin = !!user?.roles?.some(
    (item: any) => item.name === ROLE_NAME.ADMIN
  );

  return (
    <div>
      {isAdmin ? (
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
      ) : (
        "This is only for Admin"
      )}
    </div>
  );
};

export default AdminLayout;
