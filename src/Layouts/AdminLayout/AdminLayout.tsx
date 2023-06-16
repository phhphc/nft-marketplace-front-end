import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";
import { useContext } from "react";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { signEIP191 } from "@Services/ApiService";
import useUser from "@Hooks/useUser";
import { ROLE_NAME } from "@Interfaces/index";
import useNotificationByOwner from "@Hooks/useNotificationByOwner";

export interface IAdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: IAdminLayoutProps) => {
  const web3Context = useContext(AppContext);
  const { notification, refetch: notificationRefetch } = useNotificationByOwner(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  const { user } = useUser(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  if (!user) return <></>;

  const isBlock = !!user?.is_block;

  if (isBlock && web3Context.state.web3.authToken)
    web3Context.dispatch({ type: WEB3_ACTION_TYPES.LOGOUT });

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
        "This is only for admin"
      )}
    </div>
  );
};

export default AdminLayout;
