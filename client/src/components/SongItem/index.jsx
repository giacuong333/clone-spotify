import React from "react";
import PlusCircleIcon from "../Icons/PlusCircleIcon";
import ThreeDotsIcon from "../Icons/ThreeDotsIcon";
import PlayIcon from "../Icons/PlayIcon";
import formatTime from "../../utils/formatTime";
import { usePlaylist } from "../../contexts/playlist"; // Import context

const SongItem = ({ item, order, playlistId }) => {
  const { addSongToPlaylist } = usePlaylist(); // Lấy hàm từ context

  const handleAddSong = async () => {
    try {
      await addSongToPlaylist(playlistId, item.id); // Gọi hàm thêm bài hát
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  return (
    <li className="group">
      <div className="px-4 py-2 flex items-center justify-between group-hover:bg-white/25 rounded">
        <div className="flex items-center gap-4">
          <>
            <PlayIcon className="group-hover:block hidden w-4 h-4 text-white" />
            <p className="group-hover:hidden text-white/50">{order}</p>
          </>
          <div className="flex items-center gap-4">
            <div className="max-w-10 h-auto rounded-md overflow-hidden">
              <img
                src={item?.cover_url}
                alt="Song"
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <p className="capitalize text-white font-semibold hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit">
                {item?.title}
              </p>
              <p className="capitalize text-white/75 group-hover:text-white font-semibold text-sm hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit">
                {item?.genre?.map((g) => g.name).join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="grow place-items-end me-40">
          <p className="text-white/50 group-hover:text-white">
            {item?.listeners}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="opacity-0 group-hover:opacity-100"
            onClick={handleAddSong} // Gọi hàm khi nhấn vào dấu cộng
          >
            <PlusCircleIcon className="w-4 h-4 text-white/75 cursor-pointer hover:text-white" />
          </span>
          <p className="text-white/50">{formatTime(item?.duration)}</p>
          <span className="opacity-0 group-hover:opacity-100">
            <ThreeDotsIcon className="w-6 h-6 text-white/75 cursor-pointer hover:text-white" />
          </span>
        </div>
      </div>
    </li>
  );
};

export default React.memo(SongItem);
