
import { DayPlan, WeatherData, LedgerItem } from './types';

export const WEATHER_FORECAST: WeatherData[] = [
  { time: '現在', temp: 18, condition: 'sunny' },
  { time: '09:00', temp: 19, condition: 'sunny' },
  { time: '12:00', temp: 22, condition: 'sunny' },
  { time: '15:00', temp: 21, condition: 'cloudy' },
  { time: '18:00', temp: 18, condition: 'cloudy' },
  { time: '21:00', temp: 16, condition: 'sunny' },
  { time: '00:00', temp: 14, condition: 'sunny' },
  { time: '03:00', temp: 13, condition: 'sunny' },
];

export const INITIAL_LEDGER_DATA: LedgerItem[] = [
  { id: '1', name: '星宇航空機票', amount: 148100, paid: true, category: 'Flight' },
  { id: '2', name: 'The Blossom Kumamoto x1晚', amount: 15383, paid: true, category: 'Hotel' },
  { id: '3', name: '月洸樹 黑川 x1晚', amount: 81503, paid: true, category: 'Hotel' },
  { id: '4', name: '由布院 玉の湯 x1晚', amount: 55941, paid: false, category: 'Hotel' },
  { id: '5', name: 'Grand Hyatt Fukuoka x3晚', amount: 123105, paid: true, category: 'Hotel' },
];

export const TRIP_DATA: DayPlan[] = [
  {
    date: '25',
    dayOfWeek: 'SAT',
    city: '京都市',
    title: '鴨川の風と錦市場',
    activities: [
      {
        id: 'd1-flight',
        time: '08:30',
        location: '台北桃園 (TPE) 起飛',
        category: 'Flight',
        description: '搭乘去程航班前往關西，預計 12:15 抵達 KIX。',
        details: [{ content: '12:15 抵達關西機場，預計入境手續約1小時。' }]
      },
      {
        id: 'd1-haruka',
        time: '13:30',
        location: 'HARUKA 特急列車',
        category: 'Transport',
        description: '使用 ICOCA & HARUKA 套票直達京都車站。',
        details: [{ content: '搭乘 HARUKA 特急直達京都車站（約75分鐘）。抵達後轉乘地鐵烏丸線至飯店寄放行李。' }]
      },
      {
        id: 'd1-nishiki',
        time: '16:00',
        location: '錦市場 (Nishiki Market)',
        category: 'Food',
        description: '享用京都小吃，如豆乳甜甜圈、三木雞卵。',
        details: [{ content: '需注意市場店家多於 17:00 打烊，建議儘早抵達。' }]
      },
      {
        id: 'd1-river',
        time: '17:30',
        location: '鴨川散策 (Kamogawa)',
        category: 'Relax',
        description: '從四條大橋走到三條大橋，欣賞河岸風光。',
        details: [{ content: '晚上可安排在先斗町享用京料理。' }]
      }
    ]
  },
  {
    date: '26',
    dayOfWeek: 'SUN',
    city: '嵐山',
    title: '竹林の静寂と金閣寺',
    activities: [
      {
        id: 'd2-arashiyama',
        time: '09:30',
        location: '嵐山竹林之道',
        category: 'Sightseeing',
        description: '漫步竹林，參觀野宮神社與天龍寺。',
        details: [{ content: '參觀世界遺產「天龍寺」及其曹源池庭園，隨後在渡月橋拍照。' }]
      },
      {
        id: 'd2-lunch',
        time: '12:00',
        location: '嵐山湯豆腐料理',
        category: 'Food',
        description: '品嚐京都著名的湯豆腐。',
        details: [{ content: '推薦嵐山大街周邊的傳統豆腐餐館。' }]
      },
      {
        id: 'd2-kinkakuji',
        time: '14:30',
        location: '金閣寺 (Kinkaku-ji)',
        category: 'Culture',
        description: '下午時段的金閣在陽光下最為閃耀。',
        details: [{ content: '搭乘嵐電（京福電氣鐵道）轉乘公車前往。' }]
      }
    ]
  },
  {
    date: '27',
    dayOfWeek: 'MON',
    city: '宇治・伏見',
    title: '任天堂の聖地と抹茶',
    activities: [
      {
        id: 'd3-inari',
        time: '08:30',
        location: '伏見稻荷大社',
        category: 'Culture',
        description: '參觀千本鳥居，避開中午人潮。',
        details: [{ content: '搭乘 JR 奈良線前往。' }]
      },
      {
        id: 'd3-nintendo',
        time: '11:00',
        location: '任天堂博物館 (Special)',
        category: 'Special',
        isSpecial: true,
        description: '本日重點預約，務必攜帶護照正本。',
        details: [{ content: '任天堂博物館 (Nintendo Museum) 參觀，預計停留 3 小時。' }]
      },
      {
        id: 'd3-uji',
        time: '15:00',
        location: '宇治平等院',
        category: 'Sightseeing',
        description: '參觀平等院紫藤花與表參道抹茶甜點。',
        details: [{ content: '在表參道享用中村藤吉或伊藤久右衛門的抹茶甜點。' }]
      }
    ]
  },
  {
    date: '28',
    dayOfWeek: 'TUE',
    city: '大阪',
    title: '清水の舞台と道頓堀',
    activities: [
      {
        id: 'd4-kiyomizu',
        time: '08:30',
        location: '清水寺',
        category: 'Culture',
        description: '參觀清水舞台、音羽瀑布。',
        details: [{ content: '沿著三年坂、二年坂散步至高台寺。' }]
      },
      {
        id: 'd4-move',
        time: '14:00',
        location: '移動至大阪難波',
        category: 'Transport',
        description: '搭乘阪急電鐵轉地鐵御堂筋線。',
        details: [{ content: '16:00 辦理大阪飯店 Check-in。' }]
      },
      {
        id: 'd4-dotonbori',
        time: '17:30',
        location: '道頓堀商圈',
        category: 'Food',
        description: '固力果看板與大阪燒晚餐。',
        details: [{ content: '晚餐享用大阪燒（美津の或千房）。' }]
      }
    ]
  },
  {
    date: '29',
    dayOfWeek: 'WED',
    city: '大阪',
    title: '大阪城と展望の夜',
    activities: [
      {
        id: 'd5-castle',
        time: '09:30',
        location: '大阪城公園',
        category: 'Sightseeing',
        description: '登上天守閣俯瞰大阪市景。',
        details: [{ content: '今日為國定假日「昭和之日」。' }]
      },
      {
        id: 'd5-shinsekai',
        time: '13:00',
        location: '新世界・通天閣',
        category: 'Culture',
        description: '感受昭和復古風情與串炸午餐。',
        details: [{ content: '午餐推薦串炸 (Kushikatsu)。' }]
      },
      {
        id: 'd5-harukas',
        time: '17:30',
        location: '阿倍野 Harukas 300',
        category: 'Special',
        isSpecial: true,
        description: '欣賞關西最壯觀的日落與夜景。',
        details: [{ content: '展望台俯瞰大阪市全景。' }]
      }
    ]
  },
  {
    date: '30',
    dayOfWeek: 'THU',
    city: 'USJ',
    title: 'ユニバーサルスタジオ',
    activities: [
      {
        id: 'd6-usj',
        time: '08:30',
        location: '環球影城 (USJ)',
        category: 'Special',
        isSpecial: true,
        description: '全日遊玩，必玩超級任天堂世界。',
        details: [{ content: '黃金週期間，務必提前購買門票與快速通關。' }]
      }
    ]
  },
  {
    date: '01',
    dayOfWeek: 'FRI',
    city: '箕面',
    title: '勝尾寺の達磨と梅田',
    activities: [
      {
        id: 'd7-market',
        time: '08:00',
        location: '木津市場 (Kizu Market)',
        category: 'Food',
        description: '享用海鮮丼與當季水果。',
        details: [{ content: '週五平日，市場有營業。' }]
      },
      {
        id: 'd7-katsuoji',
        time: '11:00',
        location: '勝尾寺',
        category: 'Culture',
        description: '參拜不倒翁之寺，祈求勝運。',
        details: [{ content: '搭乘地鐵御堂筋線至箕面萱野站再轉車。' }]
      },
      {
        id: 'd7-umeda',
        time: '16:00',
        location: '梅田商圈採購',
        category: 'Food',
        description: '百貨公司與電器行最後掃貨。',
        details: [{ content: 'Grand Front Osaka、Yodobashi Camera。' }]
      }
    ]
  },
  {
    date: '02',
    dayOfWeek: 'SAT',
    city: '關西空港',
    title: '旅の終わりと再會',
    activities: [
      {
        id: 'd8-rapit',
        time: '10:00',
        location: '南海電鐵 Rapi:t',
        category: 'Transport',
        description: '從難波直達關西機場。',
        details: [{ content: '約 38 分鐘抵達。' }]
      },
      {
        id: 'd8-dutyfree',
        time: '12:00',
        location: '機場免稅店',
        category: 'Food',
        description: '購買伴手禮 (ROYCE, 白色戀人)。',
        details: [{ content: '最後採購時機。' }]
      },
      {
        id: 'd8-flight',
        time: '13:25',
        location: '返程台北 (TPE)',
        category: 'Flight',
        description: '結束美好的 8 天關西之旅。',
        details: [{ content: '預計 15:30 抵達台北。' }]
      }
    ]
  }
];
