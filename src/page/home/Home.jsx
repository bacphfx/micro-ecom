import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const Home = () => {
  return (
    <div className="container-fluid">
      <Navbar />
      <div>
        <h1>E-commerce Control Panel</h1>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
