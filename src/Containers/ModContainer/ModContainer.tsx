import useAllUsers from "@Hooks/useAllUsers";
import { AppContext } from "@Store/index";
import { useContext } from "react";
import ModManagement from "@Components/ModManagement/ModManagement";

const ModContainer = () => {
  const web3Context = useContext(AppContext);
  const { users, refetch: usersRefetch } = useAllUsers(
    web3Context.state.web3.chainId
  );
  return <>
  <ModManagement
    users={users}
    usersRefetch={usersRefetch}
  ></ModManagement>
</>;
};

export default ModContainer;
