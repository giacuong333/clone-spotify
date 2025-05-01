import React from "react";
import toast, { Toaster } from "react-hot-toast";

const notify = (message, type = "success") => toast[type](message);

const Toast = () => {
	return <Toaster />;
};

export { notify };
export default Toast;
