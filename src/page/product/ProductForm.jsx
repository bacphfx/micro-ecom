import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import UserAPI from "../../components/api/userAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageContext";
import Modal from "../../components/modal/Modal";
import default_image from "../../assets/images/image-thumbnail.png";
import { useUserEdited } from "../../context/UserEditedContext";
import ProductAPI from "../../components/api/productAPI";
import ProductOverview from "./ProductOverview";
import BrandAPI from "../../components/api/brandAPI";
import CategoryAPI from "../../components/api/categoryAPI";
import ProductDescription from "./ProductDescription";
import ProductShipping from "./ProductShipping";
import ProductImage from "./ProductImage";
import ProductDetails from "./ProductDetails";

function ProductForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || {};
  const { setMessage } = useMessage();
  const { setUserEmail } = useUserEdited();
  const [activeTab, setActiveTab] = useState("overview");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: product.id || "",
    name: product.name || "",
    alias: product.alias || "",
    brandId: product?.brand?.id || "",
    categoryId: product?.category?.id || "",
    enable: product.enable || true,
    stock: product.stock || 0,
    price: product.price || 0,
    discountPercent: product.discountPercent || 0,
    shortDescription: product.shortDescription || "",
    longDescription: product.longDescription || "",
    length: product.length || 0,
    width: product.width || 0,
    height: product.height || 0,
    weight: product.weight || 0,
    mainImage: product.mainImage || "",
    extraImages: product.extraImages || [],
    mainImageFile: null,
    extraImageFiles: [],
  });

  const [details, setDetails] = useState(
    product.details ? product.details : [{ name: "", value: "" }]
  );

  const handleDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const newDetails = [...details];
    newDetails[index][name] = value;
    setDetails(newDetails);
  };

  const addDetail = () => {
    setDetails([...details, { name: "", value: "" }]);
  };
  const removeDetail = (index) => {
    setDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
  };

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [mainImage, setMainImage] = useState(
    formData.mainImage
      ? `http://localhost:8080/products/${formData.mainImage}`
      : default_image
  );
  const [extraImages, setExtraImages] = useState(
    formData.extraImages.map((extraImage) =>
      extraImage
        ? `http://localhost:8080/products/${extraImage}`
        : default_image
    )
  );

  const handleMainImageChange = (event) => {
    const input = event.target;
    const file = input.files[0];
    const maxFileSize = 2 * 1024 * 1024;
    if (file) {
      if (file.size > maxFileSize) {
        input.setCustomValidity("File size must be less than 2MB.");
        input.reportValidity();
        return;
      }
      setFormData((prev) => ({ ...prev, mainImageFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExtraImage = (files, imageUrls) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      extraImageFiles: [...prevFormData.extraImageFiles, ...files],
    }));
    setExtraImages((prev) => [...prev, ...imageUrls]);
  };

  const handleDeleteExtraImage = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      extraImageFiles: prevFormData.extraImageFiles.filter(
        (_, index) => index !== indexToRemove
      ),
      extraImages: prevFormData.extraImages.filter(
        (_, index) => index != indexToRemove
      ),
    }));
    setExtraImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    document.title = product.id
      ? `Edit Product (ID: ${product.id})`
      : "Create New Product";

    const getBrands = async () => {
      try {
        const res = await BrandAPI.getBrandsForProduct();
        setBrands(res);
      } catch (error) {
        console.log(error);
      }
    };
    getBrands();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        if (formData.brandId) {
          const res = await BrandAPI.getBrand(formData.brandId);
          setCategories(res.categories);
          if (!formData.categoryId) {
            setFormData((prev) => ({
              ...prev,
              categoryId: res.categories[0].id,
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, [formData.brandId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuillChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("id", formData.id);
      data.append("name", formData.name);
      data.append("alias", formData.alias);
      data.append("brandId", formData.brandId);
      data.append("categoryId", formData.categoryId);
      data.append("enable", formData.enable);
      data.append("stock", formData.stock);
      data.append("price", formData.price);
      data.append("discountPercent", formData.discountPercent);
      data.append("shortDescription", formData.shortDescription);
      data.append("longDescription", formData.longDescription);
      data.append("length", formData.length);
      data.append("width", formData.width);
      data.append("height", formData.height);
      data.append("weight", formData.weight);

      if (formData.mainImageFile) {
        data.append("mainImageFile", formData.mainImageFile);
      }
      if (formData.extraImageFiles.length > 0) {
        formData.extraImageFiles.forEach((file) => {
          data.append("extraImageFiles", file);
        });
      }
      data.append("details", JSON.stringify(details));
      let res;
      if (!product.id) {
        res = await ProductAPI.saveProduct(data);
      } else {
        res = await ProductAPI.editProduct(product.id, data);
      }
      setMessage(res);
      navigate("/products");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <h2>
        Manager Products |{" "}
        {product.id ? `Edit Product (ID: ${product.id})` : "Create New Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="border border-secondary rounded p-3">
          <div>
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                  role="tab"
                >
                  Overview
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                  role="tab"
                >
                  Description
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "images" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("images")}
                  role="tab"
                >
                  Images
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "details" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("details")}
                  role="tab"
                >
                  Details
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "shipping" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("shipping")}
                  role="tab"
                >
                  Shipping
                </a>
              </li>
            </ul>

            <div className="tab-content">
              {activeTab === "overview" && (
                <div className="tab-pane p-3 active" role="tabpanel">
                  <ProductOverview
                    onFieldChange={handleChange}
                    onSelectChange={handleDropdownChange}
                    onCheckboxChange={handleCheckbox}
                    formData={formData}
                    brands={brands}
                    categories={categories}
                  />
                </div>
              )}
              {activeTab === "description" && (
                <div className="tab-pane p-3 active" role="tabpanel">
                  <ProductDescription
                    formData={formData}
                    onFieldChange={handleQuillChange}
                  />
                </div>
              )}
              {activeTab === "images" && (
                <div className="tab-pane p-3 active" role="tabpanel">
                  <ProductImage
                    formData={formData}
                    mainImage={mainImage}
                    extraImages={extraImages}
                    onMainImageChange={handleMainImageChange}
                    onAddExtraImage={handleAddExtraImage}
                    onDeleteExtraImage={handleDeleteExtraImage}
                  />
                </div>
              )}
              {activeTab === "details" && (
                <div className="tab-pane p-3 active" role="tabpanel">
                  <ProductDetails
                    details={details}
                    onDetailsChange={handleDetailsChange}
                    onAddDetail={addDetail}
                    onRemoveDetail={removeDetail}
                  />
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="tab-pane p-3 active" role="tabpanel">
                  <ProductShipping
                    onFieldChange={handleChange}
                    formData={formData}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <input type="submit" value="Save" className="btn btn-primary m-3" />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary"
              onClick={() => navigate("/products")}
            />
          </div>
        </div>
      </form>
      {showModal && (
        <Modal
          title="Warning"
          message={error}
          onClose={handleCloseModal}
          onConfirm={null}
          type="error"
        />
      )}
      <Footer />
    </div>
  );
}

export default ProductForm;
