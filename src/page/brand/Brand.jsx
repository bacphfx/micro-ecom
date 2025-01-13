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
import Pagination from "../../components/fragments/Pagination";
import BrandAPI from "../../components/api/brandAPI";

const Brand = () => {
  const { message, setMessage } = useMessage();
  const { userEmail } = useUserEdited();
  const [brands, setBrands] = useState([]);
  const [startCount, setStartCount] = useState(0);
  const [endCount, setEndCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(4);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [keyword, setKeyword] = useState(userEmail);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = "Brands";
  }, []);

  useEffect(() => {
    const getBrands = async () => {
      try {
        const res = await BrandAPI.getAllBrands(
          page,
          limit,
          sortBy,
          sortDir,
          keyword
        );
        setBrands(res.content);
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
    getBrands();
  }, [page, limit, sortBy, sortDir]);

  const handleEdit = (brand) => {
    navigate("/brands/save", { state: { brand } });
  };

  const handleDelete = (brand) => {
    setSelectedBrand(brand);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBrand(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await BrandAPI.deleteBrand(selectedBrand.id);
      setMessage(res);
      setBrands((prevBrands) =>
        prevBrands.filter((b) => b.id !== selectedBrand.id)
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
      const res = await BrandAPI.getAllBrands(
        page,
        limit,
        sortBy,
        sortDir,
        keyword
      );
      setBrands(res.content);
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <h2>Manager Brands</h2>
      <Link to="/brands/save">Create new brand</Link>
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
                label="ID"
                field="id"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <th>Logo</th>
              <TableHeader
                label="Brand Name"
                field="name"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <th>Categories</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {brands?.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.id}</td>
                <td>
                  {brand.logo ? (
                    <img
                      src={`http://localhost:8080/brands/${brand.logo}`}
                      alt="brand logo"
                      className="image-fluid"
                      style={{ width: 150 }}
                    />
                  ) : (
                    <PortraitIcon style={{ fontSize: 60, color: "gray" }} />
                  )}
                </td>
                <td>{brand.name}</td>
                <td>
                  {brand?.categories.map((category) => (
                    <span
                      key={category.id}
                      className="badge badge-secondary mr-1"
                    >
                      {category.name}
                    </span>
                  ))}
                </td>
                <td>
                  <EditIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => handleEdit(brand)}
                  />{" "}
                  &nbsp;{" "}
                  <DeleteIcon
                    style={{ color: "gray", fontSize: 30 }}
                    onClick={() => handleDelete(brand)}
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
            Showing brands #{startCount} to {endCount} of {totalElements}{" "}
            elements
          </span>
        ) : (
          <span>No brand found</span>
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
          message={`Are you sure you want to delete this brand ID ${selectedBrand.id}?`}
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
          type="confirm"
        />
      )}
      <Footer />
    </div>
  );
};
export default Brand;
