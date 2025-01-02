function Modal({ title, message, onConfirm, onClose, type }) {
  return (
    <div
      className="modal fade text-center show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            {type === "error" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onClose}
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={onConfirm}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onClose}
                >
                  No
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
