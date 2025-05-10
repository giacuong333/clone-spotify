import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import axios from "axios";
import { instance } from "../../contexts/Axios";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

const AnalyticsDashboard = () => {
	const [songs, setSongs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [timeRange, setTimeRange] = useState(30);
	const [sortBy, setSortBy] = useState("play_count");
	const [activeTab, setActiveTab] = useState("charts");
	const [reportType, setReportType] = useState("songs");
	const limit = 20;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await instance.get("/api/analytics/top-songs/", {
					params: {
						range: timeRange,
						sort_by: sortBy,
						limit,
					},
				});
				setSongs(response.data.results);
			} catch (err) {
				setError("Error fetching data");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [timeRange, sortBy]);

	const handleExportPDF = async () => {
		try {
			const response = await instance.get("/api/analytics/export-pdf/", {
				params: { type: reportType, range: timeRange },
				responseType: "blob",
			});

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${reportType}_report.pdf`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (err) {
			setError("Error exporting PDF");
		}
	};

	if (isLoading)
		return (
			<div className='flex items-center justify-center h-screen text-gray-500'>
				Loading...
			</div>
		);
	if (error) return <div className='text-red-500 text-center p-4'>{error}</div>;

	const totalPlays = songs.reduce((sum, song) => sum + song.play_count, 0);
	const totalDownloads = songs.reduce(
		(sum, song) => sum + song.download_count,
		0
	);

	const barChartData = {
		labels: songs.slice(0, 5).map((song) => song.title),
		datasets: [
			{
				label: "Play Count",
				data: songs.slice(0, 5).map((song) => song.play_count),
				backgroundColor: "rgba(59, 130, 246, 0.6)",
				borderColor: "rgba(59, 130, 246, 1)",
				borderWidth: 1,
			},
			{
				label: "Download Count",
				data: songs.slice(0, 5).map((song) => song.download_count),
				backgroundColor: "rgba(236, 72, 153, 0.6)",
				borderColor: "rgba(236, 72, 153, 1)",
				borderWidth: 1,
			},
		],
	};

	const doughnutChartData = {
		labels: songs.slice(0, 5).map((song) => song.title),
		datasets: [
			{
				data: songs.slice(0, 5).map((song) => song.play_count),
				backgroundColor: [
					"rgba(59, 130, 246, 0.6)",
					"rgba(236, 72, 153, 0.6)",
					"rgba(16, 185, 129, 0.6)",
					"rgba(245, 158, 11, 0.6)",
					"rgba(139, 92, 246, 0.6)",
				],
				borderColor: ["#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6"],
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
		},
	};

	return (
		<div className='min-h-screen bg-gray-100 p-6'>
			<div className='max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6'>
				<h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>
					Music Analytics
				</h1>

				{/* Stats Summary */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
					{[
						{ label: "Total Songs", value: songs.length, color: "blue" },
						{ label: "Total Plays", value: totalPlays, color: "green" },
						{
							label: "Total Downloads",
							value: totalDownloads,
							color: "purple",
						},
					].map((stat) => (
						<div
							key={stat.label}
							className='bg-gray-50 p-4 rounded-xl text-center'>
							<p className='text-sm text-gray-500 uppercase'>{stat.label}</p>
							<p className={`text-2xl font-bold text-${stat.color}-600`}>
								{stat.value}
							</p>
						</div>
					))}
				</div>

				{/* Controls */}
				<div className='flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-xl'>
					<div>
						<label className='block text-sm text-gray-600 mb-1'>
							Time Range
						</label>
						<select
							value={timeRange}
							onChange={(e) => setTimeRange(Number(e.target.value))}
							className='border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value={7}>Last 7 days</option>
							<option value={30}>Last 30 days</option>
							<option value={90}>Last 90 days</option>
						</select>
					</div>
					<div>
						<label className='block text-sm text-gray-600 mb-1'>Sort By</label>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className='border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value='play_count'>Play Count</option>
							<option value='download_count'>Download Count</option>
						</select>
					</div>
					<div>
						<label className='block text-sm text-gray-600 mb-1'>
							Report Type
						</label>
						<select
							value={reportType}
							onChange={(e) => setReportType(e.target.value)}
							className='border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value='songs'>Songs</option>
							<option value='genres'>Genres</option>
							<option value='peak_hours'>Peak Hours</option>
						</select>
					</div>
					<div className='flex items-end'>
						<button
							onClick={handleExportPDF}
							className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>
							Export PDF
						</button>
					</div>
				</div>

				{/* Tabs */}
				<div className='bg-gray-50 rounded-xl'>
					<div className='flex border-b'>
						{["charts", "table"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-4 py-2 text-sm font-medium ${
									activeTab === tab
										? "border-b-2 border-blue-500 text-blue-600"
										: "text-gray-500"
								}`}>
								{tab === "charts" ? "Charts" : "Table"}
							</button>
						))}
					</div>

					{/* Tab Content */}
					{activeTab === "charts" && (
						<div className='p-4 grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<div className='bg-white p-4 rounded-xl shadow'>
								<Bar
									data={barChartData}
									options={{
										...chartOptions,
										plugins: {
											...chartOptions.plugins,
											title: { display: true, text: "Top Songs by Play Count" },
										},
									}}
								/>
							</div>
							<div className='bg-white p-4 rounded-xl shadow'>
								<Doughnut
									data={doughnutChartData}
									options={{
										...chartOptions,
										plugins: {
											...chartOptions.plugins,
											title: { display: true, text: "Play Count Distribution" },
										},
									}}
								/>
							</div>
						</div>
					)}

					{activeTab === "table" && (
						<div className='p-4 overflow-x-auto'>
							<table className='min-w-full bg-white rounded-xl'>
								<thead>
									<tr className='bg-gray-50'>
										{[
											"Rank",
											"Title",
											"Artist",
											"Album",
											"Plays",
											"Downloads",
										].map((header) => (
											<th
												key={header}
												className='py-3 px-4 text-left text-sm font-medium text-gray-600'>
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{songs.map((song, index) => (
										<tr
											key={song.id}
											className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
											<td className='py-3 px-4'>{index + 1}</td>
											<td className='py-3 px-4 font-medium'>{song.title}</td>
											<td className='py-3 px-4'>{song.artist_name}</td>
											<td className='py-3 px-4'>{song.album_title || "N/A"}</td>
											<td className='py-3 px-4'>{song.play_count}</td>
											<td className='py-3 px-4'>{song.download_count}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
