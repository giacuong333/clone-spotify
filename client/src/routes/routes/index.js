import { lazy } from "react";
import paths from "../../constants/paths";

// Layouts
const MainLayout = lazy(() => import("../../layouts/MainLayout"));
const AdminLayout = lazy(() => import("../../layouts/AdminLayout"));

// Pages
const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const AlbumAndArtistDetails = lazy(() =>
  import("../../components/AlbumAndArtistDetails")
);
const Search = lazy(() => import("../../components/Search"));
const Admin = lazy(() => import("../../pages/Admin"));
const UserManagement = lazy(() => import("../../components/UserManagement"));
const SongManagement = lazy(() => import("../../components/SongManagement"));

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
  {
    path: paths.search,
    Layout: MainLayout,
    Page: Search,
    isPublic: true,
  },
  { path: paths.admin, Layout: AdminLayout, Page: Admin, isPublic: true },
  {
    path: paths.users,
    Layout: AdminLayout,
    Page: UserManagement,
    isPublic: true,
  },
  {
    path: paths.songs,
    Layout: AdminLayout,
    Page: SongManagement,
    isPublic: true,
  },
];

export default routes;
