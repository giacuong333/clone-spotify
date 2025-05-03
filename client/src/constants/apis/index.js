export const apis = {
	auths: {
		login: () => `/api/auths/login/`,
		logout: () => `/api/auths/logout/`,
		refresh: () => `/api/auths/refresh/`,
	},
	users: {
		create: () => `/api/users/register/`, 
		update: () => `/api/users/update/`,
		delete: (param) => `/api/users/delete/${param}`,
		getAll: () => `/api/users/`,
		getById: (param) => `/api/users/${param}`,
		getProfile: () => `/api/users/profile/`,
		updateProfile: () => `/api/users/profile/`,
		getStats: () => `/api/users/stats/`,
		getAdminStats: () => `/api/users/admin/stats/`,
	},
	songs: {
		getAll: () => `/api/songs/`,
		getById: (id) => `/api/songs/${id}/`, 
		delete: (id) => `/api/songs/${id}/`,
		create: () => `/api/songs/`,
	},
};
