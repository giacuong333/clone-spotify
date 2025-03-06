import React from "react";
import PlusCircleIcon from "../PlusCircleIcon";
import ThreeDotsIcon from "../ThreeDotsIcon";
import PlayIcon from "../PlayIcon";

const SongItem = ({ item, order }) => {
  return (
    <li className='group'>
      <div className='px-4 py-2 flex items-center justify-between group-hover:bg-white/25 rounded'>
        <div className='flex items-center gap-4'>
          <>
            <PlayIcon className='group-hover:block hidden w-4 h-4 text-white' />
            <p className='group-hover:hidden text-white/50'>{order}</p>
          </>
          <div className='flex items-center gap-4'>
            <div className='max-w-10 h-auto rounded-md overflow-hidden'>
              <img
                // NOTE: this is sample item?.image
                src='https://i.scdn.co/image/ab67616d00001e02a1bc26cdd8eecd89da3adc39'
                alt='Song'
                className='w-full h-full object-center object-cover'
              />
            </div>
            <p className='capitalize text-white hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
              {item?.name}
            </p>
          </div>
        </div>

        <div className='grow place-items-end me-40'>
          <p className='text-white/50 group-hover:text-white'>
            {item?.listeners}
          </p>
        </div>

        <div className='flex items-center gap-4'>
          <span className='opacity-0 group-hover:opacity-100'>
            <PlusCircleIcon className='w-4 h-4 text-white/75 cursor-pointer hover:text-white' />
          </span>
          <p className='text-white/50'>{item?.duration}</p>
          <span className='opacity-0 group-hover:opacity-100'>
            <ThreeDotsIcon className='w-6 h-6 text-white/75 cursor-pointer hover:text-white' />
          </span>
        </div>
      </div>
    </li>
  );
};

export default React.memo(SongItem);
