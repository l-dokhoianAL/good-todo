import { connect, ConnectedProps } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { RootState } from "../store/store";

const mapStateToProps = ({ isAuthenticated }: RootState) => ({ isAuthenticated });

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface DefaultProps {
  type: "public" | "private";
}

type PropsAuthRoute = PropsFromRedux & DefaultProps;

function AuthRoute({ type, isAuthenticated }: PropsAuthRoute) {
  if (type === "public" && isAuthenticated) {
    return <Navigate replace to="/home" />;
  }
  if (type === "private" && !isAuthenticated) {
    return <Navigate replace to="/sign-in" />;
  }
  return <Outlet />;
}

export default connector(AuthRoute);
