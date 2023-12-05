
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./stylesheets/App.css";

import ToDo from "./components/ToDo";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import NotFound from "./Pages/NotFound/NotFound";
import { Routes, Navigate, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import SingleTask from "./Pages/SingleTask/SingleTask";
import Spinner from "./components/spinner/Spinner";
import { connect } from "react-redux";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import { useEffect } from "react";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import CustomRouter from "./helpers/CustomRouter";
import history from "./helpers/history";
import AuthRoute from "./components/AuthRoute";
import Footer from "./components/Footer/Footer";


interface AppProps {
  isLoading?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

const notifOptions: ToastOptions = {
  position: "bottom-left",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

function App({ isLoading, successMessage, errorMessage }: AppProps) {
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, notifOptions);
    }
    if (errorMessage) {
      toast.error(errorMessage, notifOptions);
    }
  }, [successMessage, errorMessage]);

  return (
    <CustomRouter history={history}>
      <Header />
      <Routes>
        <Route path="/" element={<AuthRoute type="private" />}>
          <Route path={"/"} element={<Navigate replace to={"/home"} />} />
        </Route>

        <Route path="/home" element={<AuthRoute type="private" />}>
          <Route path={"/home"} element={<ToDo />} />
        </Route>
        <Route
          path="/task/:taskId"
          element={<AuthRoute type="private" />}
        >
          <Route path={"/task/:taskId"} element={<SingleTask />} />
        </Route>

        <Route path={"/about"} element={<About />} />
        <Route path={"/Contact"} element={<Contact />} />

        <Route path="/sign-in" element={<AuthRoute type="public" />}>
          <Route path={"/sign-in"} element={<Login />} />
        </Route>

        <Route path="/sign-up" element={<AuthRoute type="public" />}>
          <Route path={"/sign-up"} element={<Register />} />
        </Route>

        <Route path={"/404"} element={<NotFound />} />

        <Route path={"*"} element={<NotFound />} />
      </Routes>
      {isLoading && <Spinner />}
      <ToastContainer />
      <Footer />
    </CustomRouter>
  );
}
const mapStateToProps = ({ isLoading, successMessage, errorMessage }: AppProps) => ({
  isLoading,
  successMessage,
  errorMessage,
});

export default connect(mapStateToProps, null)(App);
