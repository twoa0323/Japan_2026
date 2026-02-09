
import React from 'react';
import { X, MapPin, Phone, Globe, Youtube, Navigation, Clock, Copy, ChevronRight, Info } from 'lucide-react';
import { TravelActivity } from '../types';

interface ActivityDetailProps {
  activity: TravelActivity;
  onClose: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center">
      <div className="bg-washi w-full max-w-md h-[92vh] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-sumi/5">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 border border-accent/20 rounded-md text-[10px] text-accent font-bold tracking-widest uppercase">
               {activity.category}
             </span>
             <div className="flex items-center gap-1.5 text-sumi/40">
               <Clock className="w-3.5 h-3.5" />
               <span className="text-sm font-serif font-bold">{activity.time}</span>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-sumi/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-sumi/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 hide-scrollbar">
          {/* Title Area */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-sumi leading-tight mb-4">
              {activity.location}
            </h2>
            {activity.address && (
              <div className="flex items-center gap-2 text-sumi/40 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[11px] font-sans border-b border-sumi/10 pb-0.5">{activity.address}</span>
              </div>
            )}
          </div>

          {/* Point & Speak / Menu Section */}
          {activity.menu && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sumi/20">
                <span className="text-[10px] font-serif tracking-[0.3em]">文</span>
                <span className="text-[10px] font-sans tracking-wider uppercase">指差し会話 (POINT & SPEAK)</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {activity.menu.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white rounded-xl border border-sumi/5 shadow-sm">
                    <span className="text-sm font-serif text-sumi/80">{item.name}</span>
                    <span className="text-sm font-serif text-sumi/40">{item.translation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservation / Order Code */}
          {activity.reservationCode && (
            <div className="p-6 bg-white rounded-2xl border border-dashed border-sumi/10 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Copy className="w-12 h-12" />
               </div>
               <p className="text-[10px] uppercase tracking-[0.2em] text-sumi/30 mb-2">Reservation / Confirmation No.</p>
               <h3 className="text-2xl font-sans font-bold text-sumi tracking-wider mb-2">{activity.reservationCode}</h3>
               <button className="text-[10px] flex items-center gap-1 mx-auto text-sumi/40 hover:text-sumi transition-colors">
                 <span>訂單代號 給櫃檯看的</span>
                 <Copy className="w-3 h-3" />
               </button>
            </div>
          )}

          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sumi/20">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] font-sans tracking-wider uppercase">關於此處 (ABOUT)</span>
            </div>

            {activity.phone && (
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-sumi/5">
                <div className="p-3 bg-sumi/[0.02] rounded-lg">
                  <Navigation className="w-5 h-5 text-sumi/20 rotate-45" />
                </div>
                <div>
                  <p className="text-[9px] text-sumi/30 uppercase tracking-wider mb-0.5">Car GPS Phone</p>
                  <p className="text-lg font-sans font-bold text-sumi">{activity.phone}</p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {activity.details?.map((detail, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-[1.5px] h-3 bg-accent/30" />
                  {detail.title && (
                    <h5 className="text-[13px] font-bold text-sumi/80 mb-2 font-serif">【{detail.title}】</h5>
                  )}
                  <p className="text-sm font-sans leading-loose text-sumi/60 text-justify">
                    {detail.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="space-y-3 pt-4 pb-12">
            <button className="w-full py-4 bg-[#4A6741] text-white rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-[#4A6741]/20 hover:scale-[1.02] transition-transform">
              <Navigation className="w-5 h-5 rotate-45" />
              <span className="font-serif text-lg">Google Maps 導航</span>
            </button>
            <button className="w-full py-4 bg-[#1C1C1C] text-white rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-black/10 hover:scale-[1.02] transition-transform">
              <Globe className="w-4 h-4" />
              <span className="font-serif text-lg">官方網站</span>
            </button>
            <button className="w-full py-2 flex items-center justify-center gap-2 text-sumi/30 hover:text-sumi transition-colors">
              <Youtube className="w-4 h-4" />
              <span className="text-[10px] tracking-widest uppercase">Search Vlogs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
