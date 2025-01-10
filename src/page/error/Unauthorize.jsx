import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

function Unauthorize() {
  return (
    <div>
      <Navbar />
      <div className="text-center">
        <h2>You don't have permission to access</h2>
      </div>
      <Footer />
    </div>
  );
}

export default Unauthorize;
