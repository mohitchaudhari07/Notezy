import api from "./api";

export const enquiryService = {
  /**
   * Submits a new contact form enquiry/message to the backend database
   * @param {Object} data - Contains name, email, subject, and message
   */
  async submitEnquiry(data) {
    const response = await api.post("/enquiry", data);
    return response.data;
  }
};
