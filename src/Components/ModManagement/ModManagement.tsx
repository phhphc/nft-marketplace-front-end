import { IUser, ROLE_ITEM, ROLE_NAME } from "@Interfaces/index";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Message } from "primereact/message";
import { useContext, useState } from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { InputSwitch } from "primereact/inputswitch";
import { setBlockAccount } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { Button } from "primereact/button";

export interface IModManagementProps {
  users: IUser[];
  usersRefetch: () => void;
}

const ModManagement = ({ users, usersRefetch }: IModManagementProps) => {
  console.log("users", users);
  const web3Context = useContext(AppContext);
  const usersData = users.map((user: IUser) => {
    const isAdmin = !!user?.roles?.some(
      (item: ROLE_ITEM) => item.name === ROLE_NAME.ADMIN
    );
    const isMod = !!user?.roles?.some(
      (item: ROLE_ITEM) => item.name === ROLE_NAME.MODERATOR
    );
    return {
      ...user,
      role: isAdmin
        ? ROLE_NAME.ADMIN
        : isMod
        ? ROLE_NAME.MODERATOR
        : ROLE_NAME.USER,
      roleId: isAdmin ? 1 : isMod ? 2 : 3,
    };
  });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
    is_block: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="w-full">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword search (Address, Role, Status)"
            className="w-full"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  const noBodyTemplate = (rowData: IUser, column: any) => {
    return <div>{column.rowIndex + 1}</div>;
  };

  const [roles] = useState([
    ROLE_NAME.ADMIN,
    ROLE_NAME.MODERATOR,
    ROLE_NAME.USER,
  ]);

  const getSeverity = (role: string) => {
    switch (role) {
      case ROLE_NAME.ADMIN:
        return "success";
      case ROLE_NAME.MODERATOR:
        return "warning";
      case ROLE_NAME.USER:
        return "info";
    }
  };

  const roleBodyTemplate = (rowData: IUser) => {
    return (
      <Tag
        value={rowData.role.toUpperCase()}
        severity={getSeverity(rowData.role)}
        style={{ width: "6rem", height: "2rem" }}
      />
    );
  };

  const roleItemTemplate = (option: string) => {
    return (
      <Tag
        value={option.toUpperCase()}
        severity={getSeverity(option)}
        style={{ width: "6rem" }}
      />
    );
  };

  const roleRowFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={roles}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={roleItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusBodyTemplate = (rowData: IUser) => {
    const [blocked, setBlocked] = useState<boolean>(rowData.is_block);
    return rowData.role === ROLE_NAME.USER ? (
      <div className="flex gap-5">
        <i
          className="pi pi-check-circle text-green-500"
          style={{ fontSize: "1.5rem" }}
        ></i>
        <InputSwitch
          checked={blocked}
          onChange={(e: any) => {
            handleSetBlockAccount(rowData), setBlocked(e.value);
          }}
        />
        <i
          className="pi pi-ban text-red-500"
          style={{ fontSize: "1.5rem" }}
        ></i>
      </div>
    ) : (
      "You can not do this action"
    );
  };

  const statusRowFilterTemplate = (options: any) => (
    <div className="flex gap-5">
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
        checkIcon={<i className="pi pi-ban"></i>}
        uncheckIcon={<i className="pi pi-check"></i>}
      />
      <div>
        {options.value === null
          ? "Blocked and Not Blocked"
          : options.value === true
          ? "Blocked"
          : "Not Blocked"}
      </div>
    </div>
  );

  const handleSetBlockAccount = async (user: IUser) => {
    try {
      await setBlockAccount({
        authToken: web3Context.state.web3.authToken,
        address: user.address,
        chainId: web3Context.state.web3.chainId,
        isBlock: !user.is_block,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Set status successfully!",
          life: 3000,
        });
    } catch (error) {
      console.log(error);
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to set status!",
          life: 3000,
        });
    } finally {
      usersRefetch();
    }
  };

  return (
    <div className="admin-management pt-5">
      <div className="flex justify-center">
        <Message text="YOU ARE IN MODERATOR MODE" />
      </div>
      <div className="pt-5">
        <DataTable
          value={usersData}
          paginator
          rows={10}
          dataKey="address"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["address", "role", "is_block"]}
          header={header}
          emptyMessage="No user found."
          stripedRows
          showGridlines
          rowHover={true}
        >
          <Column field="" header="No. " body={noBodyTemplate} className="" />
          <Column
            field="address"
            header="Address"
            filter
            filterPlaceholder="Search by address"
            sortable
            className="w-2/5"
          />
          <Column
            field="role"
            header="Role"
            showFilterMenu={false}
            body={roleBodyTemplate}
            filter
            filterElement={roleRowFilterTemplate}
            sortable
            className="w-1/3"
          />
          <Column
            field="is_block"
            header="Status"
            dataType="boolean"
            body={statusBodyTemplate}
            filter
            filterElement={statusRowFilterTemplate}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default ModManagement;
