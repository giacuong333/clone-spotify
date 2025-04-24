import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
// import { useAuth } from "../../Contexts/Auth";
// import paths from "../../constants/paths";

const AdminLayout = ({ children }) => {
	// const { isAuthenticated, user } = useAuth();

	// if (!isAuthenticated() || (isAuthenticated() && user?.role === 2))
	// return <Navigate to={paths.home} replace />;

	return (
		<div className='grid lg:grid-cols-5 md:grid-cols-4'>
			<div className=''>
				<AdminSidebar />
			</div>

			<div className='lg:col-span-4 md:col-span-3 p-8'>{children}</div>
		</div>
	);
};

export default AdminLayout;
