import ReactQuill from "react-quill";
function ProductDescription({ onFieldChange, formData }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  return (
    <>
      <div>
        <label>Short description:</label>
        <ReactQuill
          name="shortDescription"
          value={formData.shortDescription}
          onChange={(value) => onFieldChange("shortDescription", value)}
          modules={modules}
          formats={formats}
        />
      </div>
      <div className="mt-4">
        <label>Long description:</label>
        <ReactQuill
          name="longDescription"
          value={formData.longDescription}
          onChange={(value) => onFieldChange("longDescription", value)}
          modules={modules}
          formats={formats}
        />
      </div>
    </>
  );
}

export default ProductDescription;
