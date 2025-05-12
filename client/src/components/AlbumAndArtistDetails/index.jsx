import React, {
	lazy,
	memo,
	Suspense,
	useEffect,
	useRef,
	useState,
} from "react";
import { Spin } from "antd";
import AlbumAndArtistWrap from "../AlbumAndArtistWrap";
import SongCover from "./SongCover";
import { useSearchParams } from "react-router-dom";
import { useSong } from "../../contexts/Song";
import { useUser } from "../../contexts/User";
import { usePlaylist } from "../../contexts/Playlist";
import UserCover from "./UserCover.jsx";
import { notify } from "../Toast/index.jsx";
import { usePlayer } from "../../contexts/Player/index.jsx";

const Header = lazy(() => import("./Header"));
const MainContent = lazy(() => import("./MainContent"));

const AlbumAndArtistDetails = () => {
	const contentRef = useRef(null);

	const [searchParams] = useSearchParams();
	const type = searchParams.get("type");
	const detailsId = searchParams.get("detailsId");
	console.log(detailsId);

	const { fetchSongDetails } = useSong();
	const { fetchUserDetail } = useUser();
	const { fetchPlaylistsByUser } = usePlaylist();
	const [userDetails, setUserDetails] = React.useState(null);
	const [publicPlaylists, setPublicPlaylists] = React.useState([]);
	const [songDetails, setSongDetails] = React.useState(null);
	const [songsByUser, setSongsByUser] = useState([]);
	const { fetchSongsByUserId } = useSong();
	const { playSong, togglePlay } = usePlayer();
	const { addSongToPlaylíst } = usePlaylist();

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				console.log("Fetching details for ID:", detailsId);
				if (type === "song") {
					const songDetailsResponse = await fetchSongDetails(detailsId);
					if (songDetailsResponse && songDetailsResponse.status === 200) {
						setSongDetails(songDetailsResponse.data);
						console.log("Song details:", songDetailsResponse.data);
					}
				} else if (type === "user") {
					const [user, playlists, songs] = await Promise.all([
						fetchUserDetail(detailsId),
						fetchPlaylistsByUser(detailsId),
						fetchSongsByUserId(detailsId),
					]);
					setUserDetails(user);
					setPublicPlaylists(playlists?.data || []);
					setSongsByUser(songs?.data?.songs_by_user || []);
				}
			} catch (error) {
				console.log("Error response:", error.response);
				notify("Error fetching details", "error");
			}
		};
		fetchDetails();
	}, [
		detailsId,
		fetchPlaylistsByUser,
		fetchSongDetails,
		fetchSongsByUserId,
		fetchUserDetail,
		type,
	]);

	const handlePlaySong = () => {
		playSong(songDetails, songsByUser);
	};

	return (
		<Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<div className='w-full h-full overflow-y-auto' ref={contentRef}>
				<Header
					name={songDetails?.title || userDetails?.name || "Demo"}
					contentRef={contentRef}
				/>
				{type === "user" && (
					<>
						<UserCover
							user={userDetails}
							playlistCount={publicPlaylists.length || 0}
							songCount={songsByUser.length || 0}
						/>

						<MainContent user={userDetails} />

						<div className='mt-10 flex flex-col gap-10'>
							<AlbumAndArtistWrap
								title='Public playlists'
								list={publicPlaylists}
								type='album'
							/>
						</div>
					</>
				)}
				{type === "song" && (
					<>
						<SongCover song={songDetails} />
						<MainContent
							song={songDetails}
							user={userDetails}
							onPlaySong={handlePlaySong}
						/>
					</>
				)}
			</div>
		</Suspense>
	);
};

export default memo(AlbumAndArtistDetails);
