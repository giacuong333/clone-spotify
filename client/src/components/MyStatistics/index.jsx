import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
	Music,
	Clock,
	Upload,
	Headphones,
	Download,
	BarChart,
	PieChart,
	Users,
} from "lucide-react";
import {
	Chart as ChartJS,
	ArcElement,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";
import { instance } from "../../contexts/Axios";
import { apis } from "../../constants/apis";

// Register ChartJS components
ChartJS.register(
	ArcElement,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend
);

// Card component
const Card = ({ title, children, icon, className = "" }) => {
	const Icon = icon;
	return (
		<div className={`bg-gray-900 rounded-lg p-4 shadow-lg ${className}`}>
			<div className='flex items-center mb-4'>
				<div className='bg-gray-800 p-2 rounded-md mr-3'>
					<Icon size={18} className='text-green-500' />
				</div>
				<h3 className='text-lg font-medium text-white'>{title}</h3>
			</div>
			{children}
		</div>
	);
};

// Format timestamp to relative time
const formatRelativeTime = (timestamp) => {
	const now = new Date();
	const date = new Date(timestamp);
	const diff = Math.floor((now - date) / 1000);
	if (diff < 60) return "Just now";
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	return `${Math.floor(diff / 86400)}d ago`;
};

// Format duration to minutes and seconds
const formatDuration = (seconds) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Color mapping for genres
const getGenreColor = (genre) => {
	const colorMap = {
		Pop: "#1ed760",
		Classical: "#9b59b6",
		Country: "#f39c12",
		Rock: "#e74c3c",
		Electronic: "#3498db",
		"R&B": "#2ecc71",
		Reggae: "#f1c40f",
		Blues: "#34495e",
		Jazz: "#16a085",
	};
	return colorMap[genre] || "#95a5a6";
};

// Main MyStatistics component
const MyStatistics = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [timeRange, setTimeRange] = useState("30");
	const [recentlyPlayedData, setRecentlyPlayedData] = useState({
		results: [],
		count: 0,
	});
	const [uploadStatsData, setUploadStatsData] = useState({
		results: [],
		total_plays: 0,
		total_downloads: 0,
		total_uploads: 0,
		time_period: "all",
	});
	const [genreStatsData, setGenreStatsData] = useState({
		results: [],
		total_plays: 0,
		genres_count: 0,
		time_range_days: 30,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch data based on timeRange
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				// Fetch recently played
				const recentlyPlayedResponse = await instance.get(
					`${apis.my_statistics.recentlyPlayed()}?limit=10`
				);
				if (recentlyPlayedResponse?.status === 200) {
					setRecentlyPlayedData(recentlyPlayedResponse.data);
				}

				// Fetch upload stats
				const period =
					timeRange === "7"
						? "week"
						: timeRange === "30"
						? "month"
						: timeRange === "365"
						? "year"
						: "all";
				const uploadStatsResponse = await instance.get(
					`${apis.my_statistics.uploadStats()}?period=${period}&sort_by=play_count&order=desc`
				);
				if (uploadStatsResponse?.status === 200) {
					setUploadStatsData(uploadStatsResponse.data);
				}

				// Fetch genre stats
				const days = timeRange === "all" ? 3650 : parseInt(timeRange);
				const genreStatsResponse = await instance.get(
					`${apis.my_statistics.genreStats()}?days=${days}`
				);
				if (genreStatsResponse?.status === 200) {
					setGenreStatsData(genreStatsResponse.data);
				}
			} catch (err) {
				setError("Failed to fetch data. Please try again.");
				console.error("Fetch error:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [timeRange]);

	// Prepare chart data
	const genrePieData = {
		labels: genreStatsData.results.slice(0, 5).map((genre) => genre.name),
		datasets: [
			{
				data: genreStatsData.results
					.slice(0, 5)
					.map((genre) => genre.percentage),
				backgroundColor: genreStatsData.results
					.slice(0, 5)
					.map((genre) => getGenreColor(genre.name)),
				borderColor: "#1a1a1a",
				borderWidth: 1,
			},
		],
	};

	const barChartData = {
		labels: genreStatsData.results.slice(0, 6).map((genre) => genre.name),
		datasets: [
			{
				label: "Plays",
				data: genreStatsData.results
					.slice(0, 6)
					.map((genre) => genre.play_count),
				backgroundColor: "#1ed760",
				borderColor: "#1ed760",
				borderWidth: 1,
			},
			{
				label: "Songs",
				data: genreStatsData.results
					.slice(0, 6)
					.map((genre) => genre.song_count),
				backgroundColor: "#3498db",
				borderColor: "#3498db",
				borderWidth: 1,
			},
		],
	};

	const uploadBarData = {
		labels: uploadStatsData.results.map((item) => item.song.title),
		datasets: [
			{
				label: "Plays",
				data: uploadStatsData.results.map((item) => item.play_count),
				backgroundColor: "#1ed760",
				borderColor: "#1ed760",
				borderWidth: 1,
			},
			{
				label: "Downloads",
				data: uploadStatsData.results.map((item) => item.download_count),
				backgroundColor: "#3498db",
				borderColor: "#3498db",
				borderWidth: 1,
			},
		],
	};

	const getTimeRangeLabel = (days) => {
		if (days === "7") return "Last week";
		if (days === "30") return "Last month";
		if (days === "90") return "Last 3 months";
		if (days === "365") return "Last year";
		return "All time";
	};

	// Chart options
	const pieChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					color: "#fff",
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => `${context.label}: ${context.raw.toFixed(1)}%`,
				},
			},
		},
	};

	const barChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: "#fff",
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: "#fff",
				},
				grid: {
					display: false,
				},
			},
			y: {
				ticks: {
					color: "#fff",
				},
				grid: {
					color: "#333",
				},
			},
		},
	};

	if (loading) {
		return (
			<div className='flex-1 flex items-center justify-center h-full'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-[#121212] flex items-center justify-center text-red-500'>
				{error}
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#121212] text-gray-300 p-6'>
			{/* Header */}
			<header className='flex justify-between items-center mb-6'>
				<div>
					<h1 className='text-2xl font-bold text-white'>Music Analytics</h1>
					<p className='text-gray-400'>
						Get insights into your listening habits
					</p>
				</div>
				<div className='flex space-x-3'>
					{/* <button className='bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full text-sm'>
						<Users className='inline-block mr-2 h-4 w-4' />
						Share
					</button> */}
					<select
						className='bg-gray-800 text-white py-2 px-4 rounded-full text-sm text-center appearance-none cursor-pointer'
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value)}>
						<option value='7'>Last 7 days</option>
						<option value='30'>Last 30 days</option>
						<option value='90'>Last 3 months</option>
						<option value='365'>Last year</option>
						<option value='all'>All time</option>
					</select>
				</div>
			</header>

			{/* Navigation Tabs */}
			<div className='flex border-b border-gray-800 mb-6'>
				<button
					className={`py-3 px-4 cursor-pointer ${
						activeTab === "overview"
							? "text-green-500 border-b-2 border-green-500"
							: "text-gray-400"
					}`}
					onClick={() => setActiveTab("overview")}>
					Overview
				</button>
				<button
					className={`py-3 px-4 cursor-pointer ${
						activeTab === "recents"
							? "text-green-500 border-b-2 border-green-500"
							: "text-gray-400"
					}`}
					onClick={() => setActiveTab("recents")}>
					Recently Played
				</button>
				<button
					className={`py-3 px-4 cursor-pointer ${
						activeTab === "uploads"
							? "text-green-500 border-b-2 border-green-500"
							: "text-gray-400"
					}`}
					onClick={() => setActiveTab("uploads")}>
					Your Uploads
				</button>
				<button
					className={`py-3 px-4 cursor-pointer ${
						activeTab === "genres"
							? "text-green-500 border-b-2 border-green-500"
							: "text-gray-400"
					}`}
					onClick={() => setActiveTab("genres")}>
					Genres
				</button>
			</div>

			{/* Overview Tab */}
			{activeTab === "overview" && (
				<>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
						<Card
							title='Total Plays'
							icon={Headphones}
							className='bg-gradient-to-br from-gray-900 to-gray-800'>
							<div className='text-3xl font-bold text-white'>
								{genreStatsData.total_plays}
							</div>
							<p className='text-gray-400 text-sm'>
								{getTimeRangeLabel(timeRange)}
							</p>
						</Card>
						<Card
							title='Total Genres'
							icon={Music}
							className='bg-gradient-to-br from-gray-900 to-gray-800'>
							<div className='text-3xl font-bold text-white'>
								{genreStatsData.genres_count}
							</div>
							<p className='text-gray-400 text-sm'>
								{getTimeRangeLabel(timeRange)}
							</p>
						</Card>
						<Card
							title='Your Uploads'
							icon={Upload}
							className='bg-gradient-to-br from-gray-900 to-gray-800'>
							<div className='text-3xl font-bold text-white'>
								{uploadStatsData.total_uploads}
							</div>
							<p className='text-gray-400 text-sm'>All time</p>
						</Card>
						<Card
							title='Downloads'
							icon={Download}
							className='bg-gradient-to-br from-gray-900 to-gray-800'>
							<div className='text-3xl font-bold text-white'>
								{uploadStatsData.total_downloads}
							</div>
							<p className='text-gray-400 text-sm'>All time</p>
						</Card>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
						<Card title='Top Genres' icon={PieChart}>
							<div className='h-64 w-full'>
								<Pie data={genrePieData} options={pieChartOptions} />
							</div>
						</Card>
						<Card title='Genre Plays vs Songs' icon={BarChart}>
							<div className='h-64 w-full'>
								<Bar data={barChartData} options={barChartOptions} />
							</div>
						</Card>
					</div>

					<div className='grid grid-cols-1 gap-6'>
						<Card title='Recently Played' icon={Clock}>
							<div className='space-y-2'>
								{recentlyPlayedData.results.slice(0, 5).map((item, index) => {
									console.log(item);
									return (
										<div
											key={index}
											className='flex items-center justify-between p-2 hover:bg-gray-800 rounded-md'>
											<div className='flex items-center'>
												<div className='w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center mr-3 overflow-hidden'>
													{item?.song?.cover_url ? (
														<img
															src={item?.song?.cover_url}
															alt={item?.song?.title}
															className='w-full h-full object-cover object-center'
														/>
													) : (
														<Music size={16} className='text-green-500' />
													)}
												</div>
												<div>
													<h4 className='text-white font-medium'>
														{item.song.title}
													</h4>
													<p className='text-gray-400 text-xs'>
														{item.song.user.name} •{" "}
														{formatDuration(item.song.duration)}
													</p>
												</div>
											</div>
											<div className='text-gray-400 text-sm'>
												{formatRelativeTime(item.last_listened_at)}
											</div>
										</div>
									);
								})}
							</div>
						</Card>
					</div>
				</>
			)}

			{/* Recently Played Tab */}
			{activeTab === "recents" && (
				<Card title='Recently Played Tracks' icon={Clock}>
					<div className='space-y-2'>
						{recentlyPlayedData.results.map((item, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-3 hover:bg-gray-800 rounded-md'>
								<div className='flex items-center'>
									<div className='w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center mr-4 overflow-hidden'>
										{item?.song?.cover_url ? (
											<img
												src={item?.song?.cover_url}
												alt={item?.song?.title}
												className='w-full h-full object-cover object-center'
											/>
										) : (
											<Music size={20} className='text-green-500' />
										)}
									</div>
									<div>
										<h4 className='text-white font-medium'>
											{item.song.title}
										</h4>
										<p className='text-gray-400 text-sm'>
											{item.song.user.name}
										</p>
										<div className='flex text-xs text-gray-500 mt-1'>
											{item.song.genre.slice(0, 3).map((g, i) => (
												<span key={i} className='mr-2'>
													{g.name}
													{i < Math.min(2, item.song.genre.length - 1)
														? ","
														: ""}
												</span>
											))}
											{item.song.genre.length > 3 && (
												<span>+{item.song.genre.length - 3}</span>
											)}
										</div>
									</div>
								</div>
								<div className='text-right'>
									<p className='text-gray-400 text-sm'>
										{formatDuration(item.song.duration)}
									</p>
									<p className='text-gray-500 text-xs'>
										{formatRelativeTime(item.last_listened_at)}
									</p>
								</div>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Uploads Tab */}
			{activeTab === "uploads" && (
				<>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
						<Card
							title='Total Uploads'
							icon={Upload}
							className='bg-gradient-to-br from-gray-900 to-gray-800'>
							<div className='text-3xl font-bold text-white'>
								{uploadStatsData.total_uploads}
							</div>
						</Card>
						<Card
							title='Total Plays'
							icon={Headphones}
							className='bg-gradient-to-br from-gray-900 to-gray-800'>
							<div className='text-3xl font-bold text-white'>
								{uploadStatsData.total_plays}
							</div>
						</Card>
						<Card
							title='Total Downloads'
							icon={Download}
							className='bg-gradient-to-br from-gray-900 to-gray-800'>
							<div className='text-3xl font-bold text-white'>
								{uploadStatsData.total_downloads}
							</div>
						</Card>
					</div>
					<Card title='Your Uploaded Tracks' icon={Upload}>
						<div className='space-y-2'>
							{uploadStatsData.results.map((item, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 hover:bg-gray-800 rounded-md'>
									<div className='flex items-center'>
										<div className='w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center mr-4 overflow-hidden'>
											{item?.song?.cover_url ? (
												<img
													src={item?.song?.cover_url}
													alt={item?.song?.title}
													className='w-full h-full object-cover object-center'
												/>
											) : (
												<Music size={20} className='text-green-500' />
											)}
										</div>
										<div>
											<h4 className='text-white font-medium'>
												{item.song.title}
											</h4>
											<div className='flex text-xs text-gray-500 mt-1'>
												{item.song.genre.map((g, i) => (
													<span key={i} className='mr-2'>
														{g.name}
														{i < item.song.genre.length - 1 ? "," : ""}
													</span>
												))}
											</div>
										</div>
									</div>
									<div className='text-right'>
										<div className='flex items-center text-gray-400 text-sm mb-1'>
											<Headphones size={14} className='mr-1' />{" "}
											{item.play_count}
										</div>
										<div className='flex items-center text-gray-400 text-sm'>
											<Download size={14} className='mr-1' />{" "}
											{item.download_count}
										</div>
									</div>
								</div>
							))}
						</div>
					</Card>
				</>
			)}

			{/* Genres Tab */}
			{activeTab === "genres" && (
				<>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
						<Card title='Top Genres Distribution' icon={PieChart}>
							<div className='h-64 w-full'>
								<Pie data={genrePieData} options={pieChartOptions} />
							</div>
						</Card>
						<Card title='Genre Statistics' icon={BarChart}>
							<div className='h-64 w-full'>
								<Bar data={barChartData} options={barChartOptions} />
							</div>
						</Card>
					</div>
					<Card title='All Genres' icon={Music}>
						<div className='space-y-2'>
							{genreStatsData.results.map((genre, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 hover:bg-gray-800 rounded-md'>
									<div className='flex items-center'>
										<div
											className='w-3 h-full min-h-full rounded-l-md mr-3'
											style={{
												backgroundColor: getGenreColor(genre.name),
											}}></div>
										<h4 className='text-white font-medium'>{genre.name}</h4>
									</div>
									<div className='flex items-center space-x-8'>
										<div className='text-right'>
											<p className='text-xs text-gray-500'>Plays</p>
											<p className='text-white'>{genre.play_count}</p>
										</div>
										<div className='text-right'>
											<p className='text-xs text-gray-500'>Songs</p>
											<p className='text-white'>{genre.song_count}</p>
										</div>
										<div className='text-right'>
											<p className='text-xs text-gray-500'>Percentage</p>
											<p className='text-white'>{genre.percentage}%</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</Card>
				</>
			)}

			{/* Footer */}
			<footer className='mt-8 pt-4 border-t border-gray-800 text-gray-500 text-xs'>
				<div className='flex justify-between items-center'>
					<p>© 2025 Music Analytics Dashboard</p>
					<p>Data updated: {new Date().toLocaleDateString()}</p>
				</div>
			</footer>
		</div>
	);
};

export default MyStatistics;
