import api from "./api";

export const paymentService = {
  async createPaymentIntent(data) {
    const response = await api.post("/payments/create-intent", data);
    return response.data;
  },

  async confirmPayment(paymentId) {
    const response = await api.post(`/payments/${paymentId}/confirm`);
    return response.data;
  },

  async getPaymentHistory() {
    const response = await api.get("/payments/history");
    return response.data;
  },

  async getSubscription() {
    const response = await api.get("/payments/subscription");
    return response.data;
  },
};
