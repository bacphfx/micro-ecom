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

  getBrandsForProduct: () => {
    const url = "/brands/product-form";
    return axiosClient.get(url);
  },

  getBrand: (id) => {
    const url = `/brands/${id}`;
    return axiosClient.get(url);
  },
};
export default BrandAPI;
