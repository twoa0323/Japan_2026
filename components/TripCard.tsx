
import React from 'react';
import { Navigation, Clock, ChevronRight, Star } from 'lucide-react';
import { TravelActivity } from '../types';

interface TripCardProps {
  activity: TravelActivity;
  onClick?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ activity, onClick }) => {
  // Check if it's a special experience for alternative styling
  const isSpecial = activity.isSpecial;

  return (
    <div 
      onClick={onClick}
      className={`mx-4 mb-4 rounded-[28px] overflow-hidden flex shadow-mag cursor-pointer transition-all active:scale-[0.98]
        ${isSpecial ? 'bg-gradient-to-br from-white to-[#FFFBF0] border border-gold/20' : 'bg-white border border-sumi/[0.03]'}
      `}
    >
      {/* Column 1: Status/GPS Indicator */}
      <div className="w-16 flex flex-col items-center justify-center border-r border-sumi/[0.05] bg-gray-50/40">
        <Navigation className={`w-5 h-5 rotate-45 mb-1 ${isSpecial ? 'text-gold/40' : 'text-sumi/15'}`} />
        <span className="text-[9px] font-bold text-sumi/15 tracking-tighter leading-none">GPS</span>
        <span className="text-[9px] font-bold text-sumi/15 tracking-tighter leading-none">OFF</span>
      </div>

      {/* Column 2: Core Information */}
      <div className="flex-1 p-5 pr-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-serif font-medium text-sumi/90 leading-none tracking-tight">
            {activity.time}
          </span>
          <span className={`px-2 py-0.5 border rounded text-[9px] font-bold tracking-widest uppercase
            ${isSpecial ? 'text-gold border-gold/20' : 'text-sumi/30 border-sumi/10'}
          `}>
            {isSpecial ? '★ HIGHLIGHT' : '行程預覽'}
          </span>
        </div>
        
        <h4 className="text-lg font-serif font-bold text-sumi/80 mb-1.5 leading-tight">
          {activity.location}
        </h4>
        
        <p className="text-[11px] font-sans text-sumi/40 leading-relaxed line-clamp-2">
          {activity.description}
        </p>
      </div>

      {/* Column 3: Timing/Next Event */}
      <div className="w-20 bg-gray-50/50 flex flex-col items-center justify-center border-l border-sumi/[0.05]">
        <Clock className="w-4 h-4 text-sumi/15 mb-2" />
        <span className="text-base font-serif font-bold text-sumi/50 leading-none mb-1">13:45</span>
        <span className="text-[8px] text-sumi/20 font-bold uppercase tracking-tighter">下個時間</span>
      </div>
    </div>
  );
};

export default TripCard;
