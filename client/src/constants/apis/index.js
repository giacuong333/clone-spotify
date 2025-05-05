export const apis = {
	auths: {
		login: () => `/api/auths/login/`,
		logout: () => `/api/auths/logout/`,
		refresh: () => `/api/auths/refresh/`,
	},
	users: {
		getAllByRoleUser: () => `/api/users`,
		create: () => `/api/users/create`,
		update: (param) => `/api/users/${param}/update`,
		delete: (param) => `/api/users/delete/${param}`,
		getAll: () => `/api/users/`,
		getById: (param) => `/api/users/${param}`,
		getProfile: () => `/api/users/profile`,
		updateProfile: () => `/api/users/profile/`,
		getStats: () => `/api/users/stats/`,
		getAdminStats: () => `/api/users/admin/stats/`,
	},
	songs: {
		getAll: () => `/api/songs/`,
		getById: (id) => `/api/songs/${id}/`,
		delete: () => `/api/songs/delete/`,
		create: () => `/api/songs/create/`,
	},
};
