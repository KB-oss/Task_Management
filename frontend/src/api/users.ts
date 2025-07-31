import axiosInstance from "./axiosInstance";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/auth");
  return res.data.users;
};

// export const getUserById = async (id: string) => {
//   const res = await api.get(`/api/auth/${id}`);
//   return res.data.user;
// };
