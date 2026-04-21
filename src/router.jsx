// This file can be used for more complex routing if needed
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CALCULATOR: (productId) => `/calculator/${productId}`,
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin-login',
};