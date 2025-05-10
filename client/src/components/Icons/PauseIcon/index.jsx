import React from "react";

const PauseIcon = ({ className = "", ...props }) => {
	return (
		<div className='bg-white rounded-full overflow-hidden hover:scale-[1.05]'>
			<svg
				data-encore-id='icon'
				role='img'
				aria-hidden='true'
				className={`e-9800-icon e-9800-baseline ${className}`}
				viewBox='0 0 16 16'
				style={{
					"--encore-icon-height":
						"var(--encore-graphic-size-decorative-smaller)",
					"--encore-icon-width":
						"var(--encore-graphic-size-decorative-smaller)",
				}}
				{...props}>
				<path d='M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z' />
			</svg>
		</div>
	);
};

export default PauseIcon;
