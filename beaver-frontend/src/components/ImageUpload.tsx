import React, { useRef } from "react";
import axios from "axios";

const ImageUpload = ({ onFlowchartExtracted }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(event.target.files);
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/image-to-flowchart",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      onFlowchartExtracted(response.data);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current.click()}
        className="btn-primary"
      >
        Upload Flowchart Image
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImageUpload;
