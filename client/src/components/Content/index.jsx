import { useEffect, useState } from "react";
import AlbumAndArtistWrap from "../AlbumAndArtistWrap";
import { useSong } from "../../contexts/Song";
import { useUser } from "../../contexts/User";
import { Spin } from "antd";

const Content = () => {
	const { songList, fetchSongList } = useSong();
	const { userList, fetchUserList } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				await Promise.all([fetchSongList(), fetchUserList()]);
			} catch (error) {
				console.log("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [fetchSongList, fetchUserList]);

	return (
		<div className='2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-10 p-6 flex flex-col gap-8'>
			{isLoading ? (
				<div className='flex items-center justify-center h-screen'>
					<Spin spinning />
				</div>
			) : (
				<>
					<AlbumAndArtistWrap title='Songs' list={songList} type='song' />
					<AlbumAndArtistWrap title='Artists' list={userList} type='user' />
				</>
			)}
		</div>
	);
};

export default Content;
