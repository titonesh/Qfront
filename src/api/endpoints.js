export const API_ENDPOINTS = {
  // Loan endpoints
  CALCULATE_LOAN: '/loan/calculate',
  HEALTH_CHECK: '/loan/health',
  
  // Callback endpoints
  CREATE_CALLBACK: '/loan/callback-request',
  GET_CALLBACKS: '/loan/callback-requests',
  UPDATE_CALLBACK: (id) => `/loan/callback-requests/${id}`,
  BULK_UPDATE_CALLBACKS: '/loan/callback-requests/bulk',
};