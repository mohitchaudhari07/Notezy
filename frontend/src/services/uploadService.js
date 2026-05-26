import api from "./api";

export const uploadService = {
  /**
   * Uploads academic material documents to the backend with metadata
   * @param {Object} uploadData - { title, type, examType, year, semester, subject, branch, university }
   * @param {File} file - The file to upload (PDF/Image)
   * @param {Function} onUploadProgress - Callback for tracking uploading progress
   */
  async uploadResource(uploadData, file, onUploadProgress = () => {}) {
    const formData = new FormData();
    
    // Append standard parameters
    Object.keys(uploadData).forEach((key) => {
      if (uploadData[key] !== undefined && uploadData[key] !== null) {
        formData.append(key, uploadData[key]);
      }
    });
    
    // Append file
    formData.append("file", file);

    const response = await api.post("/resources/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    });

    return response.data.data;
  }
};
