
import React, { useState, useEffect } from 'react';
import { TRIP_DATA, WEATHER_FORECAST, INITIAL_LEDGER_DATA } from './constants';
import TripCard from './components/TripCard';
import WeatherSlider from './components/WeatherSlider';
import ActivityDetail from './components/ActivityDetail';
import { 
  X, Search, Info, DollarSign, MapPin, 
  CreditCard, Calendar, Navigation, 
  Map as MapIcon, ChevronRight, Phone, 
  ExternalLink, Download, Clock, ArrowLeft,
  RotateCcw, Plane, Building2, Utensils, ShoppingBag, Plus, Trash2, Edit3
} from 'lucide-react';
import { TabType, TravelActivity, LedgerItem } from './types';

const JPY_RATE = 4.545; // 1 TWD = 4.545 JPY (approx 0.22)

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [selectedActivity, setSelectedActivity] = useState<TravelActivity | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  
  // Ledger State
  const [ledgerItems, setLedgerItems] = useState<LedgerItem[]>(INITIAL_LEDGER_DATA);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LedgerItem | null>(null);
  const [ledgerForm, setLedgerForm] = useState({ name: '', amount: '', category: 'Other' as any });

  const currentDay = TRIP_DATA[activeDayIdx];

  const getCityImage = (city: string) => {
    if (city.includes('京都') || city.includes('嵐山') || city.includes('宇治')) {
      return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop";
    }
    if (city.includes('大阪') || city.includes('難波')) {
      return "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=2070&auto=format&fit=crop";
    }
    if (city.includes('USJ')) {
      return "https://images.unsplash.com/photo-1505991823317-0d4f1995ff3c?q=80&w=2070&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=2070&auto=format&fit=crop";
  };

  const handleOpenLedgerModal = (item?: LedgerItem) => {
    if (item) {
      setEditingItem(item);
      setLedgerForm({ name: item.name, amount: item.amount.toString(), category: item.category || 'Other' });
    } else {
      setEditingItem(null);
      setLedgerForm({ name: '', amount: '', category: 'Other' });
    }
    setIsLedgerModalOpen(true);
  };

  const handleSaveLedgerItem = () => {
    if (!ledgerForm.name || !ledgerForm.amount) return;
    const amountNum = parseFloat(ledgerForm.amount);
    
    if (editingItem) {
      setLedgerItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, name: ledgerForm.name, amount: amountNum, category: ledgerForm.category } : item));
    } else {
      // Fix: Removed 'payer' property as it is not defined in the LedgerItem interface in types.ts
      const newItem: LedgerItem = {
        id: Date.now().toString(),
        name: ledgerForm.name,
        amount: amountNum,
        paid: true,
        category: ledgerForm.category
      };
      setLedgerItems(prev => [...prev, newItem]);
    }
    setIsLedgerModalOpen(false);
  };

  const handleDeleteLedgerItem = (id: string) => {
    setLedgerItems(prev => prev.filter(item => item.id !== id));
    setIsLedgerModalOpen(false);
  };

  const renderHeaderNavigation = () => (
    <div className="flex items-center gap-5">
      <button 
        onClick={() => setActiveTab('ledger')}
        className={`flex items-center gap-1.5 transition-all ${activeTab === 'ledger' ? 'text-accent' : 'text-sumi/30 hover:text-sumi/60'}`}
      >
        <DollarSign className="w-3.5 h-3.5" />
        <span className="text-[10px] font-serif font-bold tracking-widest uppercase">Ledger</span>
      </button>
      <button 
        onClick={() => setActiveTab('info')}
        className={`flex items-center gap-1.5 transition-all ${activeTab === 'info' ? 'text-accent' : 'text-sumi/30 hover:text-sumi/60'}`}
      >
        <Info className="w-3.5 h-3.5" />
        <span className="text-[10px] font-serif font-bold tracking-widest uppercase">Info</span>
      </button>
    </div>
  );

  const renderItinerary = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="pt-12 pb-4 px-6 text-center">
        <p className="text-[10px] tracking-[0.4em] text-sumi/30 font-bold uppercase mb-2">Travel Journal</p>
        <div className="flex items-center justify-center gap-4 mb-2">
          <h1 className="text-3xl font-serif font-black tracking-widest text-sumi uppercase">Kansai</h1>
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <h1 className="text-3xl font-serif font-black tracking-widest text-sumi">2026</h1>
        </div>
        <div className="flex justify-between items-center mt-4 mb-2">
          <p className="text-[9px] text-sumi/20 tracking-[0.2em] font-sans uppercase">APR 25 - MAY 02 • KYOTO & OSAKA</p>
          {renderHeaderNavigation()}
        </div>
      </header>

      <div className="sticky top-0 z-[80] bg-washi/95 backdrop-blur-md border-b border-sumi/[0.03] shadow-sm">
        <div className="flex gap-4 px-8 py-5 overflow-x-auto hide-scrollbar">
          {TRIP_DATA.map((d, i) => (
            <button 
              key={i} 
              onClick={() => setActiveDayIdx(i)}
              className="flex flex-col items-center min-w-[44px] focus:outline-none transition-transform active:scale-95"
            >
              <span className={`text-[10px] font-bold tracking-widest mb-1.5 transition-colors duration-500 ${i === activeDayIdx ? 'text-sumi' : 'text-sumi/15'}`}>
                {d.dayOfWeek}
              </span>
              <span className={`text-2xl font-serif leading-none transition-all duration-500 ${i === activeDayIdx ? 'text-sumi' : 'text-sumi/15 hover:text-sumi/30'}`}>
                {d.date}
              </span>
              {i === activeDayIdx && <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5" />}
            </button>
          ))}
        </div>
      </div>

      <section className="px-6 mt-8 mb-12 relative">
        <div className="relative rounded-[16px] overflow-hidden aspect-[1.4/1] shadow-2xl">
          <img src={getCityImage(currentDay.city)} className="w-full h-full object-cover" alt="Main" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
          <div className="absolute bottom-6 left-6 text-white w-full pr-12 text-left">
            <div className="flex items-center gap-3 mb-3">
               <span className="px-2.5 py-1 border border-white/40 rounded-sm text-[10px] tracking-widest font-sans backdrop-blur-md">Day {activeDayIdx + 1}</span>
               <div className="flex items-center gap-1.5 text-white/70">
                 <MapPin className="w-3 h-3" />
                 <span className="text-[11px] font-serif tracking-widest uppercase">{currentDay.city}</span>
               </div>
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-wide">{currentDay.title}</h2>
          </div>
        </div>
      </section>

      <WeatherSlider location={currentDay.city} data={WEATHER_FORECAST} />

      <section className="pb-12 space-y-2">
        {currentDay.activities.map((activity) => (
          <TripCard key={activity.id} activity={activity} onClick={() => setSelectedActivity(activity)} />
        ))}
      </section>
    </div>
  );

  const getCategoryIcon = (cat?: string) => {
    const cls = "w-4 h-4 text-sumi/20";
    switch(cat) {
      case 'Flight': return <Plane className={cls} />;
      case 'Hotel': return <Building2 className={cls} />;
      case 'Food': return <Utensils className={cls} />;
      case 'Shopping': return <ShoppingBag className={cls} />;
      default: return <Edit3 className={cls} />;
    }
  };

  const renderLedger = () => {
    const totalTWD = ledgerItems.reduce((acc, item) => acc + item.amount, 0);
    const totalJPY = Math.floor(totalTWD * JPY_RATE);
    const avgTWD = Math.floor(totalTWD / 5);

    return (
      <div className="px-8 pt-12 pb-32 min-h-screen animate-in fade-in duration-500 bg-washi relative">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className="flex items-center gap-2 text-sumi/40 mb-10 hover:text-sumi transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-serif font-bold tracking-widest uppercase">返回行程</span>
        </button>

        <div className="flex justify-between items-start mb-8">
          <div>
             <div className="flex items-center gap-3 mb-1">
               <Edit3 className="w-6 h-6 text-sumi" />
               <h2 className="text-3xl font-serif font-black text-sumi tracking-tight">旅行帳本</h2>
               <div className="flex items-center gap-1 px-2 py-0.5 bg-[#E8F1E5] rounded-full">
                 <span className="text-[9px] text-[#4A6741] font-bold">Online</span>
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] text-sumi/20 font-medium">
               <RotateCcw className="w-2.5 h-2.5" />
               <span>雲端同步中...</span>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-sumi/20 font-bold tracking-widest uppercase">全部顯示</p>
             <p className="text-[10px] text-sumi/15 uppercase font-sans">{ledgerItems.length} 筆項目</p>
          </div>
        </div>

        {/* Filters Removed as per request (K, M, E, G, J removed) */}
        <div className="flex gap-2 mb-10">
          <button className="px-5 py-2 bg-sumi text-white rounded-md text-[11px] font-bold">全部</button>
        </div>

        {/* Summary Card - Inspired by screenshot */}
        <div className="p-10 bg-white rounded-[16px] border border-sumi/5 shadow-sm mb-12 text-left">
           <p className="text-xs text-sumi/30 mb-2 font-serif font-bold tracking-widest uppercase">總金額 (台幣)</p>
           <div className="flex items-baseline gap-3 mb-2">
             <h3 className="text-5xl font-serif font-black text-sumi">
               ${totalTWD.toLocaleString()}
             </h3>
           </div>
           <div className="flex items-center gap-3 text-sumi/40 font-serif">
             <span className="text-sm">每人均攤: <span className="font-bold text-sumi/70">${avgTWD.toLocaleString()}</span></span>
             <div className="w-[1px] h-3 bg-sumi/10" />
             <span className="text-sm">約 ¥{totalJPY.toLocaleString()}</span>
           </div>
        </div>

        {/* List */}
        <div className="divide-y divide-sumi/[0.04]">
          {ledgerItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleOpenLedgerModal(item)}
              className="flex justify-between items-center py-6 cursor-pointer group active:bg-sumi/[0.02] transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full bg-sumi/[0.02] flex items-center justify-center">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-[15px] font-serif font-bold text-sumi/80 leading-tight group-hover:text-sumi transition-colors">{item.name}</h4>
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full bg-[#DDE4F0] border border-white flex items-center justify-center text-[8px] font-bold text-[#566D91]">K</div>
                     <span className={`text-[9px] font-bold tracking-widest ${item.paid ? 'text-sumi/20' : 'text-accent'}`}>
                        {item.paid ? '已付' : '未付'}
                     </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-serif font-black text-sumi/80">${item.amount.toLocaleString()}</p>
                <p className="text-[10px] font-serif text-sumi/20 italic">¥{(Math.floor(item.amount * JPY_RATE)).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Floating Add Button */}
        <button 
          onClick={() => handleOpenLedgerModal()}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] py-5 bg-sumi text-white rounded-[12px] font-serif text-lg tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all z-[90]"
        >
          <span className="text-2xl font-light">+</span>
          <span>記一筆</span>
        </button>

        {/* Ledger Modal */}
        {isLedgerModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in">
            <div className="bg-washi w-full max-w-md h-[70vh] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex justify-between items-center px-8 py-6 border-b border-sumi/5">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-sumi/20" />
                  <h3 className="text-lg font-serif font-bold text-sumi">{editingItem ? '編輯款項' : '新增款項'}</h3>
                </div>
                <button onClick={() => setIsLedgerModalOpen(false)} className="p-2 hover:bg-sumi/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-sumi/40" />
                </button>
              </div>
              
              <div className="flex-1 p-8 space-y-8 overflow-y-auto hide-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sumi/30 block">項目名稱 (例如：超商零食)</label>
                  <input 
                    type="text" 
                    value={ledgerForm.name}
                    onChange={(e) => setLedgerForm({...ledgerForm, name: e.target.value})}
                    className="w-full text-2xl font-serif bg-transparent border-b-2 border-sumi/10 py-3 focus:outline-none focus:border-sumi transition-colors placeholder:text-sumi/10"
                    placeholder="輸入名稱..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sumi/30 block">金額 (TWD)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={ledgerForm.amount}
                      onChange={(e) => setLedgerForm({...ledgerForm, amount: e.target.value})}
                      className="w-full text-4xl font-serif font-black bg-transparent border-b-2 border-sumi/10 py-3 focus:outline-none focus:border-sumi transition-colors placeholder:text-sumi/10"
                      placeholder="0"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-sumi/[0.03] border border-sumi/10 rounded-md text-xs font-serif text-sumi/40 uppercase tracking-widest">
                      JPY
                    </div>
                  </div>
                  <p className="text-[10px] font-serif italic text-sumi/20">匯率試算: 0.22 (1 TWD ≈ 4.54 JPY)</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sumi/30 block">分類</label>
                  <div className="flex flex-wrap gap-2">
                    {['Hotel', 'Flight', 'Food', 'Shopping', 'Transport', 'Other'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setLedgerForm({...ledgerForm, category: cat as any})}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all ${ledgerForm.category === cat ? 'bg-sumi text-white border-sumi' : 'bg-white text-sumi/30 border-sumi/10 hover:border-sumi/30'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  {editingItem && (
                    <button 
                      onClick={() => handleDeleteLedgerItem(editingItem.id)}
                      className="flex-1 py-4 border border-accent/20 text-accent rounded-xl flex items-center justify-center gap-2 hover:bg-accent/5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-serif text-lg">刪除</span>
                    </button>
                  )}
                  <button 
                    onClick={handleSaveLedgerItem}
                    className="flex-[2] py-4 bg-sumi text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 active:scale-95 transition-transform"
                  >
                    <span className="font-serif text-lg">{editingItem ? '確認修改' : '確認新增'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInfo = () => (
    <div className="px-8 pt-12 pb-24 animate-in fade-in">
       <button onClick={() => setActiveTab('itinerary')} className="flex items-center gap-2 text-sumi/40 mb-10"><ArrowLeft className="w-4 h-4" /><span className="text-xs font-serif font-bold uppercase">返回行程</span></button>
       <header className="text-center mb-12">
         <Info className="w-16 h-16 text-sumi/10 mx-auto mb-6" />
         <h2 className="text-2xl font-serif font-bold text-sumi/40 uppercase tracking-[0.3em]">旅行手帖</h2>
       </header>
       <div className="space-y-6 text-left">
         <div className="p-6 bg-white rounded-2xl border border-sumi/5 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-sumi mb-2 uppercase tracking-widest">Hotel (Kyoto)</h3>
            <p className="text-sm text-sumi/60">東橫INN 京都四條烏丸</p>
         </div>
         <div className="p-6 bg-white rounded-2xl border border-sumi/5 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-sumi mb-2 uppercase tracking-widest">Hotel (Osaka)</h3>
            <p className="text-sm text-sumi/60">東橫INN 大阪難波</p>
         </div>
         <div className="p-6 bg-accent rounded-2xl text-white shadow-lg">
            <h3 className="text-lg font-serif font-bold mb-2 uppercase tracking-widest">USJ Check</h3>
            <p className="text-sm">門票與快速通關 Express Pass 是否已存檔？</p>
         </div>
       </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-washi font-sans shadow-2xl relative overflow-x-hidden selection:bg-accent/10 flex flex-col">
      <div className="flex-1">
        {activeTab === 'itinerary' && renderItinerary()}
        {activeTab === 'ledger' && renderLedger()}
        {activeTab === 'info' && renderInfo()}
      </div>
      {selectedActivity && <ActivityDetail activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
    </div>
  );
};

export default App;
