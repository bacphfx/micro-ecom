const Navbar = () => {
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
            <li className="nav-item">
              <a className="nav-link" href="/users">
                Users
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/categories">
                Categories
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/brands">
                Brands
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products">
                Products
              </a>
            </li>
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
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
