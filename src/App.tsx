import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useManagerData } from './hooks/useManagerData';
import { LoginScreen } from './components/LoginScreen';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { AddPage } from './pages/AddPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const m = useManagerData();

  if (!m.user) {
    return (
      <LoginScreen
        theme={m.theme}
        authError={m.authError}
        toggleTheme={m.toggleTheme}
        googleClientId={m.googleClientId}
        onCredentialResponse={m.handleCredentialResponse}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout managerData={m} />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="add" element={<AddPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
