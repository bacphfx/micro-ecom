import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

function NotFount() {
  return (
    <div>
      <Navbar />
      <div className="text-center">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
      <Footer />
    </div>
  );
}

export default NotFount;
