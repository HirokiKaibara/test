import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import LoginPage from './pages/LoginPage/LoginPage';
import CustomerLoginPage from './pages/CustomerLoginPage/CustomerLoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage';
import BookingForm from './components/BookingForm/BookingForm';
import CustomerRegisterPage from './pages/CustomerRegisterPage/CustomerRegisterPage';
import CustomerProfilePage from './pages/CustomerProfilePage/CustomerProfilePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customer-login" element={<CustomerLoginPage />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/booking-form" element={<BookingForm />} />
          <Route path="/customer-register" element={<CustomerRegisterPage />} />
          <Route path="/customer-profile" element={<CustomerProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;