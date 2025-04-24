export const apis = {
	auths: {
		login: () => `/api/auths/login`,
		logout: () => `/api/auths/logout`,
		refresh: () => `/api/auths/refresh`,
	},
	users: {
		create: () => `/api/users/create`,
		update: () => `/api/users/update`,
		delete: (param) => `/api/users/delete/${param}`,
		getAll: () => `/api/users`,
		getById: (param) => `/api/users/${param}`,
	},
	songs: {
		search: () => `/api/songs/search`,
		get: () => `/api/songs/get`,
	},
};
