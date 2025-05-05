import React, { Suspense, useState } from "react";
import { Button, Spin } from "antd";
import PlayIcon from "../../Icons/PlayIcon";
import ThreeDotsIcon from "../../Icons/ThreeDotsIcon";
import SongListWrap from "../../SongListWrap";
import ProfileDropdownMenu from "../ProfileDropdownMenu.jsx";

const MainContent = ({ songList, user }) => {
	return (
		<Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<div>
				<div className='2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-10'>
					<div className='w-full py-6 flex items-center justify-start gap-6'>
						<ProfileDropdownMenu user = {user}/>
					</div>

					<div>
						<SongListWrap songList={songList} title='Top tracks this month' />
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default React.memo(MainContent);
