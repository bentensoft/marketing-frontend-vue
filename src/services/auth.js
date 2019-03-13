export const userToken = () => localStorage.getItem('userToken');

export const configWithCredentials = () => ({
  withCredentials: true,
});
