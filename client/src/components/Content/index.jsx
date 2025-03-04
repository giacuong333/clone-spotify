import React from "react";
import AlbumAndArtistWrap from "../AlbumAndArtistWrap";

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

const Content = () => {
  return (
    <div className='rounded-lg bg-[#121212] overflow-hidden h-full w-full'>
      <div className='max-w-7xl mx-auto w-full p-6 flex flex-col gap-8 min-h-screen max-h-screen overflow-y-scroll'>
        <AlbumAndArtistWrap title='Popular artists' list={list} type='artist' />
        <AlbumAndArtistWrap
          title='Popular albums and singles'
          list={list}
          type='album'
        />
        <AlbumAndArtistWrap title='Popular artists' list={list} type='artist' />
        <AlbumAndArtistWrap
          title='Popular albums and singles'
          list={list}
          type='album'
        />
        <AlbumAndArtistWrap title='Popular artists' list={list} type='artist' />
        <AlbumAndArtistWrap
          title='Popular albums and singles'
          list={list}
          type='album'
        />
      </div>
    </div>
  );
};

export default Content;
