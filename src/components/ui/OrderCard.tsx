import React from 'react';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { Order, formatCurrency, formatDate } from '../../types';
import { Box, User } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  theme?: 'dark' | 'light';
  onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  theme = 'dark',
  onClick
}) => {
  return (
    <Card
      theme={theme}
      hoverable
      onClick={onClick}
      className="flex flex-col justify-between group"
    >
      <div>
        {/* Top: ID, Date, Status */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-500 tracking-wider">
                #{order.id}
              </span>
              <span className="text-[11px] opacity-60">
                {formatDate(order.date)}
              </span>
            </div>
            <h4 className="font-bold text-base sm:text-lg mt-1 group-hover:text-orange-400 transition-colors line-clamp-1">
              {order.itemName}
            </h4>
          </div>
          <StatusBadge status={order.status} size="sm" />
        </div>

        {/* Materials & Quantity */}
        <div className={`text-xs p-2.5 rounded-xl border mb-3 flex items-center flex-wrap gap-1.5 ${
          theme === 'light' ? 'bg-gray-50/80 border-gray-200 text-gray-700' : 'bg-black/20 border-white/5 text-gray-300'
        }`}>
          <Box size={13} className="text-orange-500 flex-shrink-0" />
          <span className="truncate max-w-[180px]">
            {order.materials && order.materials.length > 0
              ? order.materials.map(m => `${m.type} (${m.color})`).join(', ')
              : `${order.material || 'PLA'} • ${order.color || 'Mặc định'}`}
          </span>
          <span className="opacity-40">•</span>
          <span className="font-semibold">SL: {order.quantity}</span>
        </div>
      </div>

      {/* Bottom: Customer + Price */}
      <div className="flex items-center justify-between pt-2.5 border-t border-black/5 dark:border-white/10 mt-auto">
        <div className="text-xs truncate pr-2">
          <span className="opacity-60 block text-[10px]">Khách hàng</span>
          <span className="font-medium truncate block">{order.customerName}</span>
        </div>
        <div className="font-black text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500 flex-shrink-0">
          {formatCurrency(order.price)}
        </div>
      </div>
    </Card>
  );
};
