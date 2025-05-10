import React, { useCallback, useState } from "react";
import { instance } from "../Axios";
import { apis } from "../../constants/apis";

const DownloadedAtContext = React.createContext();

const DownloadedAt = ({ children }) => {
	const [pendingCreate, setPendingCreate] = useState(false);

	const saveDownloadedAt = useCallback(async (payload) => {
		try {
			setPendingCreate(true);
			const response = await instance.post(
				apis.downloaded_at.create(),
				payload
			);
			if (response.status === 201) {
				//
			}
		} catch (error) {
			console.log("Download failed", error);
		} finally {
			setPendingCreate(false);
		}
	}, []);

	return (
		<DownloadedAtContext.Provider
			value={{
				pendingCreate,
				saveDownloadedAt,
			}}>
			{children}
		</DownloadedAtContext.Provider>
	);
};

export const useDownloadedAt = () => React.useContext(DownloadedAtContext);
export default React.memo(DownloadedAt);
