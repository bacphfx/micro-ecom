import PersonIcon from "@mui/icons-material/Person";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navLinks = [
    {
      path: "/",
      label: "Home",
      roles: ["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_SHIPPER"],
    },
    { path: "/users", label: "Users", roles: ["ROLE_ADMIN"] },
    {
      path: "/categories",
      label: "Categories",
      roles: ["ROLE_ADMIN", "ROLE_EDITOR"],
    },
    {
      path: "/brands",
      label: "Brands",
      roles: ["ROLE_ADMIN", "ROLE_EDITOR"],
    },
    {
      path: "/products",
      label: "Products",
      roles: ["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_SHIPPER"],
    },
  ];

  const canAccess = (userRoles, allowedRoles) => {
    return allowedRoles.some((role) => userRoles?.includes(role));
  };

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const viewDetail = () => {
    navigate("/users/save", { state: { user } });
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#topNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="topNavbar">
          <ul className="navbar-nav">
            {navLinks.map((link) =>
              canAccess(user?.roles, link.roles) ? (
                <li className="nav-item" key={link.path}>
                  <Link className="nav-link" to={link.path}>
                    {link.label}
                  </Link>
                </li>
              ) : null
            )}
            <li className="nav-item">
              <a className="nav-link" href="/customers">
                Customers
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/shipping">
                Shipping
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/orders">
                Orders
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/settings">
                Settings
              </a>
            </li>
            <li className="nav-item">
              <PersonIcon fontSize="large" style={{ color: "white" }} />
            </li>
            {user && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                  {user.firstName} {user.lastName}
                </a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" onClick={viewDetail}>
                    Profile
                  </a>
                  <a className="dropdown-item" onClick={logout}>
                    Logout
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
