function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <a className="page-link" onClick={() => onPageChange(1)}>
              First
            </a>
          </li>
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <a className="page-link" onClick={() => onPageChange(page - 1)}>
              Previous
            </a>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <a className="page-link" onClick={() => onPageChange(i + 1)}>
                {i + 1}
              </a>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <a className="page-link" onClick={() => onPageChange(page + 1)}>
              Next
            </a>
          </li>
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <a className="page-link" onClick={() => onPageChange(totalPages)}>
              Last
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
