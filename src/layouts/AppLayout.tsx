import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { OrderModal, FilamentModal, SettingModal } from '../components/Modals';

interface AppLayoutProps {
  managerData: any;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ managerData: m }) => {
  const isDark = m.theme === 'dark';

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-[#fafafa] text-zinc-900'
    }`}>
      {/* Desktop Sidebar */}
      <Sidebar
        theme={m.theme}
        onToggleTheme={m.toggleTheme}
        user={m.user}
        gasUrl={m.gasUrl}
        syncStatus={m.syncStatus}
        ordersCount={m.orders.length}
        filamentsCount={m.filaments.length}
        onOpenSettings={() => m.setIsSettingModalOpen(true)}
        onRefresh={() => m.fetchFromGoogleSheets()}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Header */}
        <Header
          theme={m.theme}
          onToggleTheme={m.toggleTheme}
          user={m.user}
          gasUrl={m.gasUrl}
          syncStatus={m.syncStatus}
          onOpenSettings={() => m.setIsSettingModalOpen(true)}
          onRefresh={() => m.fetchFromGoogleSheets()}
        />

        {/* Scrollable Viewport with Router Outlet */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 pb-20 md:pb-8 scrollbar-hide">
          <Outlet context={m} />
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <MobileNav
        theme={m.theme}
        ordersCount={m.orders.length}
      />

      {/* Global Modals */}
      <OrderModal
        isOpen={m.isOrderModalOpen}
        order={m.selectedOrder}
        theme={m.theme}
        showDeleteConfirm={m.showDeleteConfirm}
        onClose={() => m.setIsOrderModalOpen(false)}
        onOpenDeleteConfirm={() => m.setShowDeleteConfirm(true)}
        onCloseDeleteConfirm={() => m.setShowDeleteConfirm(false)}
        onDelete={m.handleDeleteOrder}
        onUpdateStatus={m.handleUpdateStatus}
      />

      <FilamentModal
        isOpen={m.isFilamentModalOpen}
        editingFilament={m.editingFilament}
        theme={m.theme}
        onClose={() => m.setIsFilamentModalOpen(false)}
        onEditChange={m.setEditingFilament}
        onSave={m.handleSaveFilamentEdit}
        onDelete={m.handleDeleteFilament}
      />

      <SettingModal
        isOpen={m.isSettingModalOpen}
        theme={m.theme}
        user={m.user}
        gasUrl={m.gasUrl}
        syncStatus={m.syncStatus}
        syncMessage={m.syncMessage}
        onClose={() => m.setIsSettingModalOpen(false)}
        onSetTheme={m.setTheme}
        onLogout={m.handleLogout}
        onPushToSheet={m.pushToGoogleSheets}
      />
    </div>
  );
};
