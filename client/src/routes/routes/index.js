import { lazy } from "react";
import paths from "../../constants/paths";

// Layouts
const MainLayout = lazy(() => import("../../layouts/MainLayout"));

// Pages
const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const AlbumAndArtistDetails = lazy(() =>
  import("../../components/AlbumAndArtistDetails")
);

const routes = [
  {
    path: paths.home,
    Layout: MainLayout,
    Page: Home,
    isPublic: true,
    index: true,
  },
  { path: paths.login, Layout: null, Page: Login, isPublic: true },
  { path: paths.register, Layout: null, Page: Register, isPublic: true },
  {
    path: paths.details,
    Layout: MainLayout,
    Page: AlbumAndArtistDetails,
    isPublic: true,
  },
  //   { path: paths.admin, Page: Register, isPublic: true },
];

export default routes;
