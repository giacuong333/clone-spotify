import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { apis } from "../../constants/apis";
import { instance } from "../Axios";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
	const [userList, setUserList] = useState([]);
	const [loadingFetchUserList, setLoadingFetchUserList] = useState(false);

	const [userDetail, setUserDetail] = useState(null);
	const [loadingFetchUserDetail, setLoadingFetchUserDetail] = useState(false);

	const [searchUserResult, setSearchUserResult] = useState([]);
	const [loadingSearchUserResult, setLoadingSearchUserResult] = useState(false);

	const queryUser = useCallback(async (query = "") => {
		try {
			setLoadingSearchUserResult(true);
			const response = await instance.get(apis.users.queryUser(), {
				params: { q: query },
			});
			if (response.status === 200) {
				setSearchUserResult(response.data);
			}
		} catch (error) {
			console.log("Errors occur while fetching user", error);
		} finally {
			setLoadingSearchUserResult(false);
		}
	}, []);

	const fetchUserDetail = useCallback(async (id) => {
		try {
			setLoadingFetchUserDetail(true);
			const response = await instance.get(apis.users.getById(id));
			if (response.status === 200) {
				setUserDetail(response.data);
			}
		} catch (error) {
			console.log("Errors occur while fetching user", error);
		} finally {
			setLoadingFetchUserDetail(false);
		}
	}, []);

	const fetchUserList = useCallback(async () => {
		try {
			setLoadingFetchUserList(true);
			const response = await instance.get(apis.users.getAllByRoleUser());
			if (response.status === 200) {
				setUserList(response.data);
			}
		} catch (error) {
			console.log("Errors occur while fetching users", error);
		} finally {
			setLoadingFetchUserList(false);
		}
	}, []);

	return (
		<UserContext.Provider
			value={{
				userList,
				fetchUserList,
				loadingFetchUserList,

				userDetail,
				fetchUserDetail,
				loadingFetchUserDetail,

				searchUserResult,
				queryUser,
				loadingSearchUserResult,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => React.useContext(UserContext);
export default UserProvider;
