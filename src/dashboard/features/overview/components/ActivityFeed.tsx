import type { ActivityType } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { Bell, Clock, CreditCard, Star, User } from 'lucide-react';
import type { FC } from 'react';
import { useActivityStore } from '../store/activityStore';

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'PAYMENT':
      return <CreditCard size={16} className="text-teal-muted" />;
    case 'ORDER':
      return <Bell size={16} className="text-deep-orange" />;
    case 'RATING':
      return <Star size={16} className="text-[#FFC107]" />;
    case 'SYSTEM':
      return <User size={16} className="text-slate-dark/50" />;
    default:
      return <Clock size={16} className="text-slate-dark/50" />;
  }
};

const getActivityBg = (type: ActivityType) => {
  switch (type) {
    case 'PAYMENT':
      return 'bg-teal-muted/10';
    case 'ORDER':
      return 'bg-deep-orange/10';
    case 'RATING':
      return 'bg-[#FFC107]/10';
    case 'SYSTEM':
      return 'bg-slate-dark/5';
    default:
      return 'bg-slate-dark/5';
  }
};

export const ActivityFeed: FC = () => {
  const activities = useActivityStore((state) => state.activities);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 flex flex-col h-full min-h-[400px]">
      <h3 className="text-[16px] font-serif font-semibold text-slate-dark mb-6">
        Aktivitas Terkini
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-dark/40 text-[14px] text-center px-4">
            <Clock size={32} className="mb-3 opacity-20" />
            <p>Belum ada aktivitas baru.</p>
            <p className="text-[12px] mt-1">Aktivitas akan muncul secara real-time di sini.</p>
          </div>
        ) : (
          activities.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Icon Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  getActivityBg(item.type),
                )}
              >
                {getActivityIcon(item.type)}
              </div>

              {/* Content */}
              <div className="flex-1 pb-1">
                <h4 className="text-[14px] font-semibold text-slate-dark leading-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-[13px] text-slate-dark/70 mb-1 leading-snug">
                  {item.description}
                </p>
                <span className="text-[11px] text-slate-dark/40 font-medium">{item.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
