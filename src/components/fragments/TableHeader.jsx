import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function TableHeader({ label, field, sortBy, sortDir, onSort }) {
  return (
    <th onClick={() => onSort(field)} style={{ cursor: "pointer" }}>
      {label}{" "}
      {sortBy === field && (
        <>{sortDir === "asc" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</>
      )}
    </th>
  );
}

export default TableHeader;
