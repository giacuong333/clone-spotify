export const apis = {
	auths: {
		login: () => `/api/auths/login/`,
		logout: () => `/api/auths/logout/`,
		refresh: () => `/api/auths/refresh/`,
		loginByGoogle: () => `/api/auths/google/auth-url/`,
		googleBackendCallback: () => "/api/auths/google/callback/",
	},
	users: {
		getAllByRoleUser: () => `/api/users/render/`,
		create: () => `/api/users/create`,
		register: () => `/api/users/register/`,
		update: (id) => `/api/users/${id}/update`,
		delete: (param) => `/api/users/delete/${param}`,
		getAll: () => `/api/users/`,
		getById: (id) => `/api/users/${id}`,
		getProfile: () => `/api/users/profile/`,
		updateProfile: () => `/api/users/profile/`,
		getStats: () => `/api/users/stats/`,
		getStatsById: (id) => `/api/users/${id}/stats/`,
		getAdminStats: () => "/api/users/admin/stats/",
		queryUser: () => `/api/users/query/`,
	},
	songs: {
		getAll: () => `/api/songs/`,
		search: () => `/api/songs/search/`,
		getById: (id) => `/api/songs/${id}/`,
		delete: () => `/api/songs/delete/`,
		create: () => `/api/songs/create/`,
		getByUserId: (id) => `/api/songs/search/?user_id=${id}/`,
	},
	chats: {
		getConversations: () => "/api/chat/conversations/",
		getMessages: (otherUserId) =>
			`/api/chat/conversations/${otherUserId}/messages/`,
	},
	genres: {
		getAll: () => `/api/genres/`,
		getById: (id) => `/api/genres/${id}/`,
		delete: () => `/api/genres/delete/`,
		create: () => `/api/genres/create/`,
		update: (id) => `/api/genres/${id}/update/`,
	},
	downloaded_at: {
		create: () => `/api/downloadedAt/save/`,
	},
	listened_at: {
		create: () => `/api/listenedAt/save/`,
	},
	playlists: {
		search: () => `/api/playlists/search/`,
		getAll: () => `/api/playlists/`,
		getDetail: () => `/api/playlists/detail/`,
		addSongToPlaylist: () => `/api/playlists/songs/add/`,
		removeSongFromPlaylist: () => `/api/playlists/songs/remove/`,
		editPlaylist: () => `/api/playlists/edit/`,
		deletePlaylist: () => `/api/playlists/delete/`,
		createPlaylist: () => `/api/playlists/create/`,
		getByUserId: (id) => `/api/playlists/user/?user_id=${id}/`,
		getFavoritePlaylist: (userId) =>
			`/api/playlists/favorite/?user_id=${userId}/`,
	},
};
