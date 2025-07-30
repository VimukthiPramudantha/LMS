import React, { useEffect } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

const FileUpload = () => {
  useEffect(() => {
    // Initialize Dropzone
    const dropzone = new Dropzone("#my-dropzone", {
      url: "/upload", // Replace with your upload URL
      // Additional Dropzone options
    });

    // Custom initialization logic from component.fileupload.js
    const initFileUpload = () => {
      // Your custom JavaScript code from component.fileupload.js
    };

    initFileUpload(); // Call the custom init function

    // Cleanup on unmount
    return () => {
      dropzone.destroy();
    };
  }, []);

  return (
    <div id="my-dropzone" className="dropzone border border-4 mt-3 100">
      <div className="dz-message"><i className="bi bi-cloud-arrow-up-fill fs-1 text-primary"><br/></i>Drop files here or click to upload.</div>
    </div>
  );
};

export default FileUpload;
