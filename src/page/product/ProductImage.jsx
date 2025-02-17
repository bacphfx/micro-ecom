import default_image from "../../assets/images/image-thumbnail.png";
import CancelIcon from "@mui/icons-material/Cancel";

function ProductImage({
  mainImage,
  extraImages,
  onMainImageChange,
  onAddExtraImage,
  onDeleteExtraImage,
}) {
  const handleExtraImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        imageUrls.push(event.target.result);
        if (imageUrls.length === files.length) {
          onAddExtraImage(files, imageUrls);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-3 border m-3 p-2">
          <div>
            <label>Main image:</label>
          </div>
          <img src={mainImage} alt="main image preview" className="img-fluid" />
          <div>
            <input
              type="file"
              accept="image/png, image/jpg"
              name="mainImage"
              onChange={onMainImageChange}
            />
          </div>
        </div>
        {extraImages.map((extraImage, i) => (
          <div className="col-sm-3 border m-3 p-2" key={i}>
            <div>
              <label>Extra image #{i + 1}:</label>
              <span
                style={{ cursor: "pointer" }}
                className="float-right"
                onClick={() => onDeleteExtraImage(i)}
              >
                <CancelIcon />
              </span>
            </div>
            <img
              src={extraImage}
              alt="main image preview"
              className="img-fluid"
              style={{ width: "600px" }}
            />
          </div>
        ))}

        <div className="col-sm-3 border m-3 p-2">
          <div>
            <label>Extra image #{extraImages.length + 1}:</label>
          </div>
          <img
            src={default_image}
            alt="main image preview"
            className="img-fluid"
          />
          <div>
            <input
              type="file"
              accept="image/png, image/jpg"
              name="extraImage"
              multiple
              onChange={handleExtraImageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductImage;
