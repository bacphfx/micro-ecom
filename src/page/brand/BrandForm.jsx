import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import UserAPI from "../../components/api/userAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageContext";
import Modal from "../../components/modal/Modal";
import default_image from "../../assets/images/default-user.png";
import { useUserEdited } from "../../context/UserEditedContext";
import BrandAPI from "../../components/api/brandAPI";
import CategoryAPI from "../../components/api/categoryAPI";

function BrandForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const brand = location.state?.brand || {};
  const { setMessage } = useMessage();
  const { setUserEmail } = useUserEdited();
  const [categoriesInForm, setCategoriesInForm] = useState([]);
  const [formData, setFormData] = useState({
    id: brand.id || "",
    name: brand.name || "",
    logo: brand.logo || "",
    categoryIds: brand?.categories?.map((cate) => cate.id) || [],
    file: null,
  });

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState(
    formData.logo
      ? `http://localhost:8080/brands/${formData.logo}`
      : default_image
  );
  const handleImageChange = (event) => {
    const input = event.target;
    const file = input.files[0];
    const maxFileSize = 2 * 1024 * 1024;
    if (file) {
      if (file.size > maxFileSize) {
        input.setCustomValidity("File size must be less than 2MB.");
        input.reportValidity();
        return;
      }
      setFormData((prev) => ({ ...prev, file: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    document.title = brand.id
      ? `Edit Brand (ID: ${brand.id})`
      : "Create New Brand";
    const getCategoriesInForm = async () => {
      try {
        const res = await CategoryAPI.getCategoriesInForm();
        setCategoriesInForm(res);
      } catch (error) {
        console.log(error);
      }
    };
    getCategoriesInForm();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("id", formData.id);
      data.append("name", formData.name);
      data.append("categoryIds", formData.categoryIds);
      if (formData.file) {
        data.append("file", formData.file);
      }
      let res;
      if (!brand.id) {
        res = await BrandAPI.saveBrand(data);
      } else {
        res = await BrandAPI.editBrand(brand.id, formData);
      }
      setMessage(res);
      navigate("/brands");
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

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryIds: selectedCategories,
    }));
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <h2>
        Manager Brands |{" "}
        {brand.id ? `Edit Brand (ID: ${brand.id})` : "Create New Brand"}
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <div className="border border-secondary rounded p-3">
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Brand name:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="128"
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Photo:</label>
            <div className="col-sm-8">
              <input
                type="file"
                name="image"
                accept="image/png, image/jpg"
                onChange={handleImageChange}
              />
              <img
                id="thumbnail"
                src={image}
                alt="Preview"
                className="image-fluid"
                style={{ marginTop: "10px", width: "150px" }}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label">
              Select one or more categories:
            </label>
            <div className="col-sm-8">
              <select
                className="form-control"
                multiple
                required
                style={{ resize: "vertical", height: "200px" }}
                onChange={(e) => handleCategoryChange(e)}
                value={formData.categoryIds}
              >
                {categoriesInForm.map((cate) => (
                  <option key={cate.id} value={cate.id}>
                    {cate.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center">
            <input type="submit" value="Save" className="btn btn-primary m-3" />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary"
              onClick={() => navigate("/brands")}
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

export default BrandForm;
