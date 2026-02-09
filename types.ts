
export type TabType = 'itinerary' | 'map' | 'ledger' | 'info';

export interface WeatherData {
  time: string;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

export interface ActivityDetail {
  title?: string;
  content: string;
}

export interface TravelActivity {
  id: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  category: 'Food' | 'Sightseeing' | 'Culture' | 'Relax' | 'Flight' | 'Transport' | 'Hotel' | 'Special';
  details?: ActivityDetail[];
  address?: string;
  phone?: string;
  menu?: { name: string; translation: string }[];
  reservationCode?: string;
  isSpecial?: boolean;
}

export interface LedgerItem {
  id: string;
  name: string;
  amount: number; // in TWD
  paid: boolean;
  category?: 'Flight' | 'Hotel' | 'Food' | 'Transport' | 'Shopping' | 'Other';
}

export interface DayPlan {
  date: string;
  dayOfWeek: string;
  city: string;
  title: string;
  activities: TravelActivity[];
}
