export const apis = {
	auths: {
		login: () => `/api/auths/login/`,
		logout: () => `/api/auths/logout/`,
		refresh: () => `/api/auths/refresh/`,
	},
	users: {
		create: () => `/api/users/register/`, 
		update: () => `/api/users/update/`,
		delete: (id)  => `/api/users/${id}/delete/`,
		getAll: () => `/api/users/`,
		getById: (id) => `/api/users/${id}`,
		getProfile: () => `/api/users/profile/`,
		updateProfile: () => `/api/users/profile/`,
		
		getStats: () => `/api/users/stats/`,
		getStatsById: (id) => `/api/users/${id}/stats/`,
		getAdminStats:  () => '/api/users/admin/stats/',
	},
	songs: {
		getAll: () => `/api/songs/`,
		getById: (id) => `/api/songs/${id}/`, 
		delete: (id) => `/api/songs/${id}/`,
		create: () => `/api/songs/`,
	},
};
