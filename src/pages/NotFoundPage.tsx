import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const context = useOutletContext<any>();
  const isDark = context?.theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${
        isDark ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-500'
      }`}>
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-2xl font-black mb-2">404 - Không tìm thấy trang</h1>
      <p className="text-xs opacity-60 max-w-sm mb-6">
        Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
      >
        <Home size={14} />
        <span>Về Trang chủ</span>
      </Link>
    </div>
  );
};
