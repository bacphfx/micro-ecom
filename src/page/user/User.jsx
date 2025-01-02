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
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import TableHeader from "../../components/fragments/TableHeader";
import { useKeyword } from "../../context/KeywordContext";

const User = () => {
  const { message, setMessage } = useMessage();
  const { userEmail } = useKeyword();

  const [users, setUsers] = useState([]);
  const [startCount, setStartCount] = useState(0);
  const [endCount, setEndCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(4);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [keyword, setKeyword] = useState(userEmail);

  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = "Users";
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await UserAPI.getAllUser(
          page,
          limit,
          sortBy,
          sortDir,
          keyword
        );
        setUsers(res.content);
        setTotalElements(res.totalElements);
        setTotalPages(res.totalPages);

        const newStartCount = (page - 1) * limit + 1;
        const newEndCount = Math.min(
          newStartCount + limit - 1,
          res.totalElements
        );

        setStartCount(newStartCount);
        setEndCount(newEndCount);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [page, limit, sortBy, sortDir]);

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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prevSortDir) => (prevSortDir === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setPage(1);
      const res = await UserAPI.getAllUser(
        page,
        limit,
        sortBy,
        sortDir,
        keyword
      );
      setUsers(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);

      const newStartCount = (page - 1) * limit + 1;
      const newEndCount = Math.min(
        newStartCount + limit - 1,
        res.totalElements
      );

      setStartCount(newStartCount);
      setEndCount(newEndCount);
    } catch (error) {
      console.log(error);
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
      <form onSubmit={handleSearch} className="form-inline m-3">
        <input
          type="search"
          className="form-control"
          required
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" className="btn btn-primary ml-1" value="Search" />
        <input
          type="button"
          className="btn btn-secondary ml-1"
          value="Clear"
          onClick={() => window.location.reload()}
        />
      </form>
      <div>
        <table className="table table-bordered table-striped table-hover table-responsive-xl">
          <thead className="thead-dark">
            <tr>
              <TableHeader
                label="User ID"
                field="id"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <th>Photo</th>
              <TableHeader
                label="Email"
                field="email"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <TableHeader
                label="First Name"
                field="firstName"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <TableHeader
                label="Last Name"
                field="lastName"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <TableHeader
                label="Roles"
                field="roles"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <TableHeader
                label="Enabled"
                field="enable"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
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

      <div className="text-center m-1">
        {totalElements > 0 ? (
          <span>
            Showing users #{startCount} to {endCount} of {totalElements}{" "}
            elements
          </span>
        ) : (
          <span>No user found</span>
        )}
      </div>
      {totalPages > 1 && (
        <div>
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <a className="page-link" onClick={() => setPage(1)}>
                  First
                </a>
              </li>
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <a className="page-link" onClick={() => setPage(page - 1)}>
                  Previous
                </a>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <a className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </a>
                </li>
              ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <a className="page-link" onClick={() => setPage(page + 1)}>
                  Next
                </a>
              </li>
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <a className="page-link" onClick={() => setPage(totalPages)}>
                  Last
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
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
