import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import UserAPI from "../../components/api/userAPI";
import { useMessage } from "../../context/MessageContext";
import PortraitIcon from "@mui/icons-material/Portrait";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";

const User = () => {
  const { message, setMessage } = useMessage();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await UserAPI.getAllUser();
        setUsers(res);
      } catch (error) {
        console.log(error);
      }
    };
    document.title = "Users";
    getUsers();
  }, []);

  const handleUserStatus = async (user) => {
    try {
      const res = await UserAPI.updateStatus(user.id, !user.enable);
      setMessage(res);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, enable: !user.enable } : u
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (user) => {
    navigate("/users/save", { state: { user } });
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await UserAPI.deleteUser(selectedUser.id);
      setMessage(res);
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== selectedUser.id)
      );
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
    }
  };
  return (
    <div className="container-fluid">
      <Navbar />
      <h2>Manager Users</h2>
      <a href="/users/save">Create new user</a>
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}
      <div>
        <table className="table table-bordered table-striped table-hover table-responsive-xl">
          <thead className="thead-dark">
            <tr>
              <th>User ID</th>
              <th>Photo</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Roles</th>
              <th>Enabled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.photos ? (
                    <img
                      src={`http://localhost:8081${user.photos}`}
                      alt="user"
                      className="image-fluid"
                      style={{ width: 150 }}
                    />
                  ) : (
                    <PortraitIcon style={{ fontSize: 60, color: "gray" }} />
                  )}
                </td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.roles.join(", ").toLowerCase()}</td>
                <td>
                  {user.enable ? (
                    <ToggleOnIcon
                      style={{ fontSize: 30, color: "green" }}
                      onClick={() => handleUserStatus(user)}
                    />
                  ) : (
                    <ToggleOffIcon
                      style={{ fontSize: 30, color: "gray" }}
                      onClick={() => handleUserStatus(user)}
                    />
                  )}
                </td>
                <td>
                  <EditIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => handleEdit(user)}
                  />{" "}
                  &nbsp;{" "}
                  <DeleteIcon
                    style={{ color: "gray", fontSize: 30 }}
                    onClick={() => handleDelete(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal
          title="Delete confirmation"
          message={`Are you sure you want to delete this user ID ${selectedUser.id}?`}
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
          type="confirm"
        />
      )}
      <Footer />
    </div>
  );
};
export default User;
