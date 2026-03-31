import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3600}
            closeOnClick
            pauseOnHover
            newestOnTop
            hideProgressBar={false}
            className="bb-toast-container"
            toastClassName="bb-toast"
            progressClassName="bb-toast-progress"
          />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
