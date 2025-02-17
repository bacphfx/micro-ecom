import { useContext, useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import UserAPI from "../../components/api/userAPI";
import { useMessage } from "../../context/MessageContext";
import PortraitIcon from "@mui/icons-material/Portrait";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ArticleIcon from "@mui/icons-material/Article";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import TableHeader from "../../components/fragments/TableHeader";
import { useUserEdited } from "../../context/UserEditedContext";
import Pagination from "../../components/fragments/Pagination";
import ProductAPI from "../../components/api/productAPI";
import CategoryAPI from "../../components/api/categoryAPI";
import { AuthContext } from "../../context/AuthContext";

const Product = () => {
  const { message, setMessage } = useMessage();
  const { userEmail } = useUserEdited();
  const [products, setProducts] = useState([]);
  const [startCount, setStartCount] = useState(0);
  const [endCount, setEndCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(4);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [keyword, setKeyword] = useState(userEmail);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCate, setSelectedCate] = useState(0);

  const authContext = useContext(AuthContext);
  const { user } = authContext;

  useEffect(() => {
    document.title = "Products";
    const getCategories = async () => {
      try {
        const res = await CategoryAPI.getCategoriesInForm();
        setCategories(res);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    console.log(selectedCate);
  }, [selectedCate]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await ProductAPI.getAllProduct(
          page,
          limit,
          sortBy,
          sortDir,
          keyword,
          selectedCate
        );
        setProducts(res.content);
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
    getProducts();
  }, [page, limit, sortBy, sortDir, selectedCate]);

  const handleProductStatus = async (product) => {
    try {
      const res = await ProductAPI.updateStatus(product.id, !product.enable);
      setMessage(res);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, enable: !product.enable } : p
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (product) => {
    navigate("/products/save", { state: { product } });
  };

  const handleSelectCate = (e) => {
    setSelectedCate(e.target.value);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await ProductAPI.deleteProduct(selectedProduct.id);
      setMessage(res);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== selectedProduct.id)
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
      const res = await ProductAPI.getAllProduct(
        page,
        limit,
        sortBy,
        sortDir,
        keyword,
        selectedCate
      );
      setProducts(res.content);
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

  const showProductDetail = (product) => {};

  return (
    <div className="container-fluid">
      <Navbar />
      <h2>Manager Products</h2>
      <Link to="/products/save">Create new product</Link>
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}
      <form onSubmit={handleSearch} className="form-inline m-3">
        Category: &nbsp;
        <select className="form-control" onChange={handleSelectCate}>
          <option value="0">All categories</option>
          {categories.map((cate) => (
            <option key={cate.id} value={cate.id}>
              {cate.name}
            </option>
          ))}
        </select>
        &nbsp; Filter: &nbsp;
        <input
          type="search"
          disabled={selectedCate != 0}
          className="form-control"
          required
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="submit"
          className="btn btn-primary ml-1"
          disabled={selectedCate != 0}
          value="Search"
        />
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
              <th>Main Image</th>
              <TableHeader
                label="Product Name"
                field="name"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <th>Brand</th>
              <th>Category</th>
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
            {products?.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {product.mainImage ? (
                    <img
                      src={`http://localhost:8080/products/${product.mainImage}`}
                      alt="product preview"
                      className="image-fluid"
                      style={{ width: 120 }}
                    />
                  ) : (
                    <PortraitIcon style={{ fontSize: 60, color: "gray" }} />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.brand.name}</td>
                <td>{product.category.name}</td>
                <td>
                  {product.enable ? (
                    <ToggleOnIcon
                      style={{ fontSize: 30, color: "green" }}
                      onClick={() => handleProductStatus(product)}
                    />
                  ) : (
                    <ToggleOffIcon
                      style={{ fontSize: 30, color: "gray" }}
                      onClick={() => handleProductStatus(product)}
                    />
                  )}
                </td>
                <td>
                  <ArticleIcon
                    style={{ fontSize: 30, color: "green" }}
                    onClick={() => showProductDetail(product)}
                  />{" "}
                  &nbsp;
                  <EditIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => handleEdit(product)}
                  />{" "}
                  &nbsp;{" "}
                  {user.roles.some(
                    (role) => role == "ROLE_ADMIN" || role == "ROLE_EDITOR"
                  ) && (
                    <DeleteIcon
                      style={{ color: "gray", fontSize: 30 }}
                      onClick={() => handleDelete(product)}
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
            Showing products #{startCount} to {endCount} of {totalElements}{" "}
            elements
          </span>
        ) : (
          <span>No product found</span>
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
          message={`Are you sure you want to delete this product ID ${selectedProduct.id}?`}
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
          type="confirm"
        />
      )}
      <Footer />
    </div>
  );
};
export default Product;
