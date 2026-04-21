import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

class LoanService {
  async calculateLoan(requestData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CALCULATE_LOAN, requestData);
      return response.data;
    } catch (error) {
      console.error('Loan calculation failed:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_CHECK);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default new LoanService();