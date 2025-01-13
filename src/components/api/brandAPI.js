import axiosClient from "../../utils/axios";
const BrandAPI = {
  getAllBrands: (page, limit, sortBy, sortDir, keyword) => {
    const url = `/brands?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDir=${sortDir}&keyword=${keyword}`;
    return axiosClient.get(url);
  },

  saveBrand: (data) => {
    const url = "/brands";
    return axiosClient.post(url, data);
  },
  editBrand: (id, data) => {
    const url = `/brands/${id}`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteBrand: (id) => {
    const url = `/brands/${id}`;
    return axiosClient.delete(url);
  },
  updateStatus: (id, enable) => {
    const url = `/users/${id}/enable/${enable}`;
    return axiosClient.put(url);
  },
};
export default BrandAPI;
