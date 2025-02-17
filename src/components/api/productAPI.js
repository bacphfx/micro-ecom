import axiosClient from "../../utils/axios";
const ProductAPI = {
  getAllProduct: (page, limit, sortBy, sortDir, keyword, categoryId) => {
    const url = `/products?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDir=${sortDir}&keyword=${keyword}&categoryId=${categoryId}`;
    return axiosClient.get(url);
  },

  saveProduct: (data) => {
    const url = "/products";
    return axiosClient.post(url, data);
  },
  editProduct: (id, data) => {
    const url = `/products/${id}`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteProduct: (id) => {
    const url = `/products/${id}`;
    return axiosClient.delete(url);
  },
  updateStatus: (id, enable) => {
    const url = `/products/${id}/enable/${enable}`;
    return axiosClient.put(url);
  },
};
export default ProductAPI;
