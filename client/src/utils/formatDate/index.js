const formatDate = (dateString) => {
	if (!dateString) return "N/A";
	return new Date(dateString).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export default formatDate;
