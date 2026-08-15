import React, { useEffect, useRef } from 'react';
import { AlertCircle, Lock } from 'lucide-react';

interface LoginScreenProps {
  theme: 'dark' | 'light';
  authError?: string;
  toggleTheme: (e?: React.MouseEvent) => void;
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
  const isDark = theme === 'dark';

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
            theme: isDark ? 'filled_black' : 'outline',
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
  }, [googleClientId, theme, isDark, onCredentialResponse]);

  return (
    <div className={`${
      isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-rose-50/60 text-zinc-900'
    } min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300`}>
      {/* Subtle Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-gradient-to-br from-orange-500/20 to-rose-500/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-gradient-to-tl from-amber-500/20 to-purple-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Central Login Card */}
      <div className={`w-full max-w-[400px] rounded-3xl p-6 sm:p-8 text-center border backdrop-blur-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 shadow-2xl ${
        isDark ? 'bg-zinc-900/80 border-white/10 shadow-black/60' : 'bg-white/85 border-zinc-200 shadow-orange-500/10'
      }`}>
        <div className="w-20 h-20 mx-auto rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-orange-500/20 mb-5">
          <img src="/logo.png" alt="Morri 3D Logo" className="w-full h-full object-cover rounded-[14px]" />
        </div>

        <h2 className="text-2xl font-black tracking-tight mb-1">
          Morri<span className="text-orange-500 ml-1">3D</span>
        </h2>
        <p className="text-xs opacity-60 mb-6">
          Hệ thống Quản lý Đơn hàng & Kho Nhựa In 3D
        </p>

        {authError && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2 text-left">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <div className="space-y-3.5">
          <div ref={googleBtnRef} className="flex justify-center min-h-[44px]" />
          
          <div className="flex items-center justify-center gap-1 text-[11px] opacity-60">
            <Lock size={11} />
            <span>Đăng nhập an toàn qua Google OAuth</span>
          </div>

          {(import.meta.env.VITE_BYPASS_AUTH === 'true' || import.meta.env.DEV) && (
            <button
              type="button"
              onClick={() => {
                const devPayload = {
                  name: 'Dev Admin',
                  email: 'tuoitran62002@gmail.com',
                  picture: '',
                  sub: 'dev-mode'
                };
                localStorage.setItem('3dManager_user', JSON.stringify(devPayload));
                window.location.reload();
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-orange-400/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 dark:text-orange-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>⚡ Đăng nhập nhanh (Dev Mode)</span>
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-end text-[11px] opacity-60 border-t border-inherit pt-3">
          <button onClick={toggleTheme} className="hover:opacity-100 transition-opacity cursor-pointer">
            {isDark ? '☀️ Giao diện sáng' : '🌙 Giao diện tối'}
          </button>
        </div>
      </div>
    </div>
  );
};
