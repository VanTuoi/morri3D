import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '~/components/ui'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center p-4'>
      <div className='text-6xl font-black text-orange-500 mb-2'>404</div>
      <h2 className='text-xl font-bold mb-2'>Trang không tồn tại</h2>
      <p className='text-xs opacity-60 max-w-sm mb-6'>
        Đường dẫn bạn truy cập không hợp lệ hoặc đã bị thay đổi vị trí.
      </p>
      <Button
        onClick={() => navigate('/')}
        className='bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer'
      >
        <Home size={16} />
        <span>Về trang chủ</span>
      </Button>
    </div>
  )
}

export default NotFoundPage
