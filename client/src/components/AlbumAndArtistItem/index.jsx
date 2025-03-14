import React from "react";
import { Button } from "antd";
import PlayIcon from "../PlayIcon";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const AlbumAndArtistItem = ({ item, type }) => {
  const navigate = useNavigate();

  return (
    <li className='w-full h-full group' onClick={() => navigate(paths.details)}>
      <div className='w-full flex flex-col items-start justify-center cursor-pointer hover:bg-neutral-800 p-4 rounded-md'>
        {/* Image */}
        <div className='min-h-32 min-w-32 relative'>
          <img
            src={item?.image}
            alt={item?.name}
            className={`w-full h-full object-center object-cover ${
              type === "album" ? "rounded-lg" : "rounded-full"
            }`}
          />

          {/* Play button */}
          <div
            className='
                absolute right-2 bottom-2 size-12 bg-[#1ED760] 
                opacity-0 translate-y-2 
                hover:bg-[#3BE477] hover:scale-[1.05] 
                group-hover:translate-y-0 group-hover:opacity-100 
                shadow-lg rounded-full flex items-center justify-center
                transition-all duration-500'>
            <Button
              type='primary'
              icon={<PlayIcon width='30' height='30' />}
              className='!rounded-full !text-3xl !text-center !mx-auto !w-full !bg-transparent !text-black'
            />
          </div>
        </div>

        {/* Texts */}
        <div className='mt-2'>
          <p className='hover:underline text-white truncate'>{item?.name}</p>
          <p className='text-gray-400 text-sm'>{item?.type}</p>
        </div>
      </div>
    </li>
  );
};

export default AlbumAndArtistItem;
