export type Category = "Smart Home" | "HVAC" | "Lighting" | "Security";

export const CATEGORIES: Category[] = ["Smart Home", "HVAC", "Lighting", "Security"];

export const HASHTAGS = [
  "#bestseller",
  "#new",
  "#energy-efficient",
  "#b2b",
  "#wifi",
  "#zigbee",
  "#commercial",
  "#warranty-3y",
];

export type Review = {
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: Category;
  cogs: number;
  price: number;
  stock: number;
  reorderPoint: number;
  rating: number;
  unitsSold: number;
  tags: string[];
  description: string;
  monthly: { month: string; units: number }[];
  reviews: Review[];
};

const MONTHS_6 = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

function series(base: number, deltas: number[]) {
  return MONTHS_6.map((month, i) => ({ month, units: Math.max(0, base + (deltas[i] ?? 0)) }));
}

export const PRODUCTS: Product[] = [
  {
    id: "p-1001",
    sku: "SGK-SH-1001",
    name: "Aeris Smart Thermostat Pro",
    category: "Smart Home",
    cogs: 62,
    price: 149.9,
    stock: 1840,
    reorderPoint: 400,
    rating: 4.7,
    unitsSold: 6120,
    tags: ["#bestseller", "#wifi", "#energy-efficient"],
    description:
      "Commercial-grade smart thermostat with occupancy sensing, multi-zone scheduling and open API integration.",
    monthly: series(820, [-90, 40, 130, 60, 190, 240]),
    reviews: [
      {
        author: "Almaty Facility Group",
        rating: 5,
        date: "2026-07-18",
        text: "Deployed across 42 offices. Installation took minutes per unit and the API is well documented.",
      },
      {
        author: "D. Nurlanov",
        rating: 4,
        date: "2026-06-02",
        text: "Excellent hardware. Mobile app scheduling could be a bit faster on older devices.",
      },
      {
        author: "Steppe Retail LLP",
        rating: 5,
        date: "2026-05-11",
        text: "Energy costs down 14% in the first quarter after rollout.",
      },
    ],
  },
  {
    id: "p-1002",
    sku: "SGK-SEC-2210",
    name: "Vertex 4K Security Sensor",
    category: "Security",
    cogs: 88,
    price: 219,
    stock: 260,
    reorderPoint: 350,
    rating: 4.8,
    unitsSold: 4380,
    tags: ["#new", "#commercial", "#warranty-3y"],
    description:
      "Edge-AI motion sensor with 4K capture, tamper detection and on-device person classification.",
    monthly: series(560, [-40, 60, 120, 210, 280, 360]),
    reviews: [
      {
        author: "Astana Logistics Hub",
        rating: 5,
        date: "2026-07-22",
        text: "False positives dropped dramatically compared to our previous vendor.",
      },
      {
        author: "M. Yerbolat",
        rating: 4,
        date: "2026-06-28",
        text: "Great device, but PoE injectors should be bundled.",
      },
    ],
  },
  {
    id: "p-1003",
    sku: "SGK-HVAC-3040",
    name: "Kelvin Industrial Air Handler",
    category: "HVAC",
    cogs: 940,
    price: 2190,
    stock: 0,
    reorderPoint: 40,
    rating: 4.4,
    unitsSold: 310,
    tags: ["#commercial", "#energy-efficient"],
    description:
      "High-capacity air handling unit with variable-speed EC fans and BMS-ready Modbus control.",
    monthly: series(58, [-12, -4, 6, 2, -8, 10]),
    reviews: [
      {
        author: "KazBuild Contractors",
        rating: 4,
        date: "2026-07-05",
        text: "Solid unit. Lead times are the only constraint — currently backordered.",
      },
      {
        author: "T. Sagatova",
        rating: 5,
        date: "2026-04-19",
        text: "Quietest handler we have installed at this capacity.",
      },
    ],
  },
  {
    id: "p-1004",
    sku: "SGK-LGT-4102",
    name: "Lumen Linear LED Panel 60W",
    category: "Lighting",
    cogs: 34,
    price: 79.5,
    stock: 5240,
    reorderPoint: 800,
    rating: 4.6,
    unitsSold: 12800,
    tags: ["#bestseller", "#energy-efficient", "#b2b"],
    description:
      "Flicker-free tunable-white linear panel with DALI dimming for offices and retail floors.",
    monthly: series(1900, [-220, -60, 90, 140, 60, 210]),
    reviews: [
      {
        author: "Nomad Offices",
        rating: 5,
        date: "2026-07-14",
        text: "Colour consistency across 300 panels was flawless.",
      },
      {
        author: "R. Iskakov",
        rating: 4,
        date: "2026-05-30",
        text: "Good value. Mounting brackets could be sturdier.",
      },
    ],
  },
  {
    id: "p-1005",
    sku: "SGK-SH-1188",
    name: "Aeris Zigbee Gateway Hub",
    category: "Smart Home",
    cogs: 41,
    price: 109,
    stock: 420,
    reorderPoint: 500,
    rating: 4.3,
    unitsSold: 3260,
    tags: ["#zigbee", "#b2b"],
    description: "Rack-mountable Zigbee 3.0 gateway supporting 250 concurrent endpoints.",
    monthly: series(430, [40, -30, 20, 70, 110, 95]),
    reviews: [
      {
        author: "Caspian Hotels",
        rating: 4,
        date: "2026-06-11",
        text: "Reliable across 180 rooms. Firmware updates are frequent and safe.",
      },
    ],
  },
  {
    id: "p-1006",
    sku: "SGK-SEC-2280",
    name: "Vertex Access Control Reader",
    category: "Security",
    cogs: 74,
    price: 189,
    stock: 1120,
    reorderPoint: 300,
    rating: 4.5,
    unitsSold: 2740,
    tags: ["#commercial", "#new"],
    description: "Multi-credential reader supporting NFC, BLE and mobile wallet badges.",
    monthly: series(360, [-20, 30, 60, 40, 90, 120]),
    reviews: [
      {
        author: "Tengiz Industrial Park",
        rating: 5,
        date: "2026-07-01",
        text: "Mobile badge support removed our card printing costs entirely.",
      },
    ],
  },
  {
    id: "p-1007",
    sku: "SGK-HVAC-3120",
    name: "Kelvin Duct Humidity Sensor",
    category: "HVAC",
    cogs: 19,
    price: 54,
    stock: 190,
    reorderPoint: 250,
    rating: 4.2,
    unitsSold: 5100,
    tags: ["#b2b", "#warranty-3y"],
    description: "In-duct temperature and humidity probe with 0-10V and Modbus output.",
    monthly: series(780, [-120, 40, -60, 90, 30, 60]),
    reviews: [
      {
        author: "Shymkent Cold Chain",
        rating: 4,
        date: "2026-05-08",
        text: "Accurate and cheap to replace. Exactly what we needed.",
      },
    ],
  },
  {
    id: "p-1008",
    sku: "SGK-LGT-4210",
    name: "Lumen Outdoor Flood 150W",
    category: "Lighting",
    cogs: 58,
    price: 139,
    stock: 780,
    reorderPoint: 200,
    rating: 4.6,
    unitsSold: 3980,
    tags: ["#commercial", "#energy-efficient"],
    description: "IP66 asymmetric flood luminaire for yards, logistics ramps and car parks.",
    monthly: series(520, [60, -40, 30, 80, 20, 140]),
    reviews: [
      {
        author: "Aktobe Freight",
        rating: 5,
        date: "2026-06-21",
        text: "Survived a brutal winter with zero failures.",
      },
    ],
  },
];

export const REVENUE_SERIES = [
  { month: "Aug", revenue: 412000, profit: 121000 },
  { month: "Sep", revenue: 438000, profit: 129500 },
  { month: "Oct", revenue: 496000, profit: 152300 },
  { month: "Nov", revenue: 604000, profit: 191200 },
  { month: "Dec", revenue: 712000, profit: 236800 },
  { month: "Jan", revenue: 528000, profit: 158400 },
  { month: "Feb", revenue: 561000, profit: 170900 },
  { month: "Mar", revenue: 613000, profit: 195100 },
  { month: "Apr", revenue: 649000, profit: 208600 },
  { month: "May", revenue: 702000, profit: 231400 },
  { month: "Jun", revenue: 758000, profit: 254900 },
  { month: "Jul", revenue: 824000, profit: 281600 },
];

export const CATEGORY_REVENUE: { category: Category; revenue: number }[] = [
  { category: "Smart Home", revenue: 2480000 },
  { category: "Security", revenue: 1960000 },
  { category: "Lighting", revenue: 1620000 },
  { category: "HVAC", revenue: 1237000 },
];

export const KPI = {
  revenue: 7297000,
  revenueDelta: 12.4,
  profit: 2331700,
  profitDelta: 8.9,
  orders: 18342,
  ordersDelta: 6.1,
  disputes: 14,
  disputesDelta: -21.5,
};

export type OrderStatus = "Processing" | "In Transit" | "Customs" | "Delivered" | "Return/Dispute";

export const ORDER_STATUSES: OrderStatus[] = [
  "Processing",
  "In Transit",
  "Customs",
  "Delivered",
  "Return/Dispute",
];

export type Order = {
  id: string;
  customer: string;
  product: string;
  qty: number;
  total: number;
  status: OrderStatus;
  daysLeft: number;
  warehouse: string;
};

export const ORDERS: Order[] = [
  {
    id: "AGS-48210",
    customer: "Astana Logistics Hub",
    product: "Vertex 4K Security Sensor",
    qty: 120,
    total: 26280,
    status: "Processing",
    daysLeft: 2,
    warehouse: "Almaty DC-1",
  },
  {
    id: "AGS-48211",
    customer: "Nomad Offices",
    product: "Lumen Linear LED Panel 60W",
    qty: 640,
    total: 50880,
    status: "In Transit",
    daysLeft: 6,
    warehouse: "Karaganda Transit",
  },
  {
    id: "AGS-48214",
    customer: "Caspian Hotels",
    product: "Aeris Zigbee Gateway Hub",
    qty: 180,
    total: 19620,
    status: "Customs",
    daysLeft: 1,
    warehouse: "Khorgos Customs Zone",
  },
  {
    id: "AGS-48219",
    customer: "KazBuild Contractors",
    product: "Kelvin Industrial Air Handler",
    qty: 6,
    total: 13140,
    status: "Processing",
    daysLeft: -1,
    warehouse: "Shymkent DC-3",
  },
  {
    id: "AGS-48223",
    customer: "Tengiz Industrial Park",
    product: "Vertex Access Control Reader",
    qty: 95,
    total: 17955,
    status: "In Transit",
    daysLeft: 9,
    warehouse: "Atyrau Hub",
  },
  {
    id: "AGS-48231",
    customer: "Steppe Retail LLP",
    product: "Aeris Smart Thermostat Pro",
    qty: 300,
    total: 44970,
    status: "Delivered",
    daysLeft: 0,
    warehouse: "Delivered — Almaty",
  },
  {
    id: "AGS-48236",
    customer: "Aktobe Freight",
    product: "Lumen Outdoor Flood 150W",
    qty: 74,
    total: 10286,
    status: "Return/Dispute",
    daysLeft: 3,
    warehouse: "Aktobe Returns Bay",
  },
  {
    id: "AGS-48240",
    customer: "Shymkent Cold Chain",
    product: "Kelvin Duct Humidity Sensor",
    qty: 420,
    total: 22680,
    status: "Customs",
    daysLeft: 4,
    warehouse: "Khorgos Customs Zone",
  },
  {
    id: "AGS-48244",
    customer: "Almaty Facility Group",
    product: "Aeris Smart Thermostat Pro",
    qty: 210,
    total: 31479,
    status: "In Transit",
    daysLeft: 5,
    warehouse: "Almaty DC-1",
  },
  {
    id: "AGS-48251",
    customer: "Caspian Hotels",
    product: "Vertex Access Control Reader",
    qty: 40,
    total: 7560,
    status: "Delivered",
    daysLeft: 0,
    warehouse: "Delivered — Aktau",
  },
];

export type UploadBatch = {
  date: string;
  file: string;
  items: number;
  status: "Completed" | "Completed with errors" | "Failed";
};

export const UPLOAD_HISTORY: UploadBatch[] = [
  { date: "2026-07-28", file: "sgk_catalog_q3_full.xlsx", items: 1284, status: "Completed" },
  {
    date: "2026-07-12",
    file: "lighting_refresh_july.xlsx",
    items: 316,
    status: "Completed with errors",
  },
  { date: "2026-06-30", file: "security_line_v2.xlsx", items: 148, status: "Completed" },
  { date: "2026-06-14", file: "hvac_pricing_update.xlsx", items: 0, status: "Failed" },
  { date: "2026-05-29", file: "sgk_catalog_q2_full.xlsx", items: 1102, status: "Completed" },
];

export type StagedRow = {
  id: number;
  name: string;
  sku: string;
  category: string;
  cogs: number | "";
  price: number | "";
  stock: number | "";
};

export const STAGED_ROWS: StagedRow[] = [
  {
    id: 1,
    name: "Aeris Motion Puck",
    sku: "SGK-SH-1204",
    category: "Smart Home",
    cogs: 12,
    price: 34,
    stock: 900,
  },
  {
    id: 2,
    name: "Lumen Track Spot 12W",
    sku: "SGK-LGT-4302",
    category: "Lighting",
    cogs: 9,
    price: "",
    stock: 1400,
  },
  {
    id: 3,
    name: "Vertex Door Contact",
    sku: "SGK-SEC-2311",
    category: "Security",
    cogs: 6,
    price: 19,
    stock: 3200,
  },
  {
    id: 4,
    name: "Kelvin VAV Actuator",
    sku: "SGK-HVAC-3211",
    category: "Climate",
    cogs: 44,
    price: 96,
    stock: 210,
  },
  {
    id: 5,
    name: 'Aeris Wall Panel 7"',
    sku: "SGK-SH-1310",
    category: "Smart Home",
    cogs: 88,
    price: 210,
    stock: 340,
  },
  {
    id: 6,
    name: "Lumen Emergency Exit Sign",
    sku: "SGK-LGT-4410",
    category: "Lighting",
    cogs: 15,
    price: 42,
    stock: "",
  },
];

export const INSIGHTS = [
  {
    en: "Security sensors are trending +38% QoQ. Consider increasing inventory by 15% before Q3 peak.",
    ru: "Датчики безопасности растут на 38% к кварталу. Увеличьте запас на 15% до пика Q3.",
  },
  {
    en: "Kelvin Industrial Air Handler is out of stock while demand held steady — 6 orders are at risk.",
    ru: "Kelvin Industrial Air Handler закончился при стабильном спросе — под риском 6 заказов.",
  },
  {
    en: "Lighting margin is 3.2pp below portfolio average. A 4% price uplift would not affect conversion.",
    ru: "Маржа в освещении на 3.2 п.п. ниже среднего. Рост цены на 4% не повлияет на конверсию.",
  },
];

export type TeamMember = {
  name: string;
  email: string;
  role: "Owner" | "Catalog Editor" | "Financial Analyst";
  lastActive: string;
  initials: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Aigerim Sultanova",
    email: "a.sultanova@sgk.kz",
    role: "Owner",
    lastActive: "2 min ago",
    initials: "AS",
  },
  {
    name: "Daniyar Nurlanov",
    email: "d.nurlanov@sgk.kz",
    role: "Catalog Editor",
    lastActive: "1 h ago",
    initials: "DN",
  },
  {
    name: "Marat Yerbolat",
    email: "m.yerbolat@sgk.kz",
    role: "Financial Analyst",
    lastActive: "Yesterday",
    initials: "MY",
  },
  {
    name: "Tomiris Sagatova",
    email: "t.sagatova@sgk.kz",
    role: "Catalog Editor",
    lastActive: "3 days ago",
    initials: "TS",
  },
  {
    name: "Ruslan Iskakov",
    email: "r.iskakov@sgk.kz",
    role: "Financial Analyst",
    lastActive: "Last week",
    initials: "RI",
  },
];

export const ROLE_PERMISSIONS: Record<TeamMember["role"], string[]> = {
  Owner: ["Billing", "Team & roles", "Catalog", "Pricing", "Logistics", "Analytics"],
  "Catalog Editor": ["Catalog", "Bulk import", "Inventory"],
  "Financial Analyst": ["Pricing", "Analytics", "Exports"],
};

export const AI_ANSWERS: { q: string[]; en: string; ru: string }[] = [
  {
    q: ["best selling", "top product", "лучший"],
    en: "Your best seller is **Lumen Linear LED Panel 60W** — 12,800 units sold and $1.02M revenue over 12 months. It carries a 57% gross margin, the second highest in your catalog.",
    ru: "Ваш лидер продаж — **Lumen Linear LED Panel 60W**: 12 800 шт. и $1.02 млн выручки за 12 месяцев при валовой марже 57%.",
  },
  {
    q: ["restock", "stock", "inventory", "склад", "запас"],
    en: "Three SKUs need attention: Kelvin Industrial Air Handler (out of stock), Kelvin Duct Humidity Sensor (190 units, below reorder point) and Vertex 4K Security Sensor (260 units). I would prioritise the air handler — it blocks $13.1K of confirmed orders.",
    ru: "Внимания требуют три SKU: Kelvin Industrial Air Handler (нет в наличии), Kelvin Duct Humidity Sensor (190 шт.) и Vertex 4K Security Sensor (260 шт.). Приоритет — air handler: он блокирует заказы на $13.1K.",
  },
  {
    q: ["margin", "profit", "маржа", "прибыль"],
    en: "Net profit for the last 12 months is $2.33M on $7.30M revenue — a 31.9% net margin, up 8.9% year over year. Lighting is the weakest category at 28.7%.",
    ru: "Чистая прибыль за 12 месяцев — $2.33 млн при выручке $7.30 млн (маржа 31.9%, +8.9% г/г). Слабейшая категория — освещение: 28.7%.",
  },
  {
    q: ["dispute", "return", "спор", "возврат"],
    en: "You have 14 active disputes, down 21.5% versus last month. The largest is AGS-48236 (Aktobe Freight, $10,286) — a return currently sitting in the Aktobe returns bay.",
    ru: "Активных споров — 14, на 21.5% меньше, чем в прошлом месяце. Крупнейший: AGS-48236 (Aktobe Freight, $10 286).",
  },
];

export const AI_FALLBACK = {
  en: "Based on the last 12 months across the SGK tenant: revenue $7.30M, net profit $2.33M, 18,342 orders. Ask me about best sellers, restocking, margins or disputes for a deeper breakdown.",
  ru: "За последние 12 месяцев по тенанту SGK: выручка $7.30 млн, чистая прибыль $2.33 млн, 18 342 заказа. Спросите о лидерах продаж, запасах, марже или спорах.",
};
