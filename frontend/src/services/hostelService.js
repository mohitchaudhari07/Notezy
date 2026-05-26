import api from "./api";

export const hostelService = {
  async getHostels(params = {}) {
    const response = await api.get("/hostels", { params });
    return response.data;
  },

  async getHostelById(id) {
    const response = await api.get(`/hostels/${id}`);
    return response.data;
  },

  async submitHostelRequest(data) {
    const response = await api.post("/hostels/requests", data);
    return response.data;
  },
};
