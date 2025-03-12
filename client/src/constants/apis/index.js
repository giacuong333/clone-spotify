export const apis = {
  auths: {
    login: () => `auths/login`,
    logout: () => `auths/logout`,
    refresh: () => `auths/refresh`,
  },
  users: {
    create: () => `users/create`,
    update: () => `users/update`,
    delete: (param) => `users/delete/${param}`,
    getAll: () => `users`,
    getById: (param) => `users/${param}`,
  },
};
