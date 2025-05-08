import { useState, useEffect } from "react";
import {
	Music,
	Image,
	Clock,
	Calendar,
	X,
	Upload,
	Trash2,
	CheckCircle,
	Video,
} from "lucide-react";
import Overlay from "../Overlay";
import formatTime from "../../utils/formatTime";
import { useSong } from "../../contexts/Song";
import { useGenre } from "../../contexts/genre";

export default function SongUploadForm({ onComplete, show, onShow }) {
	const [title, setTitle] = useState("");
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [songFile, setSongFile] = useState(null);
	const [videoFile, setVideoFile] = useState(null);
	const [coverImage, setCoverImage] = useState(null);
	const [duration, setDuration] = useState("");
	// const [releaseDate, setReleaseDate] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
	const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [activeStep, setActiveStep] = useState(1);
	const { create } = useSong();
	const { genreList, fetchGenreList, loadingFetchGenreList } = useGenre();

	useEffect(() => {
		fetchGenreList();
	}, [fetchGenreList]);

	// Mock genres - in a real app, these would come from your API
	const availableGenres = [
		{ id: "680755a0081908b550ef9a47", name: "Rock", color: "bg-green-500" },
		{
			id: "680755a0081908b550ef9a46",
			name: "Pop",
			color: "bg-green-500",
		},
		{ id: "680755a0081908b550ef9a49", name: "Hip Hop", color: "bg-green-500" },
		{ id: "680755a0081908b550ef9a4d", name: "R&B", color: "bg-green-500" },
		{ id: "680755a0081908b550ef9a48", name: "Jazz", color: "bg-green-500" },
		{
			id: "680755a0081908b550ef9a4b",
			name: "Electronic",
			color: "bg-green-500",
		},
		{
			id: "680755a0081908b550ef9a4a",
			name: "Classical",
			color: "bg-green-500",
		},
		{ id: "680755a0081908b550ef9a4c", name: "Country", color: "bg-green-500" },
	];

	const handleSongFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Create object URL for preview
		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);
		setSongFile(file);

		// Create audio element to get duration
		const audio = new Audio(objectUrl);
		audio.addEventListener("loadedmetadata", () => {
			// Convert duration from seconds to integer
			setDuration(Math.floor(audio.duration));
		});
	};

	const handleVideoFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Create object URL for preview
		const objectUrl = URL.createObjectURL(file);
		setVideoPreviewUrl(objectUrl);
		setVideoFile(file);
	};

	const handleCoverImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const objectUrl = URL.createObjectURL(file);
		setCoverPreviewUrl(objectUrl);
		setCoverImage(file);
	};

	const handleGenreToggle = (genreId) => {
		setSelectedGenres((prevGenres) => {
			if (prevGenres.includes(genreId)) {
				return prevGenres.filter((id) => id !== genreId);
			} else {
				return [...prevGenres, genreId];
			}
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Validate form
			if (!title) throw new Error("Title is required");
			if (!songFile) throw new Error("Song file is required");
			if (!videoFile) throw new Error("Video file is required");
			if (!duration) throw new Error("Duration could not be determined");
			if (selectedGenres.length === 0) {
				throw new Error("At least one genre must be selected");
			}

			const formData = new FormData();
			formData.append("title", title);
			formData.append("duration", duration);
			formData.append("genre_ids", selectedGenres.join(","));
			formData.append("audio", songFile);
			formData.append("video", videoFile);
			formData.append("cover", coverImage);

			await create(formData);

			// Reset form on success
			setSuccess(true);

			// Reset success message after 3 seconds
			setTimeout(() => {
				setSuccess(false);
				setTitle("");
				setSelectedGenres([]);
				setSongFile(null);
				setVideoFile(null);
				setCoverImage(null);
				setDuration("");
				// setReleaseDate("");
				setPreviewUrl("");
				setVideoPreviewUrl("");
				setCoverPreviewUrl("");
				setActiveStep(1);

				// Call onComplete function passed from parent
				if (onComplete) {
					onComplete();
				}
			}, 2000);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const nextStep = () => {
		if (activeStep === 1 && !title) {
			setError("Please enter a song title");
			return;
		}
		if (activeStep === 2 && !songFile) {
			setError("Please upload a song file");
			return;
		}
		if (activeStep === 3 && !videoFile) {
			setError("Please upload a video file");
			return;
		}
		if (activeStep === 4 && selectedGenres.length === 0) {
			setError("Please select at least one genre");
			return;
		}

		setError("");
		setActiveStep((prev) => Math.min(prev + 1, 5));
	};

	const prevStep = () => {
		setActiveStep((prev) => Math.max(prev - 1, 1));
	};

	const closeForm = () => {
		onShow(false);
	};

	return (
		<>
			<Overlay toggle={show} setToggle={closeForm} />
			<section
				className={`fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 ${
					show
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}>
				<div className='max-w-3xl mx-auto bg-black rounded-xl shadow-xl overflow-hidden border border-gray-800'>
					{/* Header with wave design */}
					<div className='relative h-32 bg-gradient-to-r from-[#1ED760] to-green-[#1ED760]'>
						<div className='absolute bottom-0 left-0 right-0'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 1440 320'
								className='w-full'>
								<path
									fill='#121212'
									fillOpacity='1'
									d='M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,128C672,117,768,139,864,138.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'></path>
							</svg>
						</div>
						<div className='absolute z-10 top-4 right-4'>
							<button
								onClick={closeForm}
								className='p-1 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all cursor-pointer'>
								<X className='h-6 w-6 text-white' />
							</button>
						</div>
						<div className='absolute inset-0 flex items-center justify-center'>
							<h1 className='text-3xl font-bold text-white tracking-wider'>
								Upload Your Track
							</h1>
						</div>
					</div>

					{/* Main content */}
					<div className='bg-black bg-opacity-95 px-8 py-6 text-gray-200'>
						{/* Progress indicators */}
						<div className='flex justify-between mb-8'>
							{[1, 2, 3, 4, 5].map((step) => (
								<div key={step} className='flex flex-col items-center'>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											activeStep >= step
												? "bg-gradient-to-r from-green-500 to-green-800 text-white"
												: "bg-gray-800 text-gray-500"
										}`}>
										{step}
									</div>
									<div
										className={`text-xs mt-1 font-medium ${
											activeStep >= step ? "text-green-500" : "text-gray-500"
										}`}>
										{step === 1
											? "Basics"
											: step === 2
											? "Audio"
											: step === 3
											? "Video"
											: step === 4
											? "Genre"
											: "Media"}
									</div>
								</div>
							))}
						</div>

						{success && (
							<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>
								<div className='bg-gray-900 rounded-lg p-8 flex flex-col items-center max-w-md mx-4 border border-green-500'>
									<CheckCircle className='text-green-500 w-16 h-16 mb-4' />
									<h3 className='text-2xl font-bold text-white mb-2'>
										Upload Successful!
									</h3>
									<p className='text-gray-300 text-center mb-6'>
										Your song "{title}" has been uploaded successfully.
									</p>
									<div className='w-full bg-gray-800 h-2 rounded-full overflow-hidden'>
										<div className='bg-green-500 h-full w-full animate-pulse'></div>
									</div>
								</div>
							</div>
						)}

						{error && (
							<div className='bg-red-900 bg-opacity-20 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm'>
								<div className='flex'>
									<div className='flex-shrink-0'>
										<svg
											className='h-5 w-5 text-red-400'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											aria-hidden='true'>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div className='ml-3'>
										<p className='text-sm text-red-300'>{error}</p>
									</div>
								</div>
							</div>
						)}

						{/* Step 1 - Title */}
						{activeStep === 1 && (
							<div className='animate-fadeIn'>
								<div className='mb-8'>
									<label
										htmlFor='title'
										className='block text-lg font-medium text-gray-200 mb-2'>
										What's your song called?
									</label>
									<input
										type='text'
										id='title'
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className='w-full px-4 py-3 border-2 border-gray-800 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg text-white'
										placeholder='Enter song title'
										required
									/>
								</div>
							</div>
						)}

						{/* Step 2 - Song File */}
						{activeStep === 2 && (
							<div className='animate-fadeIn'>
								<div className='mb-8'>
									<label
										htmlFor='songFile'
										className='block text-lg font-medium text-gray-200 mb-2'>
										Upload your track
									</label>

									{!songFile ? (
										<div className='border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-600 transition-all duration-200'>
											<label className='cursor-pointer w-full h-full flex flex-col items-center'>
												<Music className='w-16 h-16 text-green-500 mb-2' />
												<span className='text-gray-300 font-medium mb-2'>
													Drag your audio file here or click to browse
												</span>
												<span className='text-sm text-gray-500'>
													MP3, WAV or OGG files
												</span>
												<input
													type='file'
													id='songFile'
													accept='audio/*'
													onChange={handleSongFileChange}
													className='hidden'
													required
												/>
											</label>
										</div>
									) : (
										<div className='bg-gray-800 rounded-lg p-4'>
											<div className='flex items-center justify-between mb-3'>
												<div className='flex items-center'>
													<Music className='w-6 h-6 text-green-500 mr-2' />
													<span className='font-medium text-gray-200 truncate max-w-xs'>
														{songFile.name}
													</span>
												</div>
												<button
													type='button'
													onClick={() => {
														setSongFile(null);
														setPreviewUrl("");
														setDuration("");
													}}
													className='text-red-400 hover:text-red-300 p-1'>
													<Trash2 className='h-5 w-5' />
												</button>
											</div>

											<div className='mb-3'>
												<audio
													controls
													src={previewUrl}
													className='w-full h-12'
												/>
											</div>

											<div className='flex items-center justify-between text-sm'>
												<span className='text-gray-400'>
													Size: {(songFile.size / (1024 * 1024)).toFixed(2)} MB
												</span>
												{duration && (
													<span className='bg-green-900 text-green-300 px-3 py-1 rounded-full font-medium'>
														Duration: {formatTime(duration)}
													</span>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Step 3 - Video File */}
						{activeStep === 3 && (
							<div className='animate-fadeIn'>
								<div className='mb-8'>
									<label
										htmlFor='videoFile'
										className='block text-lg font-medium text-gray-200 mb-2'>
										Upload your music video
									</label>

									{!videoFile ? (
										<div className='border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-600 transition-all duration-200'>
											<label className='cursor-pointer w-full h-full flex flex-col items-center'>
												<Video className='w-16 h-16 text-green-500 mb-2' />
												<span className='text-gray-300 font-medium mb-2'>
													Drag your video file here or click to browse
												</span>
												<span className='text-sm text-gray-500'>
													MP4, MOV or WebM files
												</span>
												<input
													type='file'
													id='videoFile'
													accept='video/*'
													onChange={handleVideoFileChange}
													className='hidden'
													required
												/>
											</label>
										</div>
									) : (
										<div className='bg-gray-800 rounded-lg p-4'>
											<div className='flex items-center justify-between mb-3'>
												<div className='flex items-center'>
													<Video className='w-6 h-6 text-green-500 mr-2' />
													<span className='font-medium text-gray-200 truncate max-w-xs'>
														{videoFile.name}
													</span>
												</div>
												<button
													type='button'
													onClick={() => {
														setVideoFile(null);
														setVideoPreviewUrl("");
													}}
													className='text-red-400 hover:text-red-300 p-1'>
													<Trash2 className='h-5 w-5' />
												</button>
											</div>

											<div className='mb-3'>
												<video
													controls
													src={videoPreviewUrl}
													className='w-full h-auto rounded'
												/>
											</div>

											<div className='flex items-center justify-between text-sm'>
												<span className='text-gray-400'>
													Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
												</span>
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Step 4 - Genres */}
						{activeStep === 4 && (
							<div className='animate-fadeIn'>
								<div className='mb-8'>
									<label className='block text-lg font-medium text-gray-200 mb-4'>
										Select genres that match your song
									</label>
									<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
										{genreList.map((genre) => (
											<button
												key={genre.id}
												type='button'
												onClick={() => handleGenreToggle(genre.id)}
												className={`relative py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
													selectedGenres.includes(genre.id)
														? `bg-green-600 shadow-md scale-105`
														: "bg-gray-800 hover:bg-gray-700"
												}`}>
												{genre.name}
												{selectedGenres.includes(genre.id) && (
													<span className='absolute top-1 right-1'>
														<CheckCircle className='h-4 w-4' />
													</span>
												)}
											</button>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Step 5 - Additional Info */}
						{activeStep === 5 && (
							<div className='animate-fadeIn space-y-6'>
								{/* Cover Image */}
								<div>
									<label
										htmlFor='coverImage'
										className='block text-lg font-medium text-gray-200 mb-2'>
										Cover Image
									</label>

									<div className='flex items-start space-x-4'>
										{!coverImage ? (
											<div className='w-36 h-36 bg-gray-800 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-700'>
												<label className='cursor-pointer w-full h-full flex flex-col items-center justify-center'>
													<Image className='h-8 w-8 text-gray-500 mb-2' />
													<span className='text-xs text-gray-500 text-center px-2'>
														Add cover art
													</span>
													<input
														type='file'
														id='coverImage'
														accept='image/*'
														onChange={handleCoverImageChange}
														className='hidden'
													/>
												</label>
											</div>
										) : (
											<div className='relative w-36 h-36'>
												<img
													src={coverPreviewUrl}
													alt='Cover preview'
													className='w-36 h-36 object-cover rounded-lg shadow-md'
												/>
												<button
													type='button'
													onClick={() => {
														setCoverImage(null);
														setCoverPreviewUrl("");
													}}
													className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600'>
													<X className='h-4 w-4' />
												</button>
											</div>
										)}

										<div className='flex-1'>
											<p className='text-sm text-gray-400 mb-2'>
												Upload a high-quality image to make your song stand out.
												Recommended size: 1400x1400 pixels.
											</p>
											{!coverImage && (
												<button
													type='button'
													onClick={() =>
														document.getElementById("coverImage").click()
													}
													className='px-4 py-2 bg-gray-800 text-green-400 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors'>
													Choose Image
												</button>
											)}
										</div>
									</div>
								</div>

								{/* Summary */}
								<div className='bg-gray-900 p-4 rounded-lg mt-6 border border-gray-800'>
									<h3 className='font-medium text-gray-300 mb-2'>Preview</h3>
									<div className='flex items-center'>
										<div className='w-16 h-16 bg-gray-800 rounded flex items-center justify-center mr-3'>
											{coverPreviewUrl ? (
												<img
													src={coverPreviewUrl}
													alt='Cover'
													className='w-16 h-16 object-cover rounded'
												/>
											) : (
												<Music className='h-8 w-8 text-gray-500' />
											)}
										</div>
										<div>
											<h4 className='font-bold text-gray-200'>
												{title || "Untitled Song"}
											</h4>
											<p className='text-sm text-gray-400'>
												{selectedGenres.length > 0
													? selectedGenres
															.map(
																(id) =>
																	availableGenres.find((g) => g.id === id)?.name
															)
															.join(", ")
													: "No genres selected"}
											</p>
											{duration && (
												<p className='text-xs text-gray-500'>
													{formatTime(duration)}
												</p>
											)}
											{videoFile && (
												<p className='text-xs text-green-400'>
													Video: {videoFile.name.split(".").pop().toUpperCase()}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Navigation Buttons */}
						<div className='mt-8 flex justify-between'>
							<button
								onClick={prevStep}
								disabled={activeStep === 1}
								className={`px-6 py-2 rounded-lg font-medium cursor-pointer
              ${
								activeStep !== 1
									? "bg-gray-800 text-gray-300 hover:bg-gray-700"
									: "bg-gray-900 text-gray-700 cursor-not-allowed"
							}`}>
								Back
							</button>

							{activeStep < 5 ? (
								<button
									onClick={nextStep}
									className='px-6 py-2 bg-gradient-to-r from-green-500 to-green-800 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 shadow-md transition-all duration-200 cursor-pointer'>
									Continue
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={loading}
									className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-800 text-white rounded-lg font-medium shadow-md transition-all duration-200
                ${
									loading
										? "opacity-70 cursor-not-allowed"
										: "hover:from-green-600 hover:to-green-800"
								}`}>
									{loading ? (
										<div className='flex items-center'>
											<svg
												className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'></circle>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
											</svg>
											Uploading...
										</div>
									) : (
										<div className='flex items-center'>
											<Upload className='mr-2 h-5 w-5' />
											Upload Song
										</div>
									)}
								</button>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
