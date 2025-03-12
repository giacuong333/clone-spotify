const FRESH = "fresh";
const ACCESS = "access";

export const setTokens = (fresh, access) => {
  localStorage.setItem(FRESH, JSON.stringify(fresh));
  localStorage.setItem(ACCESS, JSON.stringify(access));
};

export const getTokens = () => ({
  fresh: localStorage.getItem(FRESH),
  access: localStorage.getItem(ACCESS),
});

export const clearTokens = () => {
  localStorage.removeItem(FRESH);
  localStorage.removeItem(ACCESS);
};
