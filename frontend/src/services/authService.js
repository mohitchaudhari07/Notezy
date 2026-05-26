import api from "./api";

function mapAuthResponse(response) {
  const data = response.data?.data;
  return {
    token: data?.accessToken,
    user: data?.user,
  };
}

export const authService = {
  /**
   * Registers a new student account
   * @param {Object} userData - name, email, password, university, branch
   */
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return mapAuthResponse(response);
  },

  /**
   * Logs in a student
   * @param {Object} credentials - email, password
   */
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return mapAuthResponse(response);
  },

  /**
   * Logs out user session
   */
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Server-side logout failed:", error.message);
    }
  },

  /**
   * Fetches active authenticated user profile
   */
  async getProfile() {
    const response = await api.get("/auth/me");
    return response.data.data;
  }
};
