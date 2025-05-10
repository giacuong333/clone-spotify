// client/src/pages/StatisticsPage/index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Spin, Alert, List, Card, Avatar, Typography, Pagination, Empty, Tag, Button, Tooltip as AntTooltip } from 'antd';
import {
    BarChartOutlined,
    UserOutlined,
    DownloadOutlined,
    CustomerServiceOutlined,
    PlayCircleFilled,
    VideoCameraOutlined,
    AudioOutlined,
    InfoCircleOutlined,
    GlobalOutlined,
    CrownOutlined,
    CalendarOutlined, // Icon cho ngày phát hành
    ClockCircleOutlined, // Icon cho thời lượng
} from '@ant-design/icons';
import { useAuth } from '../../contexts/Auth';
import { instance } from '../../contexts/Axios';
import { apis } from '../../constants/apis';
import { useNavigate } from 'react-router-dom';
import paths from '../../constants/paths';
import { usePlayer } from '../../contexts/Player';
import formatTime from '../../utils/formatTime';
import formatDate from '../../utils/formatDate'; // Import hàm formatDate

// Import Chart.js components
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartJsTitle,
    Tooltip as ChartJsTooltip,
    Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartJsTitle,
    ChartJsTooltip,
    Legend
);

const { Title, Text, Paragraph } = Typography;

// Component con để hiển thị một bài hát trong danh sách thống kê - PHIÊN BẢN "SIÊU WOW"
const SongStatItem = ({ item, type, rank, playSongFromStats, songsInList }) => {
    const song = item.song;
    let count = 0;
    let countTypeLabel = ""; // Label cho loại count, ví dụ: "lượt nghe", "lượt tải"
    let CountIconComponent = CustomerServiceOutlined; // Icon mặc định
    let countColorClass = "text-green-400";

    // Xác định count và các thuộc tính hiển thị dựa trên 'type'
    if (type.includes('history_listened') || type === 'listened') {
        count = type.includes('history') ? item.user_listen_count : item.total_listens;
        countTypeLabel = "nghe";
        CountIconComponent = CustomerServiceOutlined;
        countColorClass = "text-green-400";
    }
    // Xử lý cho download, đặc biệt là khi type có cả listened và downloaded (cho history)
    if (type.includes('history_downloaded') || type === 'downloaded') {
        const downloadCountVal = type.includes('history') ? item.user_download_count : item.total_downloads;
        // Nếu là history và có cả nghe lẫn tải, sẽ render 2 dòng riêng
        // Nếu chỉ có download hoặc là top downloaded và downloadCountVal > 0
        if (!type.includes('history_listened') && downloadCountVal > 0) {
            count = downloadCountVal;
            countTypeLabel = "tải";
            CountIconComponent = DownloadOutlined;
            countColorClass = "text-sky-400";
        } else if (type.includes('history_listened') && downloadCountVal === 0 && count === 0) {
            // Trường hợp history chỉ có download (listen = 0)
             count = downloadCountVal;
             countTypeLabel = "tải";
             CountIconComponent = DownloadOutlined;
             countColorClass = "text-sky-400";
        }
    }


    const navigate = useNavigate();
    const { playSong, currentSong, isPlaying } = usePlayer();
    const isCurrentlyPlaying = currentSong?.id === song?.id && isPlaying;

    const handlePlaySong = (e) => {
        e.stopPropagation();
        if (song) {
            if (playSongFromStats) playSongFromStats(song);
            else playSong(song, songsInList || [song]);
        }
    };

    const handleCardClick = () => {
        if (song && song.id) navigate(`${paths.details}?detailsId=${song.id}&type=song`);
    };

    const mediaTypeIcon = song?.video_url
        ? <AntTooltip title="Video"><VideoCameraOutlined className="text-blue-400 hover:text-blue-300 transition-colors" /></AntTooltip>
        : <AntTooltip title="Audio"><AudioOutlined className="text-purple-400 hover:text-purple-300 transition-colors" /></AntTooltip>;

    const renderMainStats = () => (
        <div className={`flex items-center ${countColorClass} font-semibold`}>
            <CountIconComponent className="mr-2" />
            {count} {countTypeLabel}
        </div>
    );
    
    const renderSecondaryDownloadStat = () => {
        // Chỉ render cho history item nếu có cả listen và download
        if (type.includes('history_listened') && type.includes('history_downloaded') && item.user_download_count > 0) {
            return (
                <div className="flex items-center text-sky-400 font-semibold mt-1">
                    <DownloadOutlined className="mr-2" />
                    {item.user_download_count} tải
                </div>
            );
        }
        return null;
    };


    return (
        <List.Item
            className="group bg-neutral-800/60 hover:bg-neutral-700/80 p-4 rounded-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 ease-in-out mb-4 border border-neutral-700 hover:border-green-600/70"
            onClick={handleCardClick}
        >
            <div className="flex items-center w-full">
                {rank && (
                    <div className="w-12 text-center mr-4">
                        <Text className="text-2xl font-bold text-neutral-500 group-hover:text-green-400 transition-colors">{rank}</Text>
                    </div>
                )}
                <Avatar
                    src={song?.cover_url || 'https://placehold.co/80x80/121212/1DB954?text=S&font=Montserrat'}
                    size={64}
                    shape="square"
                    className="rounded-md border border-neutral-600"
                />
                <div className="flex-1 mx-4 min-w-0">
                    <Title level={5} className={`!text-white !mb-1 truncate ${isCurrentlyPlaying ? '!text-green-400 font-bold' : 'group-hover:!text-green-300'}`} title={song?.title}>
                        {song?.title || 'Không có tiêu đề'}
                    </Title>
                    <Paragraph className="text-neutral-400 text-sm truncate mb-1.5 group-hover:text-neutral-200" title={song?.user?.name || 'Không rõ nghệ sĩ'}>
                        {song?.user?.name || 'Không rõ nghệ sĩ'}
                    </Paragraph>
                    <div className="flex items-center text-xs text-neutral-500 space-x-3">
                        <span className="flex items-center" title={song?.video_url ? "Video" : "Audio"}>{mediaTypeIcon}</span>
                        <AntTooltip title="Thời lượng">
                            <span className="flex items-center"><ClockCircleOutlined className="mr-1" />{formatTime(song?.duration || 0)}</span>
                        </AntTooltip>
                        {song?.genre?.length > 0 && (
                             <AntTooltip title={`Thể loại: ${song.genre.map(g => g.name).join(', ')}`}>
                                <Tag color="blue" className="text-xs rounded hidden md:inline-block">
                                    {song.genre[0].name} {song.genre.length > 1 ? "..." : ""}
                                </Tag>
                             </AntTooltip>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end text-sm w-32 text-right"> {/* Cho phần stats */}
                    {renderMainStats()}
                    {renderSecondaryDownloadStat()}
                </div>
                <div className="ml-4"> {/* Cho nút play */}
                    <Button
                        icon={<PlayCircleFilled style={{ fontSize: '32px' }} />}
                        type="text"
                        className={`!text-neutral-300 hover:!text-green-400 focus:!text-green-400 transition-all duration-200 transform group-hover:scale-110 ${isCurrentlyPlaying ? '!text-green-400 !scale-110' : ''}`}
                        onClick={handlePlaySong}
                        disabled={!song?.audio_url && !song?.video_url}
                        aria-label={`Play ${song?.title}`}
                    />
                </div>
            </div>
        </List.Item>
    );
};


const RankedSongList = ({ title, fetchFunction, type, icon }) => {
  const [apiData, setApiData] = useState({ results: [], count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { playSong } = usePlayer();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fetchData = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(fetchFunction(), {
        params: { page, page_size: pageSize },
      });
      setApiData(response.data);
      if (response.data && response.data.results) {
        const labels = response.data.results.map(item => item.song.title.length > 20 ? item.song.title.substring(0, 20) + "..." : item.song.title);
        const dataPoints = response.data.results.map(item => type === 'listened' ? item.total_listens : item.total_downloads);
        
        setChartData({
          labels,
          datasets: [
            {
              label: type === 'listened' ? 'Lượt Nghe' : 'Lượt Tải',
              data: dataPoints,
              backgroundColor: type === 'listened' ? 'rgba(30, 215, 96, 0.8)' : 'rgba(29, 185, 84, 0.8)', // Spotify green, đậm hơn
              borderColor: type === 'listened' ? 'rgba(30, 215, 96, 1)' : 'rgba(29, 185, 84, 1)',
              borderWidth: 1,
              borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 }, // Bo góc trên
              barPercentage: 0.6, 
              categoryPercentage: 0.7,
            },
          ],
        });
      }
    } catch (err) {
      setError(err.response?.data?.detail || `Lỗi tải dữ liệu: ${title}`);
      setApiData({ results: [], count: 0, next: null, previous: null });
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, title, type]);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const playSongFromThisList = (songToPlay) => {
    const songListForPlayer = apiData.results.map(item => item.song);
    const songIndex = songListForPlayer.findIndex(s => s.id === songToPlay.id);
    playSong(songToPlay, songListForPlayer, songIndex >= 0 ? songIndex : 0);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: '#a0aec0', precision: 0, font: { size: 11, family: "'Inter', sans-serif" } }, // Màu xám hơn, font Inter
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        border: { color: 'rgba(255, 255, 255, 0.1)'}
      },
      y: {
        ticks: { color: '#cbd5e0', font: { size: 11, family: "'Inter', sans-serif" } },
        grid: { display: false },
        border: { display: false }
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: false }, // ChartJsTitle
      tooltip: { // ChartJsTooltip
        enabled: true,
        backgroundColor: 'rgba(18, 18, 18, 0.9)', // Màu nền tooltip đậm hơn
        titleColor: '#1DB954', // Màu title xanh Spotify
        bodyColor: '#E2E8F0', // Màu body sáng hơn
        padding: 12,
        cornerRadius: 6,
        borderColor: 'rgba(30, 215, 96, 0.5)',
        borderWidth: 1,
        displayColors: false,
        titleFont: { weight: 'bold', size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.x !== null) { label += context.parsed.x; }
                return label;
            },
            title: function(tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                return apiData.results[index]?.song?.title || '';
            }
        }
      }
    },
    animation: {
        duration: 1000,
        easing: 'easeOutExpo',
    },
    hover: {
        animationDuration: 0 // Tắt animation khi hover để tooltip hiện nhanh
    }
  };

  if (loading && apiData.results.length === 0) return <div className="flex justify-center items-center h-96 bg-neutral-800/50 rounded-xl shadow-lg"><Spin size="large" tip={`Đang tải ${title}...`} /></div>;
  if (error) return <Alert message="Lỗi Máy Chủ" description={error} type="error" showIcon className="mb-8 bg-red-900/40 border-red-700 text-red-300 [&_.ant-alert-message]:!text-red-200 [&_.ant-alert-description]:!text-red-300 [&_.ant-alert-icon]:!text-red-300 rounded-lg"/>;
  
  return (
    <Card
      title={<div className="flex items-center text-3xl font-semibold"><span className="mr-4 text-green-400">{icon}</span>{title}</div>}
      bordered={false}
      className="bg-neutral-800/70 text-white mb-16 shadow-xl rounded-xl border border-neutral-700/60"
      headStyle={{color: 'white', borderBottom: '1px solid rgba(255,255,255,0.15)', padding: '24px 32px', fontSize: '2rem'}}
      bodyStyle={{padding: '32px'}}
    >
      {(!apiData.results || apiData.results.length === 0) ? (
         <Empty description={<span className="text-neutral-400 text-lg">Chưa có dữ liệu cho {title}</span>} className="py-20"/>
      ) : (
        <div className="grid lg:grid-cols-5 gap-8 items-start"> {/* Thay đổi layout: List 3 cột, Chart 2 cột */}
          <div className="lg:col-span-2 h-[400px] md:h-[480px] bg-neutral-900/50 p-4 rounded-xl shadow-md border border-neutral-700/50">
            {chartData.labels.length > 0 ? (
              <Bar options={chartOptions} data={chartData} />
            ) : (
              <div className="flex justify-center items-center h-full text-neutral-500">Đang chuẩn bị biểu đồ...</div>
            )}
          </div>
          <div className="lg:col-span-3">
            <List
              itemLayout="horizontal"
              dataSource={apiData.results}
              loading={loading && apiData.results.length > 0}
              renderItem={(item, index) => (
                <SongStatItem 
                  item={item} 
                  type={type} 
                  rank={(currentPage - 1) * pageSize + index + 1} 
                  playSongFromStats={playSongFromThisList}
                />
              )}
            />
            {apiData.count > pageSize && (
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={apiData.count}
                onChange={handlePageChange}
                className="mt-8 text-center [&_button]:!text-white [&_li]:!bg-neutral-700/70 [&_li]:!border-neutral-600 hover:[&_li]:!border-green-500 [&_li.ant-pagination-item-active]:!border-green-500 [&_li.ant-pagination-item-active_a]:!text-green-400 [&_li_a]:!text-neutral-300 rounded-md"
                showSizeChanger={false}
              />
            )}
          </div>
        </div>
      )}
    </Card>
  );
};


const StatisticsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [userHistory, setUserHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserHistory = async () => {
        setLoadingHistory(true);
        setErrorHistory(null);
        try {
          const response = await instance.get(apis.users.getSongHistory());
          setUserHistory(response.data.song_history || []);
        } catch (err) {
          setErrorHistory(err.response?.data?.detail || 'Lỗi tải lịch sử nghe/tải.');
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchUserHistory();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black text-white min-h-screen font-'Inter',sans-serif"> {/* Font Inter */}
      <div className="max-w-screen-xl mx-auto"> {/* Container rộng hơn */}
        <header className="flex items-center mb-12 pt-6 pb-8 border-b-2 border-neutral-700/80">
          <BarChartOutlined className="text-7xl text-green-500 mr-6 drop-shadow-[0_4px_10px_rgba(30,215,96,0.5)]" />
          <div>
            <Title level={1} className="!text-white !mb-1 tracking-tighter font-black text-5xl">Thống Kê Âm Nhạc</Title>
            <Paragraph className="text-neutral-400 text-lg">Khám phá xu hướng và lịch sử nghe của bạn.</Paragraph>
          </div>
        </header>

        {isAuthenticated && user && (
          <section className="mb-20"> {/* Tăng khoảng cách section */}
            <Card
              title={<div className="flex items-center text-3xl font-semibold"><UserOutlined className="mr-4 text-green-400"/>Lịch Sử Của {user.name}</div>}
              bordered={false}
              className="bg-neutral-800/70 text-white shadow-xl rounded-xl border border-neutral-700/60"
              headStyle={{color: 'white', borderBottom: '1px solid rgba(255,255,255,0.15)', padding: '24px 32px', fontSize: '2rem'}}
              bodyStyle={{padding: '32px'}}
            >
              {loadingHistory && <div className="flex justify-center items-center h-60"><Spin tip="Đang tải lịch sử của bạn..." size="large"/></div>}
              {errorHistory && <Alert message="Rất Tiếc :(" description={errorHistory} type="error" showIcon className="bg-red-900/40 border-red-700 text-red-300 [&_.ant-alert-message]:!text-red-200 [&_.ant-alert-description]:!text-red-300 [&_.ant-alert-icon]:!text-red-300 rounded-lg"/>}
              {!loadingHistory && !errorHistory && userHistory.length === 0 && (
                <Empty description={<span className="text-neutral-400 text-lg">Bạn chưa "cày" bài nào cả, nghe nhạc thôi!</span>} className="py-20"/>
              )}
              {!loadingHistory && !errorHistory && userHistory.length > 0 && (
                <List
                  itemLayout="horizontal"
                  dataSource={userHistory}
                  renderItem={(item) => (
                    <SongStatItem 
                      item={item} 
                      type={
                        (item.user_listen_count > 0 ? 'history_listened ' : '') + 
                        (item.user_download_count > 0 ? 'history_downloaded' : '')
                      }
                      songsInList={userHistory.map(uh => uh.song)}
                    />
                  )}
                />
              )}
            </Card>
          </section>
        )}
        {!isAuthenticated && (
          <Alert 
            message={<span className="font-bold text-sky-100 text-xl">Khám Phá Nhiều Hơn!</span>}
            description={<Paragraph className="!text-sky-200 !mb-0">Vui lòng <Button type="link" onClick={() => navigate(paths.login)} className="!px-1 !text-green-300 hover:!text-green-200 !font-bold !text-base underline">đăng nhập</Button> để xem lịch sử nghe nhạc cá nhân và các tính năng độc quyền khác.</Paragraph>} 
            type="info" 
            showIcon 
            icon={<InfoCircleOutlined className="text-2xl"/>}
            className="mb-20 bg-gradient-to-r from-sky-800/70 to-sky-700/50 border-2 border-sky-600/80 text-sky-100 rounded-xl shadow-lg p-6"
          />
        )}

        <RankedSongList 
          title="Top Bài Hát Nghe Nhiều" 
          fetchFunction={apis.songs.getTopListened} 
          type="listened"
          icon={<GlobalOutlined />}
        />

        <RankedSongList 
          title="Top Bài Hát Tải Nhiều" 
          fetchFunction={apis.songs.getTopDownloaded} 
          type="downloaded"
          icon={<CrownOutlined />}
        />
      </div>
    </div>
  );
};

export default StatisticsPage;
