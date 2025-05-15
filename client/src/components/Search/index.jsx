import React, { useEffect, useMemo, useState } from "react";
import { Button, Popover, Spin } from "antd";
import PlayIcon from "../Icons/PlayIcon";
import PauseIcon from "../Icons/PauseIcon";
import SongList from "../SongList";
import { useSearch } from "../../contexts/Search";
import { usePlayer } from "../../contexts/Player";
import { useGenre } from "../../contexts/genre";
import { CloseOutlined } from "@ant-design/icons";
import SearchResult from "./SearchResult";

const types = [
	{ id: 1, name: "All" },
	{ id: 2, name: "Songs" },
	{ id: 3, name: "Playlists" },
	{ id: 4, name: "Users" },
	{ id: 5, name: "Genres" },
];

const Search = () => {
	const [toggleShowGenre, setToggleShowGenre] = useState(false);
	const {
		searchResult,
		searchInput,
		type,
		setType,
		handleSearch,
		genre,
		setGenre,
		loadingSearchResult,
	} = useSearch();
	const { playSong, currentSong } = usePlayer();
	const { fetchGenreList, genreList } = useGenre();

	useEffect(() => {
		if (toggleShowGenre) fetchGenreList();
	}, [fetchGenreList, toggleShowGenre]);

	useEffect(() => {
		if (!type?.id) setType(types[0]);
	}, []);

	useEffect(() => {
		if (searchInput || type || genre) {
			handleSearch();
		}
	}, [searchInput, type, genre, handleSearch]);

	return (
		<React.Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<section className='2xl:max-w-10/12 w-full min-h-screen mx-auto 2xl:px-0 px-10 py-4'>
				{/* Type filter */}
				<div>
					<ul className='flex items-center gap-3 w-full flex-wrap'>
						{types.map((t) => {
							const isGenre = t.name === "Genres";
							const isSelected = t.id === type?.id;

							const typeButton = (
								<p
									className={`
										text-white px-4 py-1 cursor-pointer 
										bg-white/10 hover:bg-white/20 rounded-full w-fit truncate text-sm 
										${isSelected ? "!bg-white !text-black" : ""}
									`}
									onClick={() => {
										setType(t);
										if (!isGenre) {
											setToggleShowGenre(false);
											setGenre(""); // Clear genre if switching type
										}
									}}>
									{t.name}
								</p>
							);

							return (
								<li key={t.id} className='w-fit'>
									{isGenre ? (
										<Popover
											content={
												<ul className='flex flex-col max-h-72 overflow-y-auto'>
													{genreList?.map((item) => (
														<li key={item?.id}>
															<button
																className='text-white hover:bg-white/10 rounded px-3 py-1 w-full text-left'
																onClick={() => {
																	setGenre(item?.name);
																	setToggleShowGenre(false);
																}}>
																{item?.name}
															</button>
														</li>
													))}
												</ul>
											}
											trigger='click'
											arrow={false}
											open={toggleShowGenre}
											color='black'
											onOpenChange={(open) => {
												setToggleShowGenre(open);
												if (open) setType(t);
											}}>
											{typeButton}
										</Popover>
									) : (
										typeButton
									)}
								</li>
							);
						})}

						{/* Display selected genre with clear button */}
						{genre && (
							<li className='w-fit flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-sm'>
								{genre}
								<CloseOutlined
									className='cursor-pointer'
									onClick={() => setGenre("")}
								/>
							</li>
						)}
					</ul>
				</div>

				{/* Render search results */}
				{loadingSearchResult ? (
					<div className='flex-1 flex items-center justify-center h-60'>
						<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
					</div>
				) : (
					<SearchResult searchResult={searchResult} type={type} />
				)}
			</section>
		</React.Suspense>
	);
};

export default React.memo(Search);
