import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '~/components/layout/sidebar'
import { Header } from '~/components/layout/header'
import { MobileNav } from '~/components/layout/mobile-nav'
import { OrderModal, FilamentModal, SettingModal } from '~/components/modal'
import { FloatingPromoPopup } from '~/components/ui'

interface AppLayoutProps {
  managerData: any
}

export const AppLayout: React.FC<AppLayoutProps> = ({ managerData: m }) => {
  const isDark = m.theme === 'dark'

  return (
    <div
      className={`flex h-screen w-full overflow-hidden font-sans ${
        isDark
          ? 'bg-[#09090b] text-zinc-100'
          : 'bg-gradient-to-br from-orange-100/80 via-[#fff3ea] to-amber-100/70 text-zinc-900'
      }`}
    >
      <Sidebar
        theme={m.theme}
        user={m.user}
        gasUrl={m.gasUrl}
        syncStatus={m.syncStatus}
        ordersCount={m.orders.length}
        filamentsCount={m.filaments.length}
        onOpenSettings={() => m.setIsSettingModalOpen(true)}
        onRefresh={() => m.fetchFromGoogleSheets()}
      />

      <div className='flex-1 flex flex-col min-w-0 h-screen overflow-hidden'>
        <Header
          theme={m.theme}
          gasUrl={m.gasUrl}
          syncStatus={m.syncStatus}
          onOpenSettings={() => m.setIsSettingModalOpen(true)}
          onRefresh={() => m.fetchFromGoogleSheets()}
        />

        <main className='flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full p-3 sm:p-6 md:p-8 pb-20 md:pb-8 scrollbar-hide'>
          <Outlet context={m} />
        </main>
      </div>

      <MobileNav theme={m.theme} ordersCount={m.orders.length} />

      <OrderModal
        isOpen={m.isOrderModalOpen}
        order={m.selectedOrder}
        filaments={m.filaments}
        theme={m.theme}
        showDeleteConfirm={m.showDeleteConfirm}
        onClose={() => m.setIsOrderModalOpen(false)}
        onOpenDeleteConfirm={() => m.setShowDeleteConfirm(true)}
        onCloseDeleteConfirm={() => m.setShowDeleteConfirm(false)}
        onDelete={m.handleDeleteOrder}
        onUpdateStatus={m.handleUpdateStatus}
        onSaveOrder={m.handleUpdateOrder}
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

      <FloatingPromoPopup theme={m.theme} />
    </div>
  )
}
