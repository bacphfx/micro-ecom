import axiosClient from "../../utils/axios";
const CategoryAPI = {
  getAllCategory: (page, limit, sortDir, keyword) => {
    const url = `/categories?page=${page}&limit=${limit}&sortDir=${sortDir}`;
    return axiosClient.get(url);
  },
  getCategoryDetails: (id) => {
    const url = `/categories/${id}`;
    return axiosClient.get(url);
  },
  getCategoriesInForm: () => {
    const url = `/categories/hierarchical`;
    return axiosClient.get(url);
  },

  saveCategory: (data) => {
    const url = "/categories";
    return axiosClient.post(url, data);
  },
  editCategory: (id, data) => {
    const url = `/categories/${id}`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteCategory: (id) => {
    const url = `/categories/${id}`;
    return axiosClient.delete(url);
  },
  updateStatus: (id, enable) => {
    const url = `/categories/${id}/enable/${enable}`;
    return axiosClient.put(url);
  },
};
export default CategoryAPI;
