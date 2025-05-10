import React from "react";
import SongItem from "../SongItem";

const SongList = ({ songList, playlistId }) => {
    console.log("Playlist ID:", playlistId); // Kiểm tra giá trị playlistId
    console.log("Song list", songList);

    if (songList?.length === 0) {
        return <p className='text-white'>No songs</p>;
    }

    return (
        <ul className='flex flex-col gap-2'>
            {songList?.map((item, index) => {
                return <SongItem key={item?.id} item={item} order={index + 1} playlistId={playlistId} />;
            })}
        </ul>
    );
};

export default React.memo(SongList);
