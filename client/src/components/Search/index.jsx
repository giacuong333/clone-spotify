import React from "react";
import { useSearch } from "../../contexts/Search";
import { Button, Spin } from "antd";
import PlayIcon from "../PlayIcon";
import SongList from "../SongList";
import { types } from "../../contexts/Search";

const songList = [
  {
    id: 1,
    imageUrl: "",
    name: "Mất Kết Nối",
    artist: "Đen Vâu",
    listeners: "25,661,983",
    duration: "3:27",
  },
  {
    id: 2,
    imageUrl: "",
    name: "Tràn Bộ Nhớ",
    artist: "Dương Domic",
    listeners: "9,378,924",
    duration: "3:30",
  },
  {
    id: 3,
    imageUrl: "",
    name: "HÀO QUANG(feat.RHYDER, Dương Mic & Pháp Kiều) HÀO QUANG(feat.RHYDER, Dương Mic & Pháp Kiều)",
    artist: "Tùng Dương",
    listeners: "2,345,677",
    duration: "4:12",
  },
  {
    id: 4,
    imageUrl: "",
    name: "Pin Dự Phòng",
    artist: "GDragon",
    listeners: "21,357,833",
    duration: "3:18",
  },
  {
    id: 5,
    imageUrl: "",
    name: "LÀN ƯU TIÊN",
    artist: "Đen Vâu",
    listeners: "15,113,644",
    duration: "4:05",
  },
  {
    id: 6,
    imageUrl: "",
    name: "Yêu Em 2 Ngày",
    artist: "Đen Vâu",
    listeners: "3,876,990",
    duration: "2:52",
  },
];

const list = [
  {
    id: 1,
    name: "Duong Domic",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 2,
    name: "HIEUTHUHAI",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 3,
    name: "Sơn Tùng M-TP",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 4,
    name: "ANH TRAI 'SAY HI'",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 5,
    name: "ERIK",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 6,
    name: "buitruonglinh",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
];

const Search = () => {
  const { searchCategory, setSearchCategory } = useSearch();

  return (
    <React.Suspense
      fallback={
        <Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
      }>
      <section className='2xl:max-w-10/12 w-full max-h-screen min-h-screen mx-auto 2xl:px-0 px-10 py-4'>
        {/* Type search */}
        <div>
          <ul className='flex items-center gap-3 w-full'>
            {Object.values(types).map((type) => {
              return (
                <li
                  key={type}
                  className='w-fit'
                  onClick={() => setSearchCategory(type)}>
                  <p
                    className={`text-white px-4 py-1 cursor-pointer bg-white/10 hover:bg-white/20 rounded-full w-fit truncate text-sm ${
                      type === searchCategory ? "!bg-white !text-black" : ""
                    }`}>
                    {type}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className='grid grid-cols-12 gap-4 mt-10'>
          {/* Top result */}
          <div className='col-span-3 h-[310px]'>
            <div className=''>
              <p className='text-white text-2xl font-bold mb-2'>Top result</p>
              <div className='bg-white/5 hover:bg-white/10 rounded-lg p-6 pb-16 transition-all duration-500 cursor-pointer relative group h-full overflow-hidden'>
                <span className='flex flex-col gap-2'>
                  <div className='w-24 h-auto overflow-hidden rounded-full'>
                    <img
                      src='https://i.scdn.co/image/ab6761610000517491d2d39877c13427a2651af5'
                      alt='Thumnail'
                      className='w-full h-full object-center object-cover'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <p className='text-white text-4xl font-bold'>Đen</p>
                    <p className='text-white/55'>Artist</p>
                  </div>
                </span>
                {/* Play button */}
                <div
                  className='
                absolute right-4 bottom-4 size-12 bg-[#1ED760] 
                opacity-0 translate-y-2 
                hover:bg-[#3BE477] hover:scale-[1.05] 
                group-hover:translate-y-0 group-hover:opacity-100 
                shadow-2xl rounded-full flex items-center justify-center
                transition-all duration-500'>
                  <Button
                    type='primary'
                    icon={<PlayIcon width='30' height='30' />}
                    className='!rounded-full !text-3xl !text-center !mx-auto !w-full !bg-transparent !text-black'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Songs */}
          <div className='col-span-9 h-[310px]'>
            <div className='max-h-full overflow-hidden'>
              <p className='text-white text-2xl font-bold mb-2'>Songs</p>
              <SongList songList={songList} isSearch />
            </div>
          </div>
        </div>

        {/* Featured artists, songs */}
        <div></div>
      </section>
    </React.Suspense>
  );
};

export default React.memo(Search);
