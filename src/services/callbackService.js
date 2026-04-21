import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

class CallbackService {
  async createCallbackRequest(data) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CREATE_CALLBACK, data);
      return response.data;
    } catch (error) {
      console.error('Callback request failed:', error);
      throw error;
    }
  }

  async getAllCallbacks(page = 1, pageSize = 10, q = '', status = 'all', dateRange = '7d') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_CALLBACKS, {
        params: { page, pageSize, q, status, dateRange }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch callbacks:', error);
      throw error;
    }
  }

  async updateCallback(id, data) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.UPDATE_CALLBACK(id), data);
      return response.data;
    } catch (error) {
      console.error('Failed to update callback:', error);
      throw error;
    }
  }

  async bulkUpdateCallbacks(ids, action) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.BULK_UPDATE_CALLBACKS, { ids, action });
      return response.data;
    } catch (error) {
      console.error('Bulk update failed:', error);
      throw error;
    }
  }
}

export default new CallbackService();