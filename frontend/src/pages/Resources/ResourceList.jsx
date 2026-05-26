import { Navigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

export default function ResourceList() {
  return <Navigate to={ROUTES.BRANCHES} replace />;
}
