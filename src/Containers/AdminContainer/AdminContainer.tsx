import AdminManagement from "@Components/AdminManagement/AdminManagement";
import useAllUsers from "@Hooks/useAllUsers";
import { AppContext } from "@Store/index";
import { useContext } from "react";

const AdminContainer = () => {
  const web3Context = useContext(AppContext);
  const { users, refetch: usersRefetch } = useAllUsers(
    web3Context.state.web3.chainId
  );
  return (
    <>
      <AdminManagement
        users={users}
        usersRefetch={usersRefetch}
      ></AdminManagement>
    </>
  );
};

export default AdminContainer;
