import { lazy, Suspense, useRef, useEffect } from "react";
import { useUser } from "../../contexts/User";
import { Spin } from "antd";
import AlbumAndArtistWrap from "../AlbumAndArtistWrap";

const Header = lazy(() => import("./Header"));
const Cover = lazy(() => import("./Cover"));
const MainContent = lazy(() => import("./MainContent"));

const songList = [
  {
    id: 1,
    imageUrl: "",
    name: "Mất Kết Nối",
    listeners: "25,661,983",
    duration: "3:27",
  },
  {
    id: 2,
    imageUrl: "",
    name: "Tràn Bộ Nhớ",
    listeners: "9,378,924",
    duration: "3:30",
  },
  {
    id: 3,
    imageUrl: "",
    name: "HÀO QUANG(feat.RHYDER, Dương Mic & Pháp Kiều) HÀO QUANG(feat.RHYDER, Dương Mic & Pháp Kiều)",
    listeners: "2,345,677",
    duration: "4:12",
  },
  {
    id: 4,
    imageUrl: "",
    name: "Pin Dự Phòng",
    listeners: "21,357,833",
    duration: "3:18",
  },
  {
    id: 5,
    imageUrl: "",
    name: "LÀN ƯU TIÊN",
    listeners: "15,113,644",
    duration: "4:05",
  },
  {
    id: 6,
    imageUrl: "",
    name: "Yêu Em 2 Ngày",
    listeners: "3,876,990",
    duration: "2:52",
  },
];

const albumList = [
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

const followingList = [
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
]

const Profile = () => {
  const contentRef = useRef(null);
  const { userDetail, fetchUserDetail } = useUser();

  useEffect(() => {
    fetchUserDetail("680756213e4af1765d235d7d");
  }, []);

  return (
    <Suspense
      fallback={
        <Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
      }>
      <div className='w-full h-full overflow-y-auto' ref={contentRef}>
        <Header name={userDetail?.name || "Demo"} contentRef={contentRef} />
        <Cover
          user={userDetail}
          followingCount={10}
          playlistCount={5}
        />
        <MainContent songList={songList} user = {userDetail}/>
        <div className='mt-10 flex flex-col gap-10'>
          <AlbumAndArtistWrap
            title='Public Playlists'
            list={albumList}
            type='album'
          />

          <AlbumAndArtistWrap
            title='Following'
            list={followingList}
            type='artist'
          />
        </div>
      </div>
    </Suspense>
  );
};

export default Profile;
