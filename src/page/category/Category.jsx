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
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import TableHeader from "../../components/fragments/TableHeader";
import { useUserEdited } from "../../context/UserEditedContext";
import CategoryAPI from "../../components/api/categoryAPI";
import axios from "axios";
import Pagination from "../../components/fragments/Pagination";

const Category = () => {
  const { message, setMessage } = useMessage();
  const { userEmail } = useUserEdited();
  const [categories, setCategories] = useState([]);
  const [startCount, setStartCount] = useState(0);
  const [endCount, setEndCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(4);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [keyword, setKeyword] = useState(userEmail);

  const [selectedCate, setSelectedCate] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = "Categories";
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await CategoryAPI.getAllCategory(
          page,
          limit,
          sortDir,
          keyword
        );
        setCategories(res.content);
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
    getCategories();
  }, [page, limit, sortBy, sortDir]);

  const handleCategoryStatus = async (cate) => {
    try {
      const res = await CategoryAPI.updateStatus(cate.id, !cate.enable);
      setMessage(res);
      setCategories((prevCates) =>
        prevCates.map((c) =>
          c.id === cate.id ? { ...c, enable: !cate.enable } : c
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (category) => {
    navigate("/categories/save", { state: { category } });
  };

  const handleDelete = (category) => {
    setSelectedCate(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCate(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await CategoryAPI.deleteCategory(selectedCate.id);
      setMessage(res);
      setCategories((prevCates) =>
        prevCates.filter((cate) => cate.id !== selectedCate.id)
      );
    } catch (error) {
      if (error.status === 403) {
        setMessage("You don't have permission to do this action");
      }
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
      setCategories(res);
      // setTotalElements(res.totalElements);
      // setTotalPages(res.totalPages);

      // const newStartCount = (page - 1) * limit + 1;
      // const newEndCount = Math.min(
      //   newStartCount + limit - 1,
      //   res.totalElements
      // );

      // setStartCount(newStartCount);
      // setEndCount(newEndCount);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <h2>Manager Categories</h2>
      <Link to="/categories/save">Create new category</Link>
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
              <th>ID</th>
              <th>Image</th>
              <TableHeader
                label="Category Name"
                field="name"
                sortBy="name"
                sortDir={sortDir}
                onSort={handleSort}
              />
              <th>Alias</th>
              <th>Enabled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cate) => (
              <tr key={cate.id}>
                <td>{cate.id}</td>
                <td>
                  {cate.image ? (
                    <img
                      src={`http://localhost:8080/categories/${cate.image}`}
                      alt="category"
                      className="image-fluid"
                      style={{ width: 150 }}
                    />
                  ) : (
                    <PortraitIcon style={{ fontSize: 60, color: "gray" }} />
                  )}
                </td>
                <td>{cate.name}</td>
                <td>{cate.alias}</td>
                <td>
                  {cate.enable ? (
                    <ToggleOnIcon
                      style={{ fontSize: 30, color: "green" }}
                      onClick={() => handleCategoryStatus(cate)}
                    />
                  ) : (
                    <ToggleOffIcon
                      style={{ fontSize: 30, color: "gray" }}
                      onClick={() => handleCategoryStatus(cate)}
                    />
                  )}
                </td>
                <td>
                  <EditIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => handleEdit(cate)}
                  />{" "}
                  &nbsp;{" "}
                  {!cate.hasChildren && (
                    <DeleteIcon
                      style={{ color: "gray", fontSize: 30 }}
                      onClick={() => handleDelete(cate)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center m-1">
        {totalElements > 0 ? (
          <span>
            Showing categories #{startCount} to {endCount} of {totalElements}{" "}
            elements
          </span>
        ) : (
          <span>No category found</span>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {showModal && (
        <Modal
          title="Delete confirmation"
          message={`Are you sure you want to delete this category ID ${selectedCate.id}?`}
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
          type="confirm"
        />
      )}
      <Footer />
    </div>
  );
};
export default Category;
