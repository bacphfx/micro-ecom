function ProductShipping({ onFieldChange, formData }) {
  return (
    <>
      <div className="form-group row">
        The following information is important to calculate shipping cost for
        the product.
        <br />
        The dimensions (L X W X H) is for the box that is used to package the
        product.
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Length (inch):</label>
        <div className="col-sm-10">
          <input
            type="number"
            step="0.01"
            className="form-control"
            required
            onChange={onFieldChange}
            name="length"
            value={formData.length}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Width (inch):</label>
        <div className="col-sm-10">
          <input
            type="number"
            step="0.01"
            className="form-control"
            required
            onChange={onFieldChange}
            name="width"
            value={formData.width}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Height (inch):</label>
        <div className="col-sm-10">
          <input
            type="number"
            step="0.01"
            className="form-control"
            required
            onChange={onFieldChange}
            name="height"
            value={formData.height}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Weight (pounds):</label>
        <div className="col-sm-10">
          <input
            type="number"
            step="0.01"
            className="form-control"
            required
            onChange={onFieldChange}
            name="weight"
            value={formData.weight}
          />
        </div>
      </div>
    </>
  );
}

export default ProductShipping;
