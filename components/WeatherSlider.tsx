
import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherSliderProps {
  data: WeatherData[];
  location: string;
}

const WeatherSlider: React.FC<WeatherSliderProps> = ({ data, location }) => {
  const getIcon = (condition: string) => {
    const iconClass = "w-4 h-4 text-sumi/40 stroke-[1.5px]";
    switch (condition) {
      case 'sunny': return <Sun className={iconClass} />;
      case 'cloudy': return <Cloud className={iconClass} />;
      case 'rainy': return <CloudRain className={iconClass} />;
      default: return <Sun className={iconClass} />;
    }
  };

  return (
    <div className="mb-12 px-6">
      <div className="mb-6">
        <h3 className="text-3xl font-serif text-sumi/20 mb-1">{location}</h3>
        <div className="flex justify-between items-center">
          <span className="text-[10px] tracking-[0.2em] text-sumi/30 font-medium uppercase">未來 24 小時預報</span>
          <span className="text-[10px] tracking-[0.1em] text-sumi/20 uppercase font-sans">Open-Meteo</span>
        </div>
      </div>
      
      <div className="flex gap-10 overflow-x-auto hide-scrollbar pb-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-4 flex-shrink-0">
            <span className="text-[10px] font-serif text-sumi/30 tracking-wider">
              {idx === 0 ? '現在' : item.time}
            </span>
            {getIcon(item.condition)}
            <span className="text-lg font-serif font-light text-sumi/40">{item.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherSlider;
