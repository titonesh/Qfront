import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateToProducts = () => {
    navigate('/products');
  };

  const handleNavigateToCalculator = (productId) => {
    navigate(`/calculator/${productId}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Check if we're in admin section
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLogin = location.pathname === '/admin-login';

  if (isAdminRoute || isAdminLogin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage onNavigateToCalculator={handleNavigateToProducts} />} 
      />
      <Route 
        path="/products" 
        element={
          <ProductPage 
            onNavigateToCalculator={handleNavigateToCalculator}
            onBackHome={handleBackToHome}
          />
        } 
      />
      <Route 
        path="/calculator/:productId" 
        element={
          <ProductPage 
            onNavigateToCalculator={handleNavigateToCalculator}
            onBackHome={handleBackToHome}
          />
        } 
      />
    </Routes>
  );
}

export default App;