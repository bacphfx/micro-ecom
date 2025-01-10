import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageContext";
import Modal from "../../components/modal/Modal";
import default_image from "../../assets/images/image-thumbnail.png";
import CategoryAPI from "../../components/api/categoryAPI";

function CategoryForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category || {};
  const { setMessage } = useMessage();
  const [categoriesInForm, setCategoriesInForm] = useState([]);
  const [formData, setFormData] = useState({
    id: category.id || "",
    name: category.name?.replaceAll("-", "") || "",
    alias: category.alias || "",
    parentId: category.parentId || "",
    enable: category.enable || false,
    image: category.image || "",
    file: null,
  });

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [imagePreview, setImagePreview] = useState(
    formData.image
      ? `http://localhost:8080/categories/${formData.image}`
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
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    document.title = category.id
      ? `Edit Category (ID: ${category.id})`
      : "Create New Category";
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

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleParentChange = (event) => {
    const selectedId = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      parentId: selectedId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("id", formData.id);
      data.append("name", formData.name);
      data.append("alias", formData.alias);
      data.append("parentId", formData.parentId);
      data.append("enable", formData.enable);
      if (formData.file) {
        data.append("file", formData.file);
      }
      if (!category.id) {
        await CategoryAPI.saveCategory(data);
      } else {
        await CategoryAPI.editCategory(category.id, formData);
      }
      setMessage("The category has been saved successfully!");
      navigate("/categories");
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
        Manager Category |{" "}
        {category.id
          ? `Edit Category (ID: ${category.id})`
          : "Create New Category"}
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <div className="border border-secondary rounded p-3">
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Category name:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength="128"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Alias:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                required
                maxLength="64"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Parent category:</label>
            <div className="col-sm-8">
              <select
                className="form-control"
                name="parentId"
                value={formData.parentId}
                onChange={handleParentChange}
              >
                <option value="">[No parent]</option>
                {categoriesInForm.map((cate) => (
                  <option key={cate.id} value={cate.id}>
                    {cate.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Enabled:</label>
            <div className="col-sm-8">
              <input
                type="checkbox"
                name="enable"
                value={formData.enable}
                checked={formData.enable}
                onChange={handleCheckbox}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Image:</label>
            <div className="col-sm-8">
              <input
                type="file"
                name="image"
                accept="image/png, image/jpg"
                onChange={handleImageChange}
              />
              <img
                id="thumbnail"
                src={imagePreview}
                alt="Preview"
                className="image-fluid"
                style={{ marginTop: "10px", width: "150px" }}
              />
            </div>
          </div>
          <div className="text-center">
            <input type="submit" value="Save" className="btn btn-primary m-3" />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary"
              onClick={() => navigate("/categories")}
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

export default CategoryForm;
