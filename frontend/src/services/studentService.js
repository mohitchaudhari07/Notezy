import api from "./api";

export const studentService = {
  /**
   * Fetches analytical dashboard figures (Admin/Moderator dashboard stats)
   */
  async getDashboard() {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data.data;
    } catch {
      console.warn("User is not authorized for dashboard statistics.");
      // Fallback object for standard students who don't have admin/moderator privileges
      return {
        overview: {
          totalUsers: 0,
          totalResources: 0,
          totalSummaries: 0,
          totalViews: 0,
          totalDownloads: 0
        },
        recentResources: []
      };
    }
  },

  /**
   * Fetches the bookmarked/saved study resources list for the student
   */
  async getSavedNotes() {
    const response = await api.get("/users/bookmarks");
    return response.data.data;
  },

  /**
   * Fetches the resource download event history log of the student
   */
  async getDownloads() {
    const response = await api.get("/users/downloads");
    return response.data.data;
  },

  /**
   * Modifies/Updates student profile information
   * @param {Object} profileData - name, university, branch
   */
  async updateProfile(profileData) {
    const response = await api.put("/users/profile", profileData);
    return response.data.data;
  },

  /**
   * Toggles bookmarking (saving/removing) for a resource/paper
   * @param {String} resourceId - Target paper ID
   */
  async bookmarkResource(resourceId) {
    const response = await api.post("/users/bookmarks", { resourceId });
    return response.data.data;
  },

  /**
   * Logs a download history record for a resource/paper
   * @param {String} resourceId - Target paper ID
   */
  async recordDownload(resourceId) {
    const response = await api.post("/users/downloads", { resourceId });
    return response.data.data;
  }
};
