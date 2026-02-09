
import React, { useState } from 'react';
import { TRIP_DATA, WEATHER_FORECAST, INITIAL_LEDGER_DATA } from './constants';
import TripCard from './components/TripCard';
import WeatherSlider from './components/WeatherSlider';
import ActivityDetail from './components/ActivityDetail';
import { 
  X, Info, DollarSign, MapPin, 
  CreditCard, Navigation, 
  Map as MapIcon, ChevronRight, Phone, 
  Clock, ArrowLeft,
  RotateCcw, Plane, Building2, Utensils, ShoppingBag, Trash2, Edit3, Plus
} from 'lucide-react';
import { TabType, TravelActivity, LedgerItem } from './types';

// Rate from screenshot: 0.22 TWD = 1 JPY, so 1 TWD = 1 / 0.22
const TWD_TO_JPY = 4.54545;

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
        className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === 'ledger' ? 'text-accent' : 'text-sumi/30 hover:text-sumi/60'}`}
      >
        <Edit3 className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-serif font-bold tracking-widest uppercase">帳本</span>
        {activeTab === 'ledger' && <div className="w-1 h-1 bg-accent rounded-full mt-0.5" />}
      </button>
      <button 
        onClick={() => setActiveTab('info')}
        className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === 'info' ? 'text-accent' : 'text-sumi/30 hover:text-sumi/60'}`}
      >
        <Info className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-serif font-bold tracking-widest uppercase">訊</span>
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
        <div className="flex justify-between items-center mt-6 mb-2">
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
            <h2 className="text-3xl font-serif font-bold tracking-wide leading-relaxed">{currentDay.title}</h2>
          </div>
        </div>
      </section>

      <WeatherSlider location={currentDay.city} data={WEATHER_FORECAST} />

      <section className="pb-24 space-y-2">
        {currentDay.activities.map((activity) => (
          <TripCard key={activity.id} activity={activity} onClick={() => setSelectedActivity(activity)} />
        ))}
      </section>
    </div>
  );

  const getCategoryIcon = (cat?: string) => {
    const cls = "w-5 h-5 text-sumi/30";
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
    const totalJPY = Math.floor(totalTWD * TWD_TO_JPY);
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
          <div className="text-left">
             <div className="flex items-center gap-3 mb-1">
               <Edit3 className="w-7 h-7 text-sumi" />
               <h2 className="text-3xl font-serif font-black text-sumi tracking-tight">旅行帳本</h2>
               <div className="flex items-center gap-1 px-3 py-0.5 bg-[#EAF2E9] rounded-full">
                 <span className="text-[9px] text-[#4A6741] font-bold uppercase tracking-wider">Online</span>
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] text-sumi/30 font-medium">
               <RotateCcw className="w-3 h-3 animate-spin duration-[4000ms]" />
               <span>雲端同步中...</span>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-sumi/30 font-bold tracking-[0.2em] uppercase mb-1">全部顯示</p>
             <p className="text-[10px] text-sumi/20 uppercase font-sans">{ledgerItems.length} 筆項目</p>
          </div>
        </div>

        {/* Total Summary Card */}
        <div className="p-10 bg-white rounded-[16px] border border-sumi/5 shadow-mag mb-12 text-left">
           <p className="text-xs text-sumi/30 mb-2 font-serif font-bold tracking-[0.1em] uppercase">總金額 (台幣)</p>
           <h3 className="text-5xl font-serif font-black text-sumi mb-3">
             ${totalTWD.toLocaleString()}
           </h3>
           <div className="flex flex-col gap-1 text-sumi/40 font-serif">
             <p className="text-sm">每人均攤: <span className="font-black text-sumi/70">${avgTWD.toLocaleString()}</span></p>
             <p className="text-[10px] text-sumi/20 mt-1 uppercase tracking-wider italic">Approx ¥{totalJPY.toLocaleString()}</p>
           </div>
        </div>

        {/* List of Transactions */}
        <div className="divide-y divide-sumi/[0.04] border-t border-sumi/[0.04]">
          {ledgerItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleOpenLedgerModal(item)}
              className="flex justify-between items-center py-7 cursor-pointer group hover:bg-sumi/[0.01] transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-sumi/[0.03] flex items-center justify-center border border-sumi/[0.02]">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="space-y-1.5 text-left">
                  <h4 className="text-[16px] font-serif font-black text-sumi/80 leading-tight group-hover:text-sumi transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full bg-[#DDE4F0] border border-white flex items-center justify-center text-[8px] font-bold text-[#566D91]">K</div>
                     <span className={`text-[9px] font-bold tracking-widest uppercase ${item.paid ? 'text-sumi/20' : 'text-accent'}`}>
                        {item.paid ? '已付' : '未付'}
                     </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-serif font-black text-sumi/80">${item.amount.toLocaleString()}</p>
                <p className="text-[10px] font-serif text-sumi/20 italic">¥{(Math.floor(item.amount * TWD_TO_JPY)).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Fixed Floating Add Button */}
        <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center pointer-events-none z-[90]">
          <button 
            onClick={() => handleOpenLedgerModal()}
            className="w-full max-w-sm py-5 bg-sumi text-white rounded-[12px] font-serif text-lg tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all pointer-events-auto"
          >
            <Plus className="w-5 h-5" />
            <span>記一筆</span>
          </button>
        </div>

        {/* Editor Modal */}
        {isLedgerModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
            <div className="bg-washi w-full max-w-md h-[75vh] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex justify-between items-center px-8 py-7 border-b border-sumi/5">
                <div className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-sumi/20" />
                  <h3 className="text-xl font-serif font-bold text-sumi">{editingItem ? '編輯帳目' : '新增款項'}</h3>
                </div>
                <button onClick={() => setIsLedgerModalOpen(false)} className="p-2 hover:bg-sumi/5 rounded-full transition-colors">
                  <X className="w-7 h-7 text-sumi/40" />
                </button>
              </div>
              
              <div className="flex-1 p-8 space-y-10 overflow-y-auto hide-scrollbar">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-sumi/40 block">項目名稱 (例如：超商零食)</label>
                  <input 
                    type="text" 
                    value={ledgerForm.name}
                    onChange={(e) => setLedgerForm({...ledgerForm, name: e.target.value})}
                    className="w-full text-2xl font-serif bg-transparent border-b-2 border-sumi/10 py-3 focus:outline-none focus:border-sumi transition-colors placeholder:text-sumi/10"
                    placeholder="輸入名稱..."
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-sumi/40 block">金額 (TWD)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={ledgerForm.amount}
                      onChange={(e) => setLedgerForm({...ledgerForm, amount: e.target.value})}
                      className="w-full text-5xl font-serif font-black bg-transparent border-b-2 border-sumi/10 py-3 focus:outline-none focus:border-sumi transition-colors placeholder:text-sumi/10"
                      placeholder="0"
                    />
                    <div className="absolute right-0 bottom-4 px-3 py-1 bg-sumi/[0.03] border border-sumi/10 rounded text-xs font-serif text-sumi/40 uppercase tracking-widest">
                      TWD
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-[10px] font-serif italic text-sumi/30">預估匯率: 0.22 (1 TWD ≈ 4.54 JPY)</p>
                    {ledgerForm.amount && (
                      <p className="text-xs font-serif font-bold text-sumi/40">約 ¥{(Math.floor(parseFloat(ledgerForm.amount) * TWD_TO_JPY)).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-sumi/40 block">分類 (CATEGORY)</label>
                  <div className="flex flex-wrap gap-3">
                    {['Hotel', 'Flight', 'Food', 'Shopping', 'Transport', 'Other'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setLedgerForm({...ledgerForm, category: cat as any})}
                        className={`px-6 py-2.5 rounded-full text-[11px] font-bold border transition-all ${ledgerForm.category === cat ? 'bg-sumi text-white border-sumi shadow-lg' : 'bg-white text-sumi/40 border-sumi/10 hover:border-sumi/30'}`}
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
                      className="flex-1 py-5 border-2 border-accent/20 text-accent rounded-xl flex items-center justify-center gap-2 hover:bg-accent/5 transition-colors group"
                    >
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-serif font-bold">刪除項目</span>
                    </button>
                  )}
                  <button 
                    onClick={handleSaveLedgerItem}
                    className="flex-[2] py-5 bg-sumi text-white rounded-xl flex items-center justify-center shadow-2xl hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span className="font-serif text-lg tracking-widest">{editingItem ? '確認修改' : '確認新增'}</span>
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
    <div className="px-8 pt-12 pb-24 animate-in fade-in bg-washi min-h-screen">
       <button onClick={() => setActiveTab('itinerary')} className="flex items-center gap-2 text-sumi/40 mb-10"><ArrowLeft className="w-4 h-4" /><span className="text-xs font-serif font-bold uppercase tracking-widest">返回行程</span></button>
       <header className="text-center mb-16">
         <Info className="w-16 h-16 text-sumi/5 mx-auto mb-6" />
         <h2 className="text-3xl font-serif font-black text-sumi/80 uppercase tracking-[0.4em]">旅行手帖</h2>
       </header>
       <div className="space-y-8 text-left">
         <div className="p-8 bg-white rounded-2xl border border-sumi/5 shadow-mag">
            <h3 className="text-sm font-serif font-black text-sumi/30 mb-4 uppercase tracking-[0.2em]">住宿資訊 / KYOTO</h3>
            <p className="text-xl font-serif font-bold text-sumi mb-1">東橫INN 京都四條烏丸</p>
            <p className="text-xs text-sumi/50 leading-relaxed">靠近地鐵與阪急電鐵交會處，交通便利。</p>
         </div>
         <div className="p-8 bg-white rounded-2xl border border-sumi/5 shadow-mag">
            <h3 className="text-sm font-serif font-black text-sumi/30 mb-4 uppercase tracking-[0.2em]">住宿資訊 / OSAKA</h3>
            <p className="text-xl font-serif font-bold text-sumi mb-1">東橫INN 大阪難波</p>
            <p className="text-xs text-sumi/50 leading-relaxed">鄰近道頓堀商圈與南海電鐵，方便前往機場。</p>
         </div>
         <div className="p-8 bg-accent rounded-2xl text-white shadow-2xl shadow-accent/20">
            <h3 className="text-sm font-serif font-bold mb-4 uppercase tracking-[0.2em]">USJ CHECKLIST</h3>
            <p className="text-lg font-serif font-medium leading-relaxed">門票與快速通關 Express Pass 是否已存檔於手機錢包？</p>
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
