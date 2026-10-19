import UserTable from "../../components/UserTable";
import { useGetAllLandlordQuery } from "../../../redux/features/user/getAllLandlord";

const Landlord = () => (
  <UserTable title="Landlords" subtitle="Property owners and agents listing on the platform" useListQuery={useGetAllLandlordQuery} showCompany />
);

export default Landlord;
