import React, { useEffect, useRef } from 'react';
import { AlertCircle, Lock } from 'lucide-react';

interface LoginScreenProps {
  theme: 'dark' | 'light';
  authError?: string;
  toggleTheme: () => void;
  googleClientId: string;
  onCredentialResponse: (response: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  theme,
  authError,
  toggleTheme,
  googleClientId,
  onCredentialResponse
}) => {
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((window as any).google?.accounts?.id) {
      const cid = googleClientId || 'YOUR_GOOGLE_CLIENT_ID';
      
      try {
        (window as any).google.accounts.id.initialize({
          client_id: cid,
          callback: onCredentialResponse,
          auto_select: false
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: theme === 'light' ? 'outline' : 'filled_black',
            size: 'large',
            shape: 'pill',
            text: 'signin_with',
            width: '280'
          });
        }
      } catch (err) {
        console.warn('Google GSI init warning:', err);
      }
    }
  }, [googleClientId, theme, onCredentialResponse]);

  return (
    <div className={`${theme === 'light' ? 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 text-gray-900' : 'bg-[#0a0a0c] text-gray-100'} min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute top-[-15%] left-[-15%] w-[55vw] h-[55vw] min-w-[350px] min-h-[350px] bg-gradient-to-br from-rose-500/40 via-orange-500/25 to-pink-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vw] min-w-[450px] min-h-[450px] bg-gradient-to-tl from-amber-500/30 via-rose-500/20 to-purple-500/25 rounded-full mix-blend-screen filter blur-[140px] animate-pulse pointer-events-none"></div>

      <div className={`${theme === 'light' ? 'bg-white/80 border-white/60 shadow-[0_20px_70px_rgba(251,146,60,0.2)]' : 'bg-[#18181b]/80 border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.7)]'} backdrop-blur-3xl w-full max-w-[390px] rounded-[2.5rem] p-8 text-center border relative z-10 animate-in fade-in zoom-in-95 duration-300`}>
        <div className="w-24 h-24 mx-auto rounded-3xl p-[2.5px] bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 shadow-[0_10px_35px_rgba(251,146,60,0.35)] mb-6 transition-transform hover:scale-105 duration-300">
          <img src="/logo.png" alt="Morri 3D Logo" className="w-full h-full object-cover rounded-[21px]" />
        </div>

        <h2 className="text-2xl font-black tracking-tight mb-1">
          Morri<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 ml-1">3D Printing</span>
        </h2>
        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-8`}>
          Hệ thống Quản lý Đơn hàng & Kho Nhựa In 3D
        </p>

        {authError && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium flex items-center gap-2 text-left animate-in shake duration-200">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div ref={googleBtnRef} className="flex justify-center min-h-[44px]"></div>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] opacity-60 pt-2">
            <Lock size={12} />
            <span>Chỉ tài khoản Google được cấp phép mới có thể truy cập</span>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-end text-[11px] opacity-70 border-t border-black/5 dark:border-white/5 pt-4">
          <button onClick={toggleTheme} className="cursor-pointer">
            {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
          </button>
        </div>
      </div>
    </div>
  );
};
