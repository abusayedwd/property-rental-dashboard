import UserTable from "../../components/UserTable";
import { useGetAllUsersQuery } from "../../../redux/features/user/getAllUsers";

const Users = () => (
  <UserTable title="Users" subtitle="Tenants and buyers registered on the platform" useListQuery={useGetAllUsersQuery} />
);

export default Users;
