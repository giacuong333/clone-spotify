import { lazy } from "react";
import paths from "../../constants/paths";

const MainLayout = lazy(() => import("../../layouts/MainLayout"));
const AdminLayout = lazy(() => import("../../layouts/AdminLayout"));

const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const Admin = lazy(() => import("../../pages/Admin"));

const AlbumAndArtistDetails = lazy(() =>
	import("../../components/AlbumAndArtistDetails")
);
const ChatInterface = lazy(() => import("../../components/Chat/ChatInterface"));
const Profile = lazy(() => import("../../components/Profile"));
const Search = lazy(() => import("../../components/Search"));
const PlaylistDetails = lazy(() => import("../../components/PlaylistDetails"));
const MyStatistics = lazy(() => import("../../components/MyStatistics"));

const UserManagement = lazy(() => import("../../components/UserManagement"));
const SongManagement = lazy(() => import("../../components/SongManagement"));
const GenreManagement = lazy(() => import("../../components/GenreManagement"));
const AdminStatistics = lazy(() => import("../../components/AdminStatistics"));

const routes = [
	// Public routes
	{
		path: paths.home,
		Layout: MainLayout,
		Page: Home,
		isPublic: true,
		index: true,
	},
	{
		path: paths.login,
		Layout: null,
		Page: Login,
		isPublic: true,
		isAuthPage: true,
	},
	{
		path: paths.register,
		Layout: null,
		Page: Register,
		isPublic: true,
		isAuthPage: true,
	},
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
	{
		path: paths.playlist,
		Layout: MainLayout,
		Page: PlaylistDetails,
		isPublic: true,
	},

	// Authenticated user routes
	{
		path: paths.myStatistics,
		Layout: MainLayout,
		Page: MyStatistics,
		isPublic: false,
	},
	{
		path: paths.profile,
		Layout: MainLayout,
		Page: Profile,
		isPublic: false,
	},
	{
		path: paths.chats,
		Layout: MainLayout,
		Page: ChatInterface,
		isPublic: false,
	},

	// Admin routes
	{
		path: paths.admin,
		Layout: AdminLayout,
		Page: Admin,
		isPublic: false,
		isAdminPage: true,
	},
	{
		path: paths.users,
		Layout: AdminLayout,
		Page: UserManagement,
		isPublic: false,
		isAdminPage: true,
	},
	{
		path: paths.songs,
		Layout: AdminLayout,
		Page: SongManagement,
		isPublic: false,
		isAdminPage: true,
	},
	{
		path: paths.genres,
		Layout: AdminLayout,
		Page: GenreManagement,
		isPublic: false,
		isAdminPage: true,
	},
	{
		path: paths.statistics,
		Layout: AdminLayout,
		Page: AdminStatistics,
		isPublic: false,
		isAdminPage: true,
	},
];

export default routes;
