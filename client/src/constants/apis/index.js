export const apis = {
	auths: {
		login: () => `/api/auths/login/`,
		logout: () => `/api/auths/logout/`,
		refresh: () => `/api/auths/refresh/`,
	},
	users: {
		getAllByRoleUser: () => `/api/users`,
		create: () => `/api/users/create`,
		update: () => `/api/users/update`,
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
		delete: () => `/api/songs/delete/`,
		create: () => `/api/songs/create/`,
	},
	genres: {
		getAll: () => `/api/genres/`,
		getById: (id) => `/api/genres/${id}/`,
		delete: () => `/api/genres/delete/`,
		create: () => `/api/genres/create/`,
		update: (id) => `/api/genres/${id}/update/`,
	},
};
