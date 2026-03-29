import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter } from "react-router";
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
)
