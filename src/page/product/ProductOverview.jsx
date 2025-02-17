function ProductOverview({
  onFieldChange,
  formData,
  brands,
  categories,
  onSelectChange,
  onCheckboxChange,
}) {
  return (
    <>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Product name:</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            required
            minLength="3"
            maxLength="256"
            onChange={onFieldChange}
            name="name"
            value={formData.name}
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Alias:</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            placeholder="Default is product name (spaces are replaced by dashes)"
            minLength="3"
            maxLength="256"
            onChange={onFieldChange}
            name="alias"
            value={formData.alias}
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Brand:</label>
        <div className="col-sm-10">
          <select
            className="form-control"
            required
            value={formData.brandId}
            onChange={onSelectChange}
            name="brandId"
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Category:</label>
        <div className="col-sm-10">
          <select
            className="form-control"
            required
            value={formData.categoryId}
            onChange={onSelectChange}
            name="categoryId"
          >
            {categories.map((cate) => (
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Enable:</label>
        <div className="col-sm-10">
          <input
            type="checkbox"
            name="enable"
            value={formData.enable}
            checked={formData.enable}
            onChange={onCheckboxChange}
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Stock:</label>
        <div className="col-sm-10">
          <input
            type="number"
            step="1"
            className="form-control"
            required
            onChange={onFieldChange}
            name="stock"
            value={formData.stock}
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Price:</label>
        <div className="col-sm-10">
          <input
            type="number"
            step="1"
            className="form-control"
            required
            onChange={onFieldChange}
            name="price"
            value={formData.price}
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Discount percent:</label>
        <div className="col-sm-10">
          <input
            type="number"
            step="1"
            className="form-control"
            onChange={onFieldChange}
            name="discountPercent"
            value={formData.discountPercent}
          />
        </div>
      </div>
    </>
  );
}

export default ProductOverview;
