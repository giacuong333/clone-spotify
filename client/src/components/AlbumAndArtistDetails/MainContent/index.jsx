import React, { Suspense, useEffect, useState } from "react";
import { Button, Spin } from "antd";
import PlayIcon from "../../Icons/PlayIcon";
import PauseIcon from "../../Icons/PauseIcon";
import SongListWrap from "../../SongListWrap";
import { useSong } from "../../../contexts/Song";
import { notify } from "../../Toast";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { useUser } from "../../../contexts/User";
import { usePlaylist } from "../../../contexts/playlist";
import { usePlayer } from "../../../contexts/Player";

const MainContent = ({ user = null, song = null, onPlaySong }) => {
	const [allSongs, setAllSongs] = useState([]);
	const { fetchSongsByUserId, handleDownload } = useSong();
	const [isFavorited, setIsFavorited] = useState(false);
	const {
		favoritePlaylist,
		fetchFavoritePlaylist,
		addSongToPlaylist,
		removeSongFromPlaylist,
	} = usePlaylist();
	const { isPlaying } = usePlayer();

	console.log("allSongs: ", allSongs);

	const fetchSongsByUser = async () => {
		try {
			const response = await fetchSongsByUserId(user?.id || song?.user?.id);
			if (response && response.status === 200) {
				setAllSongs(response.data.songs_by_user);
				console.log("Songs by this user: ", response);
			}
		} catch (error) {
			console.log("Errors occur while fetching songs", error.message);
			notify("Error fetching songs", "error");
		}
	};

	useEffect(() => {
		const fetchData = async () => {
		try {
			if (song) await fetchSongsByUser();
			await fetchFavoritePlaylist();
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		};

		fetchData();
	}, [user, song]);

	useEffect(() => {
		if (favoritePlaylist) {
			console.log("Favorite Playlist:", favoritePlaylist);
		}
		if (favoritePlaylist && song) {
			const found = favoritePlaylist.songs?.some(
				(entry) => entry.song?.id === song.id
			);
			setIsFavorited(found);
		}
		console.log("isFavorited:", isFavorited);
	}, [favoritePlaylist, song]);

	const handleClickDownloadBtn = async (e) => {
		handleDownload(e, song?.audio_url, song?.title, song?.user?.name);
	};

	const handleAddSongToPlaylist = async () => {
		await addSongToPlaylist({ song_id: song?.id });
	};

	return (
		<Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<div>
				<div className='2xl:max-w-10/12 w-full 2xl:px-0 px-10 mx-20'>
					<div className='w-full py-6 flex items-center justify-start gap-5 mb-6'>
						{/* Play button */}
						{allSongs?.length > 0 && (
							<div
								className='
									size-12 bg-[#1ED760] 
									hover:bg-[#3BE477] hover:scale-[1.03] 
									shadow-lg rounded-full flex items-center justify-center'>
								<Button
									type='primary'
									icon={
										isPlaying ? (
											<PauseIcon
												width='30'
												height='30'
												className='!bg-[#1ED760]'
											/>
										) : (
											<PlayIcon width='30' height='30' />
										)
									}
									className='!rounded-full !text-3xl !text-center !mx-auto !w-full !bg-transparent !text-black'
									onClick={onPlaySong}
								/>
							</div>
						)}

						{song && (
							<>
								<AiOutlinePlusCircle className='text-5xl text-white hover:scale-[1.1] cursor-pointer' />
								{isFavorited ? (
									<AiFillHeart
										className='text-5xl text-white hover:scale-[1.1] cursor-pointer'
										onClick={async () => {
											setIsFavorited(!isFavorited);
											await removeSongFromPlaylist(song?.id);
										}}
									/>
								) : (
									<AiOutlineHeart
										className='text-5xl text-white hover:scale-[1.1] cursor-pointer'
										onClick={async () => {
											setIsFavorited(!isFavorited);
											await addSongToPlaylist({
												playlist_id: favoritePlaylist.id,
												song_id: song.id,
											});
										}}
									/>
								)}
								<AiOutlineArrowDown
									className='text-5xl text-white hover:scale-[1.1] cursor-pointer'
									onClick={(e) => handleClickDownloadBtn(e)}
								/>
							</>
						)}
					</div>

					{user && (
						<SongListWrap songList={allSongs} title='Songs by this user' />
					)}

					{song && (
						<SongListWrap
							title={`Other songs by ${song?.user?.name}`}
							songList={allSongs}
						/>
					)}
				</div>
			</div>
		</Suspense>
	);
};

export default React.memo(MainContent);
