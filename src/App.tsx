import React from 'react';
import { 
  Home, 
  List, 
  PlusCircle, 
  Settings, 
  Database, 
  RefreshCw,
  User 
} from 'lucide-react';
import { useManagerData } from './hooks/useManagerData';
import { LoginScreen } from './components/LoginScreen';
import { OrderModal, FilamentModal, SettingModal } from './components/Modals';
import { DashboardTab, OrdersTab, InventoryTab, AddTab } from './components/Tabs';

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
    <div className={`${m.theme === 'light' ? 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 text-gray-900 selection:bg-orange-500/20' : 'bg-[#0a0a0c] text-gray-100 selection:bg-orange-500/30'} min-h-screen flex items-center justify-center sm:p-4 font-sans relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute top-[-15%] left-[-15%] w-[55vw] h-[55vw] min-w-[350px] min-h-[350px] bg-gradient-to-br from-rose-500/40 via-orange-500/25 to-pink-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }}></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vw] min-w-[450px] min-h-[450px] bg-gradient-to-tl from-amber-500/30 via-rose-500/20 to-purple-500/25 rounded-full mix-blend-screen filter blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none"></div>

      <div className={`${m.theme === 'light' ? 'bg-white/75 backdrop-blur-[50px] shadow-[0_20px_70px_rgba(251,146,60,0.18)] border-white/60' : 'bg-[#18181b]/70 backdrop-blur-[50px] shadow-[0_25px_80px_rgba(0,0,0,0.6)] border-white/10'} w-full sm:max-w-[420px] h-[100dvh] sm:h-[850px] sm:rounded-[3rem] relative overflow-hidden flex flex-col sm:border-[8px] ring-1 ring-white/10 z-10 transition-all duration-500`}>
        <header className="bg-transparent pt-12 pb-3 px-5 border-b border-black/5 dark:border-white/10 z-20 flex-shrink-0 relative">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 shadow-md shadow-orange-500/25 mr-3 flex-shrink-0">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-[14px]" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight flex items-center">
                  Morri<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-600 dark:from-rose-300 dark:to-amber-200 ml-1 font-black">3D Printing</span>
                </h1>
                
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${m.gasUrl ? (m.syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : m.syncStatus === 'error' ? 'bg-red-400' : 'bg-emerald-400') : 'bg-gray-400'}`}></span>
                  <span className={`text-[10px] font-medium ${m.theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {m.gasUrl ? (m.syncStatus === 'syncing' ? 'Đang đồng bộ...' : m.syncStatus === 'error' ? 'Lỗi kết nối Sheet' : 'Google Sheet DB') : 'Lưu Offline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {m.user && (
                <div 
                  onClick={() => m.setIsSettingModalOpen(true)}
                  className="cursor-pointer flex items-center gap-1.5 bg-black/10 dark:bg-white/10 p-1 pl-1.5 pr-2.5 rounded-full border border-white/20 transition-all hover:scale-105"
                  title={`Đang đăng nhập: ${m.user.name}`}
                >
                  {m.user.picture ? (
                    <img src={m.user.picture} alt="Avatar" className="w-6 h-6 rounded-full border border-white/40" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 flex items-center justify-center text-[10px] font-bold text-gray-900">
                      {m.user.name?.charAt(0) || <User size={12} />}
                    </div>
                  )}
                  <span className="text-[11px] font-medium max-w-[60px] truncate">{m.user.name?.split(' ')[0] || 'Admin'}</span>
                </div>
              )}

              {m.gasUrl && (
                <button
                  onClick={() => m.fetchFromGoogleSheets()}
                  disabled={m.syncStatus === 'syncing'}
                  className={`w-9 h-9 rounded-2xl ${m.theme === 'light' ? 'bg-gray-200/80 hover:bg-gray-300 text-gray-700' : 'bg-white/10 hover:bg-white/20 text-gray-200'} border border-black/5 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer`}
                  title="Tải lại từ Google Sheet"
                >
                  <RefreshCw size={15} className={m.syncStatus === 'syncing' ? 'animate-spin' : ''} />
                </button>
              )}

              <button 
                onClick={() => {
                  m.setTempGasUrl(m.gasUrl);
                  m.setTempClientId(m.googleClientId);
                  m.setIsSettingModalOpen(true);
                }}
                className={`w-9 h-9 rounded-2xl ${m.theme === 'light' ? 'bg-gray-200/80 hover:bg-gray-300 text-gray-700' : 'bg-white/10 hover:bg-white/20 text-gray-200'} border border-black/5 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer`}
                title="Cài đặt & Database"
              >
                <Settings size={17} className="hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-10 pb-20">
          {m.activeTab === 'dashboard' && <DashboardTab stats={m.stats} orders={m.orders} theme={m.theme} />}
          {m.activeTab === 'orders' && <OrdersTab searchQuery={m.searchQuery} onSearchChange={m.setSearchQuery} filteredOrders={m.filteredOrders} theme={m.theme} onOpenOrderModal={m.openOrderModal} />}
          {m.activeTab === 'inventory' && <InventoryTab filaments={m.filaments} theme={m.theme} onOpenFilamentModal={m.openFilamentModal} />}
          {m.activeTab === 'add' && (
            <AddTab
              addMode={m.addMode}
              setAddMode={m.setAddMode}
              newOrder={m.newOrder}
              setNewOrder={m.setNewOrder}
              onAddOrder={m.handleAddOrder}
              onAddOrderMaterial={m.handleAddOrderMaterial}
              onUpdateOrderMaterial={m.handleUpdateOrderMaterial}
              onRemoveOrderMaterial={m.handleRemoveOrderMaterial}
              newFilament={m.newFilament}
              setNewFilament={m.setNewFilament}
              pendingVariations={m.pendingVariations}
              onAddVariation={m.handleAddVariation}
              onRemoveVariation={m.handleRemoveVariation}
              onAddFilament={m.handleAddFilament}
              filaments={m.filaments}
              theme={m.theme}
            />
          )}
        </main>

        <div className={`absolute bottom-0 w-full z-20 pb-safe sm:pb-4 px-4 pt-2 bg-gradient-to-t ${m.theme === 'light' ? 'from-white/95 via-white/85' : 'from-[#18181b] via-[#18181b]/95'} to-transparent`}>
          <nav className={`${m.theme === 'light' ? 'bg-white/90 border-gray-200 shadow-[0_-15px_35px_rgba(251,146,60,0.12)]' : 'bg-[#1c1c1e]/90 border-white/10 shadow-[0_-15px_35px_rgba(0,0,0,0.5)]'} backdrop-blur-3xl border px-2 py-2 flex justify-around items-center rounded-3xl mb-4 sm:mb-2 transition-all`}>
            <button 
              onClick={() => m.setActiveTab('dashboard')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${m.activeTab === 'dashboard' ? (m.theme === 'light' ? 'text-orange-600' : 'text-orange-200') : (m.theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              {m.activeTab === 'dashboard' && <div className={`absolute inset-0 ${m.theme === 'light' ? 'bg-orange-500/10' : 'bg-white/10'} rounded-2xl blur-[2px]`}></div>}
              <Home size={22} className={`relative z-10 ${m.activeTab === 'dashboard' ? (m.theme === 'light' ? 'fill-orange-500/20 stroke-orange-600' : 'fill-orange-400/20 stroke-orange-300') : ''}`} />
              <span className="text-[10px] font-medium mt-1.5 relative z-10">Tổng quan</span>
            </button>
            
            <button 
              onClick={() => m.setActiveTab('orders')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${m.activeTab === 'orders' ? (m.theme === 'light' ? 'text-orange-600' : 'text-orange-200') : (m.theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              {m.activeTab === 'orders' && <div className={`absolute inset-0 ${m.theme === 'light' ? 'bg-orange-500/10' : 'bg-white/10'} rounded-2xl blur-[2px]`}></div>}
              <List size={22} className={`relative z-10 ${m.activeTab === 'orders' ? (m.theme === 'light' ? 'fill-orange-500/20 stroke-orange-600' : 'fill-orange-400/20 stroke-orange-300') : ''}`} />
              <span className="text-[10px] font-medium mt-1.5 relative z-10">Đơn hàng</span>
            </button>
            
            <button 
              onClick={() => m.setActiveTab('inventory')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${m.activeTab === 'inventory' ? (m.theme === 'light' ? 'text-purple-600' : 'text-purple-200') : (m.theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              {m.activeTab === 'inventory' && <div className={`absolute inset-0 ${m.theme === 'light' ? 'bg-purple-500/10' : 'bg-white/10'} rounded-2xl blur-[2px]`}></div>}
              <Database size={22} className={`relative z-10 ${m.activeTab === 'inventory' ? (m.theme === 'light' ? 'fill-purple-500/20 stroke-purple-600' : 'fill-purple-400/20 stroke-purple-300') : ''}`} />
              <span className="text-[10px] font-medium mt-1.5 relative z-10">Kho nhựa</span>
            </button>
            
            <button 
              onClick={() => m.setActiveTab('add')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${m.activeTab === 'add' ? (m.theme === 'light' ? 'text-orange-600' : 'text-orange-200') : (m.theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              <div className={`relative z-10 flex items-center justify-center transition-transform ${m.activeTab === 'add' ? 'scale-110' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 rounded-full blur-md opacity-50"></div>
                <div className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-gray-900 p-3 rounded-full relative z-10 border border-white/30 shadow-md">
                  <PlusCircle size={22} />
                </div>
              </div>
              <span className={`text-[10px] font-medium mt-1.5 relative z-10 ${m.activeTab === 'add' ? (m.theme === 'light' ? 'text-orange-600' : 'text-orange-300') : ''}`}>Thêm mới</span>
            </button>
          </nav>
        </div>

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
          tempGasUrl={m.tempGasUrl}
          tempClientId={m.tempClientId}
          syncStatus={m.syncStatus}
          syncMessage={m.syncMessage}
          onClose={() => m.setIsSettingModalOpen(false)}
          onSetTheme={(t) => m.theme !== t && m.toggleTheme()}
          onTempGasUrlChange={m.setTempGasUrl}
          onTempClientIdChange={m.setTempClientId}
          onSave={m.handleSaveGasUrl}
          onLogout={m.handleLogout}
          onPushToSheet={() => {
            m.pushToGoogleSheets(m.orders, m.filaments);
            m.setIsSettingModalOpen(false);
          }}
        />
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
        }
      `}} />
    </div>
  );
}
