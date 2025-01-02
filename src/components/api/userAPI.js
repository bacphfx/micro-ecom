import axiosClient from "../../utils/axios";
const UserAPI = {
  getAllUser: () => {
    const url = "/users";
    return axiosClient.get(url);
  },
  saveUser: (data) => {
    const url = "/users";
    return axiosClient.post(url, data);
  },
  editUser: (id, data) => {
    const url = `/users/${id}`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteUser: (id) => {
    const url = `/users/${id}`;
    return axiosClient.delete(url);
  },
  updateStatus: (id, enable) => {
    const url = `/users/${id}/enable/${enable}`;
    return axiosClient.put(url);
  },
};
export default UserAPI;
