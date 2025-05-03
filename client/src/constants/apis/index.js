export const apis = {
	auths: {
		login: () => `/api/auths/login`,
		logout: () => `/api/auths/logout`,
		refresh: () => `/api/auths/refresh`,
	},
	users: {
		getAllByRoleUser: () => `/api/users`,
		create: () => `/api/users/create`,
		update: () => `/api/users/update`,
		delete: (param) => `/api/users/delete/${param}`,
		getAll: () => `/api/users`,
		getById: (param) => `/api/users/${param}`,
	},
	songs: {
		getAll: () => `/api/songs/`,
		getById: (id) => `/api/songs/${id}/`,
		delete: () => `/api/songs/delete/`,
		create: () => `/api/songs/create/`,
	},
};
