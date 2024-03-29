import AdminManagement from "@Components/AdminManagement/AdminManagement";
import useAllUsers from "@Hooks/useAllUsers";
import useGetMkpInfo from "@Hooks/useGetMkpInfo";
import { AppContext } from "@Store/index";
import { useContext } from "react";

const AdminContainer = () => {
  const web3Context = useContext(AppContext);
  const { users, refetch: usersRefetch } = useAllUsers(
    web3Context.state.web3.chainId
  );
  const { mkpInfo, refetch: mkpInfoRefetch } = useGetMkpInfo(
    web3Context.state.web3.chainId
  );
  return (
    <>
      <AdminManagement
        users={users}
        usersRefetch={usersRefetch}
        mkpInfo={mkpInfo}
        mkpInfoRefetch={mkpInfoRefetch}
      ></AdminManagement>
    </>
  );
};

export default AdminContainer;
