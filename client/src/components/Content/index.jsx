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
    <div className='2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-10 p-6 flex flex-col gap-8'>
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
  );
};

export default Content;
