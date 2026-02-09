
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  X, Info, DollarSign, MapPin, 
  ChevronRight, Phone, 
  Clock, ArrowLeft,
  RotateCcw, Plane, Building2, Utensils, ShoppingBag, Trash2, Edit3, Plus, Globe, Navigation, Youtube, Copy
} from 'lucide-react';

// --- Types ---
type TabType = 'itinerary' | 'ledger' | 'info';

interface ActivityDetailItem {
  title?: string;
  content: string;
}

interface TravelActivity {
  id: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  category: string;
  details?: ActivityDetailItem[];
  address?: string;
  phone?: string;
  menu?: { name: string; translation: string }[];
  reservationCode?: string;
  isSpecial?: boolean;
}

interface LedgerItem {
  id: string;
  name: string;
  amount: number; // in TWD
  paid: boolean;
  category: 'Flight' | 'Hotel' | 'Food' | 'Transport' | 'Shopping' | 'Other';
}

interface DayPlan {
  date: string;
  dayOfWeek: string;
  city: string;
  title: string;
  activities: TravelActivity[];
}

// --- Constants & Data ---
const TWD_TO_JPY = 4.54545; // Approx 1 TWD = 4.54 JPY (Rate 0.22)

const TRIP_DATA: DayPlan[] = [
  {
    date: '17', dayOfWeek: 'TUE', city: '九州', title: '旅の始まり・福岡',
    activities: [
      { id: '1', time: '08:30', location: '桃園國際機場 (TPE)', category: 'Flight', description: '搭乘星宇航空前往福岡 KIX。', isSpecial: true },
      { id: '2', time: '13:00', location: '福岡空港 (FUK)', category: 'Transport', description: '抵達福岡，領取租車前往市區。' },
      { id: '3', time: '18:00', location: '中洲屋台街', category: 'Food', description: '體驗福岡道地的屋台文化，享用博多拉麵。' }
    ]
  },
  {
    date: '18', dayOfWeek: 'WED', city: '熊本', title: '阿蘇の自然と熊本城',
    activities: [
      { id: '4', time: '09:00', location: '熊本城', category: 'Culture', description: '參觀日本三大名城之一，感受歷史震撼。' },
      { id: '5', time: '14:00', location: '阿蘇大觀峰', category: 'Sightseeing', description: '俯瞰巨大的阿蘇破火山口。', isSpecial: true }
    ]
  },
  { date: '19', dayOfWeek: 'THU', city: '黑川', title: '秘境の湯・黑川温泉', activities: [] },
  { date: '20', dayOfWeek: 'FRI', city: '由布院', title: '由布岳の麓・金鱗湖', activities: [] },
];

const INITIAL_LEDGER: LedgerItem[] = [
  { id: '1', name: '星宇航空機票', amount: 148100, paid: true, category: 'Flight' },
  { id: '2', name: 'The Blossom Kumamoto x1晚', amount: 15383, paid: true, category: 'Hotel' },
  { id: '3', name: '月洸樹 黑川 x1晚', amount: 81503, paid: true, category: 'Hotel' },
  { id: '4', name: '由布院 玉の湯 x1晚', amount: 55941, paid: false, category: 'Hotel' },
  { id: '5', name: 'Grand Hyatt Fukuoka x3晚', amount: 123105, paid: true, category: 'Hotel' },
];

// --- Sub-Components ---

const WeatherSlider = ({ location }: { location: string }) => (
  <div className="px-6 mb-12">
    <div className="mb-4">
      <h3 className="text-4xl font-serif text-sumi/10">{location}</h3>
      <div className="flex justify-between items-center -mt-2">
        <span className="text-[10px] tracking-[0.2em] text-sumi/30 font-bold uppercase">Open-Meteo Forecast</span>
      </div>
    </div>
    <div className="flex gap-8 overflow-x-auto hide-scrollbar py-2">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold text-sumi/20">{9 + i}:00</span>
          <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-accent rounded-full" />
          </div>
          <span className="text-lg font-serif text-sumi/40">{18 + i}°</span>
        </div>
      ))}
    </div>
  </div>
);

const TripCard = ({ activity, onClick }: { activity: TravelActivity, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="mx-6 mb-4 bg-white rounded-[24px] overflow-hidden flex shadow-mag border border-sumi/[0.02] cursor-pointer active:scale-[0.98] transition-all"
  >
    <div className="w-16 flex flex-col items-center justify-center bg-sumi/[0.01] border-r border-sumi/[0.03]">
      <span className="text-[9px] font-bold text-sumi/20 tracking-widest uppercase">GPS</span>
      <Navigation className="w-4 h-4 text-sumi/10 mt-1 rotate-45" />
    </div>
    <div className="flex-1 p-6 text-left">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl font-serif font-black text-sumi/80">{activity.time}</span>
        {activity.isSpecial && (
          <span className="px-2 py-0.5 border border-gold/20 text-gold text-[8px] font-bold tracking-widest uppercase rounded">Highlight</span>
        )}
      </div>
      <h4 className="text-lg font-serif font-bold text-sumi/70 mb-1">{activity.location}</h4>
      <p className="text-[11px] text-sumi/40 leading-relaxed line-clamp-2">{activity.description}</p>
    </div>
  </div>
);

const ActivityDetail = ({ activity, onClose }: { activity: TravelActivity, onClose: () => void }) => (
  <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-end justify-center">
    <div className="bg-washi w-full max-w-md h-[90vh] rounded-t-[32px] shadow-2xl overflow-hidden flex flex-col page-enter">
      <div className="flex justify-between items-center px-8 py-6 border-b border-sumi/5">
        <span className="text-[10px] font-bold tracking-widest text-accent uppercase">{activity.category}</span>
        <button onClick={onClose} className="p-2"><X className="w-6 h-6 text-sumi/30" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 text-left space-y-10">
        <h2 className="text-4xl font-serif font-black text-sumi leading-tight">{activity.location}</h2>
        <p className="text-sm text-sumi/60 leading-loose">{activity.description}</p>
        <div className="space-y-4 pt-10">
          <button className="w-full py-5 bg-sumi text-white rounded-xl flex items-center justify-center gap-3"><Navigation className="w-5 h-5 rotate-45" /><span className="font-serif text-lg">Google Maps</span></button>
          <button className="w-full py-5 border-2 border-sumi/5 text-sumi/60 rounded-xl flex items-center justify-center gap-3"><Globe className="w-5 h-5" /><span className="font-serif text-lg">官方網站</span></button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<TravelActivity | null>(null);

  // Ledger Logic
  const [ledgerItems, setLedgerItems] = useState<LedgerItem[]>(INITIAL_LEDGER);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LedgerItem | null>(null);
  const [ledgerForm, setLedgerForm] = useState({ name: '', amount: '', category: 'Other' as any });

  const currentDay = TRIP_DATA[activeDayIdx];

  const handleOpenLedger = (item?: LedgerItem) => {
    if (item) {
      setEditingItem(item);
      setLedgerForm({ name: item.name, amount: item.amount.toString(), category: item.category });
    } else {
      setEditingItem(null);
      setLedgerForm({ name: '', amount: '', category: 'Other' });
    }
    setIsLedgerModalOpen(true);
  };

  const saveLedgerItem = () => {
    if (!ledgerForm.name || !ledgerForm.amount) return;
    const amount = parseFloat(ledgerForm.amount);
    if (editingItem) {
      setLedgerItems(prev => prev.map(it => it.id === editingItem.id ? { ...it, name: ledgerForm.name, amount, category: ledgerForm.category } : it));
    } else {
      setLedgerItems(prev => [...prev, { id: Date.now().toString(), name: ledgerForm.name, amount, paid: true, category: ledgerForm.category }]);
    }
    setIsLedgerModalOpen(false);
  };

  const deleteLedgerItem = (id: string) => {
    setLedgerItems(prev => prev.filter(it => it.id !== id));
    setIsLedgerModalOpen(false);
  };

  const renderItinerary = () => (
    <div className="page-enter">
      <header className="pt-16 pb-6 px-8 text-center">
        <p className="text-[10px] tracking-[0.5em] text-sumi/20 font-bold uppercase mb-2">Travel Journal</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-serif font-black tracking-widest text-sumi uppercase">九州旅行</h1>
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <h1 className="text-4xl font-serif font-black tracking-widest text-sumi">2026</h1>
        </div>
        
        {/* Navigation positioned as requested */}
        <div className="flex justify-between items-end mt-8 border-b border-sumi/[0.03] pb-4">
          <p className="text-[10px] text-sumi/30 tracking-[0.2em] font-sans uppercase">FAMILY TRIP • KYUSHU</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('ledger')} className="flex flex-col items-center gap-1 group">
               <Edit3 className="w-5 h-5 text-sumi/20 group-hover:text-sumi/50 transition-colors" />
               <span className="text-[10px] font-serif font-bold text-sumi/40 group-hover:text-sumi">帳本</span>
            </button>
            <button onClick={() => setActiveTab('info')} className="flex flex-col items-center gap-1 group">
               <Info className="w-5 h-5 text-sumi/20 group-hover:text-sumi/50 transition-colors" />
               <span className="text-[10px] font-serif font-bold text-sumi/40 group-hover:text-sumi">訊</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Date Row */}
      <div className="sticky top-0 z-[100] bg-washi/95 backdrop-blur-md border-b border-sumi/[0.03] shadow-sm">
        <div className="flex gap-4 px-8 py-5 overflow-x-auto hide-scrollbar">
          {TRIP_DATA.map((d, i) => (
            <button 
              key={i} 
              onClick={() => setActiveDayIdx(i)}
              className={`flex flex-col items-center min-w-[50px] relative transition-all ${i === activeDayIdx ? 'scale-110' : 'opacity-30 hover:opacity-50'}`}
            >
              <span className="text-[9px] font-bold tracking-widest mb-1">{d.dayOfWeek}</span>
              <span className="text-2xl font-serif leading-none">{d.date}</span>
              {i === activeDayIdx && <div className="absolute -bottom-2 w-1 h-1 bg-accent rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8">
        <WeatherSlider location={currentDay.city} />
        
        <div className="px-8 mb-12">
          <div className="relative rounded-[24px] overflow-hidden aspect-[1.5/1] shadow-2xl">
            <img src="https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=2070" className="w-full h-full object-cover" alt="City" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
            <div className="absolute bottom-6 left-6 text-white text-left">
               <p className="text-[10px] tracking-widest font-bold uppercase opacity-60 mb-1">Day {activeDayIdx + 1} • {currentDay.city}</p>
               <h2 className="text-3xl font-serif font-bold tracking-wide leading-relaxed">{currentDay.title}</h2>
            </div>
          </div>
        </div>

        <section className="pb-32 space-y-2">
          {currentDay.activities.map(activity => (
            <TripCard key={activity.id} activity={activity} onClick={() => setSelectedActivity(activity)} />
          ))}
          {currentDay.activities.length === 0 && (
            <p className="py-20 text-sumi/20 font-serif italic text-lg">本站尚無行程規劃</p>
          )}
        </section>
      </div>
    </div>
  );

  const renderLedger = () => {
    const totalTWD = ledgerItems.reduce((acc, it) => acc + it.amount, 0);
    const totalJPY = Math.floor(totalTWD * TWD_TO_JPY);

    return (
      <div className="px-8 pt-16 pb-40 min-h-screen bg-washi page-enter">
        <button onClick={() => setActiveTab('itinerary')} className="flex items-center gap-2 text-sumi/30 mb-10 hover:text-sumi transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[11px] font-serif font-bold tracking-widest uppercase">返回行程</span>
        </button>

        <div className="flex justify-between items-start mb-12">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-1">
              <Edit3 className="w-7 h-7 text-sumi" />
              <h2 className="text-3xl font-serif font-black text-sumi tracking-tight">旅行帳本</h2>
              <div className="px-3 py-1 bg-[#EAF2E9] rounded-full text-[9px] text-[#4A6741] font-bold uppercase">Online</div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-sumi/20 font-medium">
              <RotateCcw className="w-3 h-3 animate-spin duration-[4000ms]" />
              <span>雲端同步中...</span>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-sumi/20 font-bold tracking-widest uppercase mb-1">全部顯示</p>
             <p className="text-[10px] text-sumi/15 font-sans">{ledgerItems.length} 筆項目</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-10 bg-white rounded-[20px] border border-sumi/5 shadow-ledger mb-12 text-left">
           <p className="text-xs text-sumi/30 mb-2 font-serif font-bold tracking-widest uppercase">總金額 (台幣)</p>
           <h3 className="text-5xl font-serif font-black text-sumi mb-3">${totalTWD.toLocaleString()}</h3>
           <div className="pt-4 border-t border-sumi/5 flex justify-between items-center">
             <span className="text-sm font-serif text-sumi/40">每人均攤: <span className="font-black text-sumi/70">${Math.floor(totalTWD/5).toLocaleString()}</span></span>
             <span className="text-[10px] font-serif text-sumi/20 italic uppercase tracking-wider">約 ¥{totalJPY.toLocaleString()}</span>
           </div>
        </div>

        {/* List */}
        <div className="divide-y divide-sumi/[0.04]">
          {ledgerItems.map(item => (
            <div key={item.id} onClick={() => handleOpenLedger(item)} className="flex justify-between items-center py-7 group cursor-pointer hover:bg-sumi/[0.01] transition-colors">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-sumi/[0.02] flex items-center justify-center">
                  {item.category === 'Flight' ? <Plane className="w-5 h-5 text-sumi/20" /> : <Building2 className="w-5 h-5 text-sumi/20" />}
                </div>
                <div className="text-left space-y-1">
                  <h4 className="text-[16px] font-serif font-black text-sumi/80 group-hover:text-sumi transition-colors">{item.name}</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#DDE4F0] border border-white flex items-center justify-center text-[8px] font-bold text-[#566D91]">K</div>
                    <span className={`text-[9px] font-bold tracking-widest uppercase ${item.paid ? 'text-sumi/20' : 'text-accent'}`}>{item.paid ? '已付' : '未付'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-serif font-black text-sumi/80">${item.amount.toLocaleString()}</p>
                <p className="text-[10px] font-serif text-sumi/20 italic">¥{Math.floor(item.amount * TWD_TO_JPY).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className="fixed bottom-10 left-0 right-0 p-8 flex justify-center pointer-events-none z-[100]">
          <button onClick={() => handleOpenLedger()} className="w-full max-w-sm py-5 bg-sumi text-white rounded-[16px] font-serif text-lg tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all pointer-events-auto">
            <Plus className="w-5 h-5" />
            <span>記一筆</span>
          </button>
        </div>

        {/* Ledger Modal */}
        {isLedgerModalOpen && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end justify-center">
            <div className="bg-washi w-full max-w-md h-[75vh] rounded-t-[32px] overflow-hidden flex flex-col page-enter">
              <div className="flex justify-between items-center px-8 py-7 border-b border-sumi/5">
                <div className="flex items-center gap-3">
                   <Edit3 className="w-5 h-5 text-sumi/20" />
                   <h3 className="text-xl font-serif font-bold text-sumi">{editingItem ? '編輯帳目' : '新增款項'}</h3>
                </div>
                <button onClick={() => setIsLedgerModalOpen(false)}><X className="w-7 h-7 text-sumi/40" /></button>
              </div>
              <div className="flex-1 p-8 space-y-10 overflow-y-auto hide-scrollbar">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-sumi/40 uppercase block text-left">項目名稱</label>
                  <input type="text" value={ledgerForm.name} onChange={e => setLedgerForm({...ledgerForm, name: e.target.value})} className="w-full text-2xl font-serif bg-transparent border-b-2 border-sumi/10 py-3 focus:outline-none focus:border-sumi transition-colors" placeholder="輸入名稱..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-sumi/40 uppercase block text-left">金額 (TWD)</label>
                  <div className="relative">
                    <input type="number" value={ledgerForm.amount} onChange={e => setLedgerForm({...ledgerForm, amount: e.target.value})} className="w-full text-5xl font-serif font-black bg-transparent border-b-2 border-sumi/10 py-3 focus:outline-none focus:border-sumi transition-colors" placeholder="0" />
                    <div className="absolute right-0 bottom-4 text-xs font-serif text-sumi/30 uppercase tracking-widest">TWD</div>
                  </div>
                  {ledgerForm.amount && <p className="text-[11px] font-serif text-sumi/30 text-left italic">約 ¥{Math.floor(parseFloat(ledgerForm.amount) * TWD_TO_JPY).toLocaleString()}</p>}
                </div>
                <div className="flex gap-4 pt-10">
                   {editingItem && <button onClick={() => deleteLedgerItem(editingItem.id)} className="flex-1 py-5 border-2 border-accent/20 text-accent rounded-xl flex items-center justify-center gap-2 transition-all"><Trash2 className="w-5 h-5" /><span>刪除</span></button>}
                   <button onClick={saveLedgerItem} className="flex-[2] py-5 bg-sumi text-white rounded-xl flex items-center justify-center shadow-2xl transition-all"><span className="font-serif text-lg tracking-[0.2em]">確認儲存</span></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInfo = () => (
    <div className="px-8 pt-16 pb-24 bg-washi min-h-screen page-enter">
       <button onClick={() => setActiveTab('itinerary')} className="flex items-center gap-2 text-sumi/30 mb-10"><ArrowLeft className="w-4 h-4" /><span className="text-[11px] font-serif font-bold tracking-widest uppercase">返回行程</span></button>
       <header className="text-center mb-16">
         <Info className="w-16 h-16 text-sumi/5 mx-auto mb-6" />
         <h2 className="text-3xl font-serif font-black text-sumi/80 uppercase tracking-[0.4em]">旅行手帖</h2>
       </header>
       <div className="space-y-8 text-left">
         <div className="p-8 bg-white rounded-2xl border border-sumi/5 shadow-mag">
            <h3 className="text-[10px] font-serif font-black text-sumi/30 mb-4 uppercase tracking-[0.2em]">住宿資訊 / FUKUOKA</h3>
            <p className="text-xl font-serif font-bold text-sumi mb-1">Grand Hyatt Fukuoka</p>
            <p className="text-xs text-sumi/50 leading-relaxed">位於博多運河城內，逛街交通極其便利。</p>
         </div>
         <div className="p-8 bg-accent rounded-2xl text-white shadow-2xl shadow-accent/20">
            <h3 className="text-[10px] font-serif font-bold mb-4 uppercase tracking-[0.2em]">TRAVEL CHECKLIST</h3>
            <p className="text-lg font-serif font-medium leading-relaxed">Visit Japan Web QR Code 是否已截圖備份？</p>
         </div>
       </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-washi font-sans shadow-2xl relative overflow-x-hidden flex flex-col">
      <div className="flex-1">
        {activeTab === 'itinerary' && renderItinerary()}
        {activeTab === 'ledger' && renderLedger()}
        {activeTab === 'info' && renderInfo()}
      </div>
      {selectedActivity && <ActivityDetail activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
    </div>
  );
};

// Mount the App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
