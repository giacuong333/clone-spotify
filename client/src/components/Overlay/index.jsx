import React from "react";

const Overlay = ({ toggle, setToggle }) => {
	return (
		<section
			className={`
        fixed top-0 right-0 bottom-0 left-0 z-30 
        bg-[rgba(0,0,0,0.8)] cursor-pointer 
        transition 
        ${
					toggle
						? "opacity-100 pointer-events-auto visible"
						: "opacity-0 pointer-events-none"
				}
    `}
			onClick={() => setToggle(false)}></section>
	);
};

export default Overlay;
