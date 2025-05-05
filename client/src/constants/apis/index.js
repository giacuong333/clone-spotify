export const apis = {
	auths: {
		login: () => `/api/auths/login/`,
		logout: () => `/api/auths/logout/`,
		refresh: () => `/api/auths/refresh/`,
	},
	users: {
		getAllByRoleUser: () => `/api/users`,
		create: () => `/api/users/create`,
		register: () => `/api/users/register/`,
		update: () => `/api/users/update`,
		delete: (param) => `/api/users/delete/${param}`,
		getAll: () => `/api/users/`,
		getById: (id) => `/api/users/${id}`,
		getProfile: () => `/api/users/profile/`,
		updateProfile: () => `/api/users/profile/`,

		getStats: () => `/api/users/stats/`,
		getStatsById: (id) => `/api/users/${id}/stats/`,
		getAdminStats: () => "/api/users/admin/stats/",
	},
	songs: {
		getAll: () => `/api/songs/`,
		getById: (id) => `/api/songs/${id}/`,
		delete: () => `/api/songs/delete/`,
		create: () => `/api/songs/create/`,
	},
	chats: {
		getConversations: () => `/conversations`,
	},
	genres: {
		getAll: () => `/api/genres/`,
		getById: (id) => `/api/genres/${id}/`,
		delete: () => `/api/genres/delete/`,
		create: () => `/api/genres/create/`,
		update: (id) => `/api/genres/${id}/update/`,
	},
};
