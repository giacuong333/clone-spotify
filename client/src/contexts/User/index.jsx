import React, { useCallback, useState } from "react";
import { apis } from "../../constants/apis";
import { instance } from "../Axios";

const UserContext = React.createContext();

const User = ({ children }) => {
	const [userList, setUserList] = useState([]);
	const [loadingFetchUserList, setLoadingFetchUserList] = useState(false);

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
			setLoadingFetchUserList(true);
		}
	}, []);

	return (
		<UserContext.Provider
			value={{
				userList,
				fetchUserList,
				loadingFetchUserList,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => React.useContext(UserContext);
export default React.memo(User);
