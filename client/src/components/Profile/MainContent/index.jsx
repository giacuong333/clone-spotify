import React, { Suspense } from "react";
import SongListWrap from "../../SongListWrap";
import ProfileDropdownMenu from "../ProfileDropdownMenu";
import { Spin } from "antd";

const MainContent = ({ songList, user, setUser }) => {
	return (
		<Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<div>
				<div className='2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-10'>
					<div className='w-full py-6 flex items-center justify-start gap-6'>
						<ProfileDropdownMenu user={user} setUser={setUser} />
					</div>

					<div>
						<SongListWrap songList={songList} title='Top tracks listened this month' />
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default React.memo(MainContent);
