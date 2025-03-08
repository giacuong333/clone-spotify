import React from "react";
import SongItem from "../SongItem";

const SongList = ({ songList, isSearch }) => {
  return (
    <ul className='flex flex-col gap-2'>
      {songList?.map((item, index) => {
        return <SongItem key={item?.id} item={item} order={index + 1} />;
      })}
    </ul>
  );
};

export default React.memo(SongList);
