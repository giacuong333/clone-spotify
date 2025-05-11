import { useCallback, useEffect, useState } from "react";
import { X, Music, MessageSquareWarning, Pencil } from "lucide-react";
import Overlay from "../../Overlay";
import { usePlaylist } from "../../../contexts/playlist";
import _ from "lodash";

const PlaylistModal = ({ toggle, onClose }) => {
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [error, setError] = useState("");
	const { createPlaylist } = usePlaylist();
	const [cover, setCover] = useState();
	const [coverFile, setCoverFile] = useState();

	const validate = useCallback(() => {
		if (_.isEmpty(name.trim())) {
			setError("Name is required");
			return false;
		}
		setError("");
		return true;
	}, [name]);

	useEffect(() => {
		if (!_.isEmpty(name.trim())) {
			setError("");
		}
	}, [name, validate]);

	const handleCreate = async () => {
		if (!validate()) return;

		const payload = { name, desc };
		await createPlaylist(payload);
		onClose();
	};

	return (
		<>
			<Overlay toggle={toggle} setToggle={onClose} />
			<section className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'>
				<div className='bg-zinc-900 rounded-lg w-full max-w-lg p-6 text-white'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-2xl font-bold'>Edit details</h2>
						<button className='text-gray-400 hover:text-white cursor-pointer'>
							<X size={24} onClick={onClose} />
						</button>
					</div>

					{error && (
						<div className='mb-6 py-1 rounded bg-red-700/90 flex items-center gap-2 px-2'>
							<MessageSquareWarning className='text-white' size={16} />
							<p className='text-white'>{error}</p>
						</div>
					)}

					<div className='flex gap-4 mb-4'>
						<div className='w-48 h-auto bg-zinc-800 flex items-center justify-center rounded group'>
							<Music
								size={48}
								className='text-gray-400 block group-hover:hidden'
							/>
							<>
								<Pencil
									size={48}
									className='text-gray-400 cursor-pointer hidden group-hover:block'
								/>
							</>
							<input type='file' multiple='' hidden />
						</div>

						<div className='flex-1 h-full'>
							<div className='mb-4'>
								<input
									type='text'
									placeholder='Add a name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white'
								/>
							</div>

							<div className='flex'>
								<textarea
									placeholder='Add an optional description'
									value={desc}
									onChange={(e) => setDesc(e.target.value)}
									className='w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white'
									rows={4}
								/>
							</div>
						</div>
					</div>

					<div className='flex justify-end mt-8'>
						<button
							className='bg-white text-black font-bold py-2 px-8 rounded-full hover:bg-gray-200 cursor-pointer'
							onClick={handleCreate}>
							Save
						</button>
					</div>

					<p className='text-xs text-gray-400 mt-6'>
						By proceeding, you agree to give Spotify access to the image you
						choose to upload. Please make sure you have the right to upload the
						image.
					</p>
				</div>
			</section>
		</>
	);
};

export default PlaylistModal;
