// ListenedAt.jsx
import React, { useCallback, useState } from "react";
import { instance } from "../Axios";
import { apis } from "../../constants/apis";

const ListenedAtContext = React.createContext();

const ListenedAt = ({ children }) => {
	const [pendingCreate, setPendingCreate] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	const saveListenedAt = useCallback(async (songId) => {
		if (!songId) return;

		try {
			setPendingCreate(true);
			const payload = { song_id: songId };
			const response = await instance.post(apis.listened_at.create(), payload);

			if (response.status === 201) {
				setIsSaved(true);
				return true;
			}
			return false;
		} catch (error) {
			console.log("Failed to save listened_at data", error);
			return false;
		} finally {
			setPendingCreate(false);
		}
	}, []);

	const resetSaveStatus = useCallback(() => {
		setIsSaved(false);
	}, []);

	return (
		<ListenedAtContext.Provider
			value={{
				pendingCreate,
				saveListenedAt,
				isSaved,
				resetSaveStatus,
			}}>
			{children}
		</ListenedAtContext.Provider>
	);
};

export const useListenedAt = () => React.useContext(ListenedAtContext);
export default React.memo(ListenedAt);
