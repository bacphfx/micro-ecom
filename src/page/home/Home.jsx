import React, { useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="container-fluid">
      <Navbar />
      <div>
        <h2>E-commerce Control Panel</h2>
        <p>
          Welcome,{" "}
          <Link to="/users/save" state={{ user }}>
            {user.firstName} {user.lastName}
          </Link>{" "}
          [{user.roles.join(", ").toLowerCase()}]
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
