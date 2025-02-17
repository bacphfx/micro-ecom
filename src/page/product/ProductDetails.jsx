import CancelIcon from "@mui/icons-material/Cancel";

function ProductDetails({
  details,
  onDetailsChange,
  onAddDetail,
  onRemoveDetail,
}) {
  return (
    <>
      {details?.map((detail, index) => (
        <div className="form-inline" key={index}>
          <label className="m-3">Name:</label>
          <input
            type="text"
            name="name"
            className="form-control w-25"
            maxLength="255"
            value={detail?.name}
            onChange={(e) => onDetailsChange(index, e)}
          />
          <label className="m-3">Value:</label>
          <input
            type="text"
            name="value"
            className="form-control w-25"
            maxLength="255"
            value={detail?.value}
            onChange={(e) => onDetailsChange(index, e)}
          />
          {index !== details.length - 1 && (
            <CancelIcon
              className="ml-2"
              onClick={() => onRemoveDetail(index)}
            />
          )}
        </div>
      ))}
      <input
        type="button"
        value="Add more detail"
        className="btn btn-secondary"
        onClick={onAddDetail}
      />
    </>
  );
}

export default ProductDetails;
