import { lazy } from "react";
import paths from "../../constants/paths";

const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));

const routes = [
  { path: paths.home, Page: Home, isPublic: true, index: true },
  { path: paths.login, Page: Login, isPublic: true },
  { path: paths.register, Page: Register, isPublic: true },
  //   { path: paths.admin, Page: Register, isPublic: true },
];

export default routes;
