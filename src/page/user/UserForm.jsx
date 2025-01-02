import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import UserAPI from "../../components/api/userAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageContext";
import Modal from "../../components/modal/Modal";
import default_image from "../../assets/images/default-user.png";
import { useKeyword } from "../../context/KeywordContext";

function UserForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {};
  const { setMessage } = useMessage();
  const { setUserEmail } = useKeyword();
  const [formData, setFormData] = useState({
    id: user.id || "",
    email: user.email || "",
    password: "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    roles: user.roles || [],
    enable: user.enable || false,
    photos: user.photos || "",
    file: null,
  });

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState(
    formData.photos ? `http://localhost:8081${formData.photos}` : default_image
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

  const roles = ["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_SHIPPER"];

  useEffect(() => {
    document.title = user.id ? `Edit User (ID: ${user.id})` : "Create New User";
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = (e) => {
    const { name, value, checked } = e.target;
    if (name === "roles") {
      setFormData((prev) => ({
        ...prev,
        roles: checked
          ? [...prev.roles, value]
          : prev.roles.filter((role) => role !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("id", formData.id);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("enable", formData.enable);
      data.append("roles", formData.roles);
      if (formData.file) {
        data.append("file", formData.file);
      }
      if (!user.id) {
        await UserAPI.saveUser(data);
      } else {
        await UserAPI.editUser(user.id, formData);
      }
      setMessage("The user has been saved successfully!");
      setUserEmail(formData.email);
      navigate("/users");
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
        Manager Users |{" "}
        {user.id ? `Edit User (ID: ${user.id})` : "Create New User"}
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <div className="border border-secondary rounded p-3">
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Email:</label>
            <div className="col-sm-8">
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                minLength="8"
                maxLength="128"
                readOnly={user.id ? true : false}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">First name:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="64"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Last name:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="64"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Password:</label>
            <div className="col-sm-8">
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={user.id ? false : true}
                minLength="6"
                maxLength="64"
                placeholder={
                  user.id
                    ? "leave blank if you don't want to change password"
                    : ""
                }
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">
              Roles (role_user is default):
            </label>
            <div className="col-sm-8">
              {roles.map((role, i) => (
                <div className="form-check" key={i}>
                  <input
                    type="checkbox"
                    name="roles"
                    value={role.toString()}
                    onChange={handleCheckbox}
                    checked={formData.roles.includes(role)}
                    className="form-check-input"
                  />
                  <label className="form-check-label">
                    {role.toLowerCase()}
                  </label>
                </div>
              ))}
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
          <div className="text-center">
            <input type="submit" value="Save" className="btn btn-primary m-3" />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary"
              onClick={() => navigate("/users")}
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

export default UserForm;
