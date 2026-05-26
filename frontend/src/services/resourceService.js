import api from "./api";

export const resourceService = {
  /**
   * Fetches/searches study resources based on filters
   * @param {Object} params - type, university, branch, semester, subject, query, page, limit
   */
  async getResources(params = {}) {
    const response = await api.get("/resources", { params });
    return response.data.data;
  },

  /**
   * Fetches detailed metadata for a specific academic resource
   * @param {String} id - Resource Mongo ID
   */
  async getResourceById(id) {
    const response = await api.get(`/resources/${id}`);
    return response.data.data;
  },

  /**
   * Searches resources by term query
   * @param {String} query
   * @param {Object} params
   */
  async searchResources(query, params = {}) {
    const response = await api.get("/resources/catalog/search", {
      params: { q: query, ...params },
    });
    return response.data.data;
  },

  /**
   * Fetches direct Cloudinary secure file download links
   * @param {String} id - Resource ID
   */
  async downloadResource(id) {
    const response = await api.get(`/resources/${id}/download`);
    return response.data.data;
  },

  /**
   * Toggles bookmarked status on a resource (adds or removes)
   * @param {String} id - Resource ID
   */
  async bookmarkResource(id) {
    const response = await api.post("/users/bookmarks", { resourceId: id });
    return response.data.data;
  },

  async getCatalogUniversities() {
    const response = await api.get("/resources/catalog/universities");
    return response.data.data;
  },

  async getCatalogStreams() {
    const response = await api.get("/resources/catalog/streams");
    return response.data.data;
  },

  async getCatalogSubjects(branch, academicYear) {
    const response = await api.get("/resources/catalog/subjects", {
      params: { branch, academicYear }
    });
    return response.data.data;
  },

  async getCatalogPapers(params = {}) {
    const response = await api.get("/resources/catalog/papers", { params });
    return response.data.data;
  },

  async getCatalogPaperDetails(id) {
    const response = await api.get(`/resources/catalog/papers/${id}`);
    return response.data.data;
  }
};
