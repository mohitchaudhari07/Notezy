import api from "./api";

export const aiService = {
  /**
   * Fetches the AI generated summary for a specific study resource
   * @param {String} resourceId - Resource ID
   */
  async getSummary(resourceId) {
    const response = await api.get(`/ai/summary/${resourceId}`);
    return response.data.data;
  },

  /**
   * Manually triggers background AI analysis and summary pipeline for a resource
   * @param {String} resourceId - Resource ID
   */
  async generateSummary(resourceId) {
    const response = await api.post(`/ai/summary/${resourceId}`);
    return response.data.data;
  }
};
