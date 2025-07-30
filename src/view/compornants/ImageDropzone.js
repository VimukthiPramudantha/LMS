

  import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './DropZone.css'
import PropTypes from 'prop-types';

const ImageDropzone = ({ onUploadComplete,studentIde }) => {
  const studentId= studentIde;//localStorage.getItem("studentID");
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [currentProfileImage, setCurrentProfileImage] = useState(null);

  // Fetch current profile image on component mount
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `https://primelms-server.netlify.app/api/coordinatorAddStudent/getStudent/${studentIde}`
        );
        if (response.data.profileImage) {
          setCurrentProfileImage(response.data.profileImage);
        }
      } catch (err) {
        console.error('Error fetching profile image:', err);
      }
    };

    fetchProfileImage();
  }, [studentId, onUploadComplete]); // Re-fetch when upload completes

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('Please upload a valid image file');
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024
  });

  const uploadImage = async () => {
    if (!preview) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    try {
      const response = await axios.put(
        `https://primelms-server.netlify.app/api/coordinatorAddStudent/${studentIde}/image`,
        { imageBase64: preview },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setCurrentProfileImage(response.data.profileImage);
      onUploadComplete();
      setError(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="dropzone-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
        <small className="text-muted">(Only *.jpeg, *.jpg, *.png, max 2MB)</small>
      </div>

      {error && <div className="alert alert-danger mt-2">{error}</div>}

      {preview && (
        <div className="image-preview-container mt-3">
          <div className="image-wrapper">
            <img 
              src={preview} 
              alt="Preview" 
              className="img-thumbnail"
              style={{ maxHeight: '200px' }}
            />
            <button 
              onClick={removeImage}
              className="btn btn-sm btn-danger remove-btn"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
          <button
            onClick={uploadImage}
            disabled={isUploading}
            className="btn btn-primary mt-2"
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : 'Upload Image'}
          </button>
        </div>
      )}

      {/* Current Profile Image Display */}
      <div className="current-profile-frame mt-4">
        <h5>Current Profile Image</h5>
        {currentProfileImage ? (
          <div className="profile-image-frame">
            <img 
              src={currentProfileImage} 
              alt="Current Profile" 
              className="img-thumbnail"
              style={{ 
                width: '150px', 
                height: '150px',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>
        ) : (
          <div className="no-image-placeholder">
            <p>No profile image uploaded yet</p>
            <div 
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span>Image Preview</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ImageDropzone.propTypes = {
  studentId: PropTypes.string.isRequired,
  onUploadComplete: PropTypes.func.isRequired
};

export default ImageDropzone;