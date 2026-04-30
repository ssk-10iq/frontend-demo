// Stub data — replace with real API calls in the next iteration

export type MarketType = 'binary' | 'multiple_choice';
export type MarketStatus = 'draft' | 'open' | 'closed' | 'resolved' | 'finalized' | 'cancelled';
export type IconColor = 'primary' | 'secondary' | 'tertiary';

export type OrderBookEntry = {
  price: number;
  size: number;
  cumulative: number;
};

export type StubOutcome = {
  id: string;
  label: string;
  flag?: string;          // emoji flag e.g. '🇧🇷'
  icon?: string;          // Material Symbol name
  probability: number;    // 0–100
  change: number | null;  // % change; null = unchanged
  asks: OrderBookEntry[]; // sell side (higher prices, shown in tertiary/red)
  bids: OrderBookEntry[]; // buy side (lower prices, shown in secondary/green)
  midPrice: number;
};

export type StubMarket = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  status: MarketStatus;
  type: MarketType;
  closeDate: string;
  resolutionDate: string;
  volume: number;     // USD
  traders: number;
  icon: string;       // Material Symbol name
  iconColor: IconColor;
  outcomes: StubOutcome[];
  resolutionSource: string;
  traderCount: number;
};

export type DisputeStatus = 'pending' | 'upheld' | 'rejected';

export type StubDispute = {
  id: string;
  marketId: string;
  disputer: string;           // wallet address
  reason: string;
  evidenceUrl?: string;
  suggestedOutcomeId: string;
  status: DisputeStatus;
  disputedAt: string;         // ISO date string
};

export type StubResolution = {
  marketId: string;
  winningOutcomeId: string;
  resolverName: string;
  resolvedAt: string;         // ISO date string
  evidenceUrl?: string;
  notes?: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function binaryOutcomes(yesPct: number, midPrice?: number): StubOutcome[] {
  const yes = yesPct / 100;
  const mid = midPrice ?? yes;
  return [
    {
      id: 'yes',
      label: 'Yes',
      probability: yesPct,
      change: null,
      midPrice: mid,
      asks: [
        { price: mid + 0.02, size: 800, cumulative: 800 },
        { price: mid + 0.03, size: 1500, cumulative: 2300 },
        { price: mid + 0.05, size: 3200, cumulative: 5500 },
      ],
      bids: [
        { price: mid - 0.01, size: 1200, cumulative: 1200 },
        { price: mid - 0.02, size: 2000, cumulative: 3200 },
        { price: mid - 0.04, size: 4100, cumulative: 7300 },
      ],
    },
    {
      id: 'no',
      label: 'No',
      probability: 100 - yesPct,
      change: null,
      midPrice: 1 - mid,
      asks: [],
      bids: [],
    },
  ];
}

// ── World Cup 2026 ────────────────────────────────────────────────────────────

// Emoji flag per team ID — used in both match and winner markets
const WC_FLAGS: Record<string, string> = {
  // Group A
  mexico: '🇲🇽', 'south-africa': '🇿🇦', 'south-korea': '🇰🇷', czechia: '🇨🇿',
  // Group B
  canada: '🇨🇦', bosnia: '🇧🇦', qatar: '🇶🇦', switzerland: '🇨🇭',
  // Group C
  brazil: '🇧🇷', morocco: '🇲🇦', haiti: '🇭🇹', scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  // Group D
  usa: '🇺🇸', paraguay: '🇵🇾', australia: '🇦🇺', turkey: '🇹🇷',
  // Group E
  germany: '🇩🇪', curacao: '🇨🇼', 'ivory-coast': '🇨🇮', ecuador: '🇪🇨',
  // Group F
  netherlands: '🇳🇱', japan: '🇯🇵', sweden: '🇸🇪', tunisia: '🇹🇳',
  // Group G
  belgium: '🇧🇪', egypt: '🇪🇬', iran: '🇮🇷', 'new-zealand': '🇳🇿',
  // Group H
  spain: '🇪🇸', 'cape-verde': '🇨🇻', 'saudi-arabia': '🇸🇦', uruguay: '🇺🇾',
  // Group I
  france: '🇫🇷', senegal: '🇸🇳', iraq: '🇮🇶', norway: '🇳🇴',
  // Group J
  argentina: '🇦🇷', algeria: '🇩🇿', austria: '🇦🇹', jordan: '🇯🇴',
  // Group K
  portugal: '🇵🇹', 'dr-congo': '🇨🇩', uzbekistan: '🇺🇿', colombia: '🇨🇴',
  // Group L
  england: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', croatia: '🇭🇷', ghana: '🇬🇭', panama: '🇵🇦',
};

function matchOutcomes(
  homeId: string, homeLabel: string,
  awayId: string, awayLabel: string,
  homeWin: number, draw: number,
): StubOutcome[] {
  const awayWin = 100 - homeWin - draw;
  const hf = WC_FLAGS[homeId] ?? '';
  const af = WC_FLAGS[awayId] ?? '';
  return [
    { id: `${homeId}-win`, label: `${hf} ${homeLabel} Win`, flag: hf, probability: homeWin, change: null, midPrice: homeWin / 100, asks: [], bids: [] },
    { id: 'draw',          label: 'Draw',                               probability: draw,    change: null, midPrice: draw / 100,    asks: [], bids: [] },
    { id: `${awayId}-win`, label: `${af} ${awayLabel} Win`, flag: af, probability: awayWin, change: null, midPrice: awayWin / 100, asks: [], bids: [] },
  ];
}

function matchMarket(
  id: string, group: string, matchday: number, date: string, venue: string,
  homeId: string, homeLabel: string,
  awayId: string, awayLabel: string,
  homeWin: number, draw: number,
  volume: number, traders: number,
): StubMarket {
  const hf = WC_FLAGS[homeId] ?? '';
  const af = WC_FLAGS[awayId] ?? '';
  return {
    id,
    title: `${hf} ${homeLabel} vs ${af} ${awayLabel}`,
    description: `FIFA World Cup 2026 · Group ${group} Matchday ${matchday} · ${date} · ${venue}`,
    category: 'Sports',
    subcategory: 'Football',
    status: 'open',
    type: 'multiple_choice',
    closeDate: date,
    resolutionDate: date,
    volume,
    traders,
    icon: 'sports_soccer',
    iconColor: 'secondary',
    outcomes: matchOutcomes(homeId, homeLabel, awayId, awayLabel, homeWin, draw),
    resolutionSource: 'FIFA official match result (FIFA.com)',
    traderCount: traders,
  };
}

// ── WC 2026 Group Stage — all 72 matches ─────────────────────────────────────
// Schedule source: FIFA.com (draw: Dec 5, 2024)
// Probabilities: home win % / draw % / away win % = 100

export const WC2026_MATCHES: StubMarket[] = [

  // ── Group A: Mexico · South Africa · South Korea · Czech Republic ──
  matchMarket('wc26-a-md1-mex-zaf', 'A', 1, '2026-06-11', 'Estadio Azteca, Mexico City',      'mexico',       'Mexico',        'south-africa', 'South Africa',   65, 22, 1_420_000, 9_800),
  matchMarket('wc26-a-md1-kor-cze', 'A', 1, '2026-06-11', 'Estadio Akron, Guadalajara',       'south-korea',  'South Korea',   'czechia',      'Czech Republic', 42, 28,   480_000, 3_600),
  matchMarket('wc26-a-md2-cze-zaf', 'A', 2, '2026-06-18', 'Mercedes-Benz Stadium, Atlanta',   'czechia',      'Czech Republic','south-africa', 'South Africa',   47, 27,   210_000, 1_800),
  matchMarket('wc26-a-md2-mex-kor', 'A', 2, '2026-06-18', 'Estadio Akron, Guadalajara',       'mexico',       'Mexico',        'south-korea',  'South Korea',    55, 25,   980_000, 7_100),
  matchMarket('wc26-a-md3-cze-mex', 'A', 3, '2026-06-24', 'Estadio Azteca, Mexico City',      'czechia',      'Czech Republic','mexico',       'Mexico',         22, 25,   720_000, 5_200),
  matchMarket('wc26-a-md3-zaf-kor', 'A', 3, '2026-06-24', 'Estadio BBVA, Monterrey',          'south-africa', 'South Africa',  'south-korea',  'South Korea',    28, 28,   310_000, 2_400),

  // ── Group B: Canada · Bosnia & Herzegovina · Qatar · Switzerland ──
  matchMarket('wc26-b-md1-can-bih', 'B', 1, '2026-06-12', 'BMO Field, Toronto',               'canada',       'Canada',        'bosnia',       'Bosnia & Herz.', 48, 27,   540_000, 4_100),
  matchMarket('wc26-b-md1-qat-sui', 'B', 1, '2026-06-12', 'Levi\'s Stadium, Santa Clara',     'qatar',        'Qatar',         'switzerland',  'Switzerland',    22, 25,   390_000, 3_000),
  matchMarket('wc26-b-md2-sui-bih', 'B', 2, '2026-06-18', 'SoFi Stadium, Los Angeles',        'switzerland',  'Switzerland',   'bosnia',       'Bosnia & Herz.', 52, 26,   280_000, 2_100),
  matchMarket('wc26-b-md2-can-qat', 'B', 2, '2026-06-18', 'BC Place, Vancouver',              'canada',       'Canada',        'qatar',        'Qatar',          62, 22,   620_000, 4_600),
  matchMarket('wc26-b-md3-sui-can', 'B', 3, '2026-06-24', 'BC Place, Vancouver',              'switzerland',  'Switzerland',   'canada',       'Canada',         45, 28,   480_000, 3_500),
  matchMarket('wc26-b-md3-bih-qat', 'B', 3, '2026-06-24', 'Lumen Field, Seattle',             'bosnia',       'Bosnia & Herz.','qatar',        'Qatar',          45, 27,   160_000, 1_300),

  // ── Group C: Brazil · Morocco · Haiti · Scotland ──
  matchMarket('wc26-c-md1-bra-mar', 'C', 1, '2026-06-13', 'Gillette Stadium, Boston',         'brazil',       'Brazil',        'morocco',      'Morocco',        62, 22, 2_800_000, 21_000),
  matchMarket('wc26-c-md1-hai-sco', 'C', 1, '2026-06-13', 'MetLife Stadium, New York',        'haiti',        'Haiti',         'scotland',     'Scotland',       18, 22,   320_000, 2_600),
  matchMarket('wc26-c-md2-bra-hai', 'C', 2, '2026-06-19', 'Lincoln Financial Field, Phila.', 'brazil',       'Brazil',        'haiti',        'Haiti',          85, 11, 2_100_000, 15_000),
  matchMarket('wc26-c-md2-sco-mar', 'C', 2, '2026-06-19', 'Gillette Stadium, Boston',         'scotland',     'Scotland',      'morocco',      'Morocco',        35, 28,   580_000, 4_200),
  matchMarket('wc26-c-md3-sco-bra', 'C', 3, '2026-06-24', 'Hard Rock Stadium, Miami',         'scotland',     'Scotland',      'brazil',       'Brazil',          8, 17, 2_400_000, 18_000),
  matchMarket('wc26-c-md3-mar-hai', 'C', 3, '2026-06-24', 'Mercedes-Benz Stadium, Atlanta',   'morocco',      'Morocco',       'haiti',        'Haiti',          72, 18,   490_000, 3_700),

  // ── Group D: USA · Paraguay · Australia · Turkey ──
  matchMarket('wc26-d-md1-usa-par', 'D', 1, '2026-06-12', 'SoFi Stadium, Los Angeles',        'usa',          'USA',           'paraguay',     'Paraguay',       50, 25, 1_900_000, 14_000),
  matchMarket('wc26-d-md1-aus-tur', 'D', 1, '2026-06-12', 'BC Place, Vancouver',              'australia',    'Australia',     'turkey',       'Turkey',         35, 28,   420_000, 3_200),
  matchMarket('wc26-d-md2-tur-par', 'D', 2, '2026-06-19', 'Levi\'s Stadium, Santa Clara',     'turkey',       'Turkey',        'paraguay',     'Paraguay',       45, 27,   290_000, 2_200),
  matchMarket('wc26-d-md2-usa-aus', 'D', 2, '2026-06-19', 'Lumen Field, Seattle',             'usa',          'USA',           'australia',    'Australia',      55, 25, 1_400_000, 10_500),
  matchMarket('wc26-d-md3-tur-usa', 'D', 3, '2026-06-25', 'SoFi Stadium, Los Angeles',        'turkey',       'Turkey',        'usa',          'USA',            35, 27, 1_600_000, 12_000),
  matchMarket('wc26-d-md3-par-aus', 'D', 3, '2026-06-25', 'Levi\'s Stadium, Santa Clara',     'paraguay',     'Paraguay',      'australia',    'Australia',      42, 28,   270_000, 2_100),

  // ── Group E: Germany · Curaçao · Côte d'Ivoire · Ecuador ──
  matchMarket('wc26-e-md1-ger-cur', 'E', 1, '2026-06-14', 'Lincoln Financial Field, Phila.', 'germany',      'Germany',       'curacao',      'Curaçao',        85, 11, 2_600_000, 19_000),
  matchMarket('wc26-e-md1-civ-ecu', 'E', 1, '2026-06-14', 'NRG Stadium, Houston',             'ivory-coast',  'Côte d\'Ivoire','ecuador',      'Ecuador',        42, 28,   440_000, 3_400),
  matchMarket('wc26-e-md2-ger-civ', 'E', 2, '2026-06-19', 'BMO Field, Toronto',               'germany',      'Germany',       'ivory-coast',  'Côte d\'Ivoire', 62, 22, 1_800_000, 13_000),
  matchMarket('wc26-e-md2-ecu-cur', 'E', 2, '2026-06-19', 'Arrowhead Stadium, Kansas City',   'ecuador',      'Ecuador',       'curacao',      'Curaçao',        70, 18,   190_000, 1_500),
  matchMarket('wc26-e-md3-ecu-ger', 'E', 3, '2026-06-25', 'Lincoln Financial Field, Phila.', 'ecuador',      'Ecuador',       'germany',      'Germany',        18, 22, 1_700_000, 12_500),
  matchMarket('wc26-e-md3-cur-civ', 'E', 3, '2026-06-25', 'MetLife Stadium, New York',        'curacao',      'Curaçao',       'ivory-coast',  'Côte d\'Ivoire', 15, 22,   140_000, 1_100),

  // ── Group F: Netherlands · Japan · Sweden · Tunisia ──
  matchMarket('wc26-f-md1-ned-jpn', 'F', 1, '2026-06-14', 'AT&T Stadium, Dallas',             'netherlands',  'Netherlands',   'japan',        'Japan',          52, 26, 1_600_000, 12_000),
  matchMarket('wc26-f-md1-swe-tun', 'F', 1, '2026-06-14', 'Estadio BBVA, Monterrey',          'sweden',       'Sweden',        'tunisia',      'Tunisia',        55, 25,   360_000, 2_800),
  matchMarket('wc26-f-md2-ned-swe', 'F', 2, '2026-06-20', 'NRG Stadium, Houston',             'netherlands',  'Netherlands',   'sweden',       'Sweden',         48, 27,   920_000, 7_000),
  matchMarket('wc26-f-md2-tun-jpn', 'F', 2, '2026-06-20', 'Estadio BBVA, Monterrey',          'tunisia',      'Tunisia',       'japan',        'Japan',          30, 28,   520_000, 4_000),
  matchMarket('wc26-f-md3-tun-ned', 'F', 3, '2026-06-25', 'AT&T Stadium, Dallas',             'tunisia',      'Tunisia',       'netherlands',  'Netherlands',    12, 20, 1_100_000, 8_200),
  matchMarket('wc26-f-md3-jpn-swe', 'F', 3, '2026-06-25', 'Arrowhead Stadium, Kansas City',   'japan',        'Japan',         'sweden',       'Sweden',         42, 28,   680_000, 5_100),

  // ── Group G: Belgium · Egypt · Iran · New Zealand ──
  matchMarket('wc26-g-md1-bel-egy', 'G', 1, '2026-06-15', 'SoFi Stadium, Los Angeles',        'belgium',      'Belgium',       'egypt',        'Egypt',          60, 22, 1_200_000, 9_000),
  matchMarket('wc26-g-md1-irn-nzl', 'G', 1, '2026-06-15', 'Lumen Field, Seattle',             'iran',         'Iran',          'new-zealand',  'New Zealand',    48, 27,   210_000, 1_700),
  matchMarket('wc26-g-md2-bel-irn', 'G', 2, '2026-06-21', 'SoFi Stadium, Los Angeles',        'belgium',      'Belgium',       'iran',         'Iran',           65, 20, 1_050_000, 7_800),
  matchMarket('wc26-g-md2-nzl-egy', 'G', 2, '2026-06-21', 'BC Place, Vancouver',              'new-zealand',  'New Zealand',   'egypt',        'Egypt',          32, 28,   240_000, 1_900),
  matchMarket('wc26-g-md3-nzl-bel', 'G', 3, '2026-06-26', 'Lumen Field, Seattle',             'new-zealand',  'New Zealand',   'belgium',      'Belgium',         8, 17,   870_000, 6_500),
  matchMarket('wc26-g-md3-egy-irn', 'G', 3, '2026-06-26', 'BC Place, Vancouver',              'egypt',        'Egypt',         'iran',         'Iran',           42, 28,   340_000, 2_600),

  // ── Group H: Spain · Cape Verde · Saudi Arabia · Uruguay ──
  matchMarket('wc26-h-md1-esp-cpv', 'H', 1, '2026-06-15', 'Hard Rock Stadium, Miami',         'spain',        'Spain',         'cape-verde',   'Cape Verde',     82, 12, 2_400_000, 18_000),
  matchMarket('wc26-h-md1-ksa-uru', 'H', 1, '2026-06-15', 'Mercedes-Benz Stadium, Atlanta',   'saudi-arabia', 'Saudi Arabia',  'uruguay',      'Uruguay',        30, 27,   680_000, 5_200),
  matchMarket('wc26-h-md2-esp-ksa', 'H', 2, '2026-06-21', 'Hard Rock Stadium, Miami',         'spain',        'Spain',         'saudi-arabia', 'Saudi Arabia',   70, 18, 2_100_000, 16_000),
  matchMarket('wc26-h-md2-uru-cpv', 'H', 2, '2026-06-21', 'Mercedes-Benz Stadium, Atlanta',   'uruguay',      'Uruguay',       'cape-verde',   'Cape Verde',     72, 18,   490_000, 3_800),
  matchMarket('wc26-h-md3-uru-esp', 'H', 3, '2026-06-26', 'NRG Stadium, Houston',             'uruguay',      'Uruguay',       'spain',        'Spain',          20, 23, 2_200_000, 17_000),
  matchMarket('wc26-h-md3-cpv-ksa', 'H', 3, '2026-06-26', 'Estadio Akron, Guadalajara',       'cape-verde',   'Cape Verde',    'saudi-arabia', 'Saudi Arabia',   32, 27,   180_000, 1_400),

  // ── Group I: France · Senegal · Iraq · Norway ──
  matchMarket('wc26-i-md1-fra-sen', 'I', 1, '2026-06-16', 'MetLife Stadium, New York',        'france',       'France',        'senegal',      'Senegal',        58, 24, 2_700_000, 20_000),
  matchMarket('wc26-i-md1-irq-nor', 'I', 1, '2026-06-16', 'Gillette Stadium, Boston',         'iraq',         'Iraq',          'norway',       'Norway',         25, 25,   420_000, 3_200),
  matchMarket('wc26-i-md2-fra-irq', 'I', 2, '2026-06-22', 'MetLife Stadium, New York',        'france',       'France',        'iraq',         'Iraq',           80, 13, 2_300_000, 17_000),
  matchMarket('wc26-i-md2-nor-sen', 'I', 2, '2026-06-22', 'Lincoln Financial Field, Phila.', 'norway',       'Norway',        'senegal',      'Senegal',        45, 27,   580_000, 4_400),
  matchMarket('wc26-i-md3-nor-fra', 'I', 3, '2026-06-26', 'Gillette Stadium, Boston',         'norway',       'Norway',        'france',       'France',         20, 23, 2_500_000, 19_000),
  matchMarket('wc26-i-md3-sen-irq', 'I', 3, '2026-06-26', 'BMO Field, Toronto',               'senegal',      'Senegal',       'iraq',         'Iraq',           55, 25,   360_000, 2_800),

  // ── Group J: Argentina · Algeria · Austria · Jordan ──
  matchMarket('wc26-j-md1-arg-dza', 'J', 1, '2026-06-16', 'Arrowhead Stadium, Kansas City',   'argentina',    'Argentina',     'algeria',      'Algeria',        70, 18, 2_900_000, 22_000),
  matchMarket('wc26-j-md1-aut-jor', 'J', 1, '2026-06-16', 'Levi\'s Stadium, Santa Clara',     'austria',      'Austria',       'jordan',       'Jordan',         62, 22,   280_000, 2_200),
  matchMarket('wc26-j-md2-arg-aut', 'J', 2, '2026-06-22', 'AT&T Stadium, Dallas',             'argentina',    'Argentina',     'austria',      'Austria',        60, 22, 2_400_000, 18_000),
  matchMarket('wc26-j-md2-jor-dza', 'J', 2, '2026-06-22', 'Levi\'s Stadium, Santa Clara',     'jordan',       'Jordan',        'algeria',      'Algeria',        32, 28,   240_000, 1_900),
  matchMarket('wc26-j-md3-jor-arg', 'J', 3, '2026-06-27', 'Arrowhead Stadium, Kansas City',   'jordan',       'Jordan',        'argentina',    'Argentina',       6, 14, 2_600_000, 20_000),
  matchMarket('wc26-j-md3-dza-aut', 'J', 3, '2026-06-27', 'AT&T Stadium, Dallas',             'algeria',      'Algeria',       'austria',      'Austria',        35, 27,   310_000, 2_400),

  // ── Group K: Portugal · DR Congo · Uzbekistan · Colombia ──
  matchMarket('wc26-k-md1-por-cod', 'K', 1, '2026-06-17', 'NRG Stadium, Houston',             'portugal',     'Portugal',      'dr-congo',     'DR Congo',       72, 18, 2_000_000, 15_000),
  matchMarket('wc26-k-md1-uzb-col', 'K', 1, '2026-06-17', 'Estadio Azteca, Mexico City',      'uzbekistan',   'Uzbekistan',    'colombia',     'Colombia',       22, 25, 1_100_000, 8_200),
  matchMarket('wc26-k-md2-por-uzb', 'K', 2, '2026-06-23', 'NRG Stadium, Houston',             'portugal',     'Portugal',      'uzbekistan',   'Uzbekistan',     78, 14, 1_800_000, 13_500),
  matchMarket('wc26-k-md2-col-cod', 'K', 2, '2026-06-23', 'Estadio Akron, Guadalajara',       'colombia',     'Colombia',      'dr-congo',     'DR Congo',       58, 24,   820_000, 6_200),
  matchMarket('wc26-k-md3-col-por', 'K', 3, '2026-06-27', 'Hard Rock Stadium, Miami',         'colombia',     'Colombia',      'portugal',     'Portugal',       18, 22, 1_900_000, 14_000),
  matchMarket('wc26-k-md3-cod-uzb', 'K', 3, '2026-06-27', 'Mercedes-Benz Stadium, Atlanta',   'dr-congo',     'DR Congo',      'uzbekistan',   'Uzbekistan',     42, 28,   210_000, 1_700),

  // ── Group L: England · Croatia · Ghana · Panama ──
  matchMarket('wc26-l-md1-eng-cro', 'L', 1, '2026-06-17', 'BMO Field, Toronto',               'england',      'England',       'croatia',      'Croatia',        52, 26, 2_500_000, 19_000),
  matchMarket('wc26-l-md1-gha-pan', 'L', 1, '2026-06-17', 'AT&T Stadium, Dallas',             'ghana',        'Ghana',         'panama',       'Panama',         45, 27,   280_000, 2_200),
  matchMarket('wc26-l-md2-eng-gha', 'L', 2, '2026-06-23', 'Gillette Stadium, Boston',         'england',      'England',       'ghana',        'Ghana',          70, 18, 2_100_000, 16_000),
  matchMarket('wc26-l-md2-pan-cro', 'L', 2, '2026-06-23', 'BMO Field, Toronto',               'panama',       'Panama',        'croatia',      'Croatia',        25, 25,   340_000, 2_600),
  matchMarket('wc26-l-md3-pan-eng', 'L', 3, '2026-06-27', 'MetLife Stadium, New York',        'panama',       'Panama',        'england',      'England',         8, 17, 2_200_000, 17_000),
  matchMarket('wc26-l-md3-cro-gha', 'L', 3, '2026-06-27', 'Lincoln Financial Field, Phila.', 'croatia',      'Croatia',       'ghana',        'Ghana',          52, 26,   540_000, 4_100),
];

// ── Markets ─────────────────────────────────────────────────────────────────

export const STUB_MARKETS: StubMarket[] = [
  // ── World Cup 2026 Winner (all 48 qualified teams) ────────────────────────
  {
    id: 'world-cup-2026',
    title: '🏆 Who will win the FIFA World Cup 2026?',
    description:
      'This market resolves based on the official winner of the FIFA World Cup 2026, as determined by FIFA. The tournament runs June 11 – July 19, 2026, co-hosted by the United States, Canada, and Mexico. 48 teams compete across 12 groups.\n\nIn the event of disqualification or technical resolution, TEN IQ MARKETS will follow the official tournament podium. All trades are final upon the official trophy presentation.',
    category: 'Sports',
    subcategory: 'Football',
    status: 'open',
    type: 'multiple_choice',
    closeDate: '2026-07-19',
    resolutionDate: '2026-07-20',
    volume: 18_400_000,
    traders: 58_200,
    icon: 'emoji_events',
    iconColor: 'secondary',
    outcomes: [
      // ── Tier 1: tournament favourites ──
      { id: 'brazil',        label: '🇧🇷 Brazil',          flag: '🇧🇷', probability: 17,   change:  1.2, midPrice: 0.170, asks: [{ price: 0.185, size: 1240, cumulative: 1240 }, { price: 0.195, size: 2500, cumulative: 3740 }, { price: 0.200, size: 4200, cumulative: 7940 }], bids: [{ price: 0.160, size: 3800, cumulative: 3800 }, { price: 0.155, size: 1900, cumulative: 5700 }, { price: 0.150, size: 6100, cumulative: 11800 }] },
      { id: 'france',        label: '🇫🇷 France',          flag: '🇫🇷', probability: 15,   change: -0.4, midPrice: 0.150, asks: [{ price: 0.165, size:  980, cumulative:  980 }, { price: 0.170, size: 2150, cumulative: 3130 }, { price: 0.175, size: 3400, cumulative: 6530 }], bids: [{ price: 0.140, size: 2800, cumulative: 2800 }, { price: 0.135, size: 1650, cumulative: 4450 }, { price: 0.130, size: 5200, cumulative: 9650 }] },
      { id: 'argentina',     label: '🇦🇷 Argentina',       flag: '🇦🇷', probability: 12,   change:  null, midPrice: 0.120, asks: [{ price: 0.135, size: 1520, cumulative: 1520 }, { price: 0.140, size: 2000, cumulative: 3520 }, { price: 0.145, size: 3100, cumulative: 6620 }], bids: [{ price: 0.110, size: 2600, cumulative: 2600 }, { price: 0.105, size: 1400, cumulative: 4000 }, { price: 0.100, size: 4500, cumulative: 8500 }] },
      { id: 'england',       label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', probability: 10,   change: -1.1, midPrice: 0.100, asks: [{ price: 0.115, size:  820, cumulative:  820 }, { price: 0.120, size: 1800, cumulative: 2620 }, { price: 0.125, size: 2750, cumulative: 5370 }], bids: [{ price: 0.090, size: 2300, cumulative: 2300 }, { price: 0.085, size: 1100, cumulative: 3400 }, { price: 0.080, size: 3950, cumulative: 7350 }] },
      { id: 'germany',       label: '🇩🇪 Germany',         flag: '🇩🇪', probability:  9,   change:  0.2, midPrice: 0.090, asks: [], bids: [] },
      { id: 'spain',         label: '🇪🇸 Spain',           flag: '🇪🇸', probability:  8,   change:  0.5, midPrice: 0.080, asks: [], bids: [] },
      // ── Tier 2 ──
      { id: 'portugal',      label: '🇵🇹 Portugal',        flag: '🇵🇹', probability:  5,   change:  0.3, midPrice: 0.050, asks: [], bids: [] },
      { id: 'netherlands',   label: '🇳🇱 Netherlands',     flag: '🇳🇱', probability:  4,   change: -0.2, midPrice: 0.040, asks: [], bids: [] },
      { id: 'belgium',       label: '🇧🇪 Belgium',         flag: '🇧🇪', probability:  3,   change:  null, midPrice: 0.030, asks: [], bids: [] },
      { id: 'uruguay',       label: '🇺🇾 Uruguay',         flag: '🇺🇾', probability:  2,   change:  null, midPrice: 0.020, asks: [], bids: [] },
      { id: 'colombia',      label: '🇨🇴 Colombia',        flag: '🇨🇴', probability:  2,   change:  null, midPrice: 0.020, asks: [], bids: [] },
      { id: 'croatia',       label: '🇭🇷 Croatia',         flag: '🇭🇷', probability:  2,   change:  null, midPrice: 0.020, asks: [], bids: [] },
      // ── Tier 3 ──
      { id: 'morocco',       label: '🇲🇦 Morocco',         flag: '🇲🇦', probability:  1,   change:  null, midPrice: 0.010, asks: [], bids: [] },
      { id: 'switzerland',   label: '🇨🇭 Switzerland',     flag: '🇨🇭', probability:  1,   change:  null, midPrice: 0.010, asks: [], bids: [] },
      { id: 'japan',         label: '🇯🇵 Japan',           flag: '🇯🇵', probability:  1,   change:  null, midPrice: 0.010, asks: [], bids: [] },
      { id: 'norway',        label: '🇳🇴 Norway',          flag: '🇳🇴', probability:  1,   change:  null, midPrice: 0.010, asks: [], bids: [] },
      { id: 'south-korea',   label: '🇰🇷 South Korea',     flag: '🇰🇷', probability:  0.5, change:  null, midPrice: 0.005, asks: [], bids: [] },
      { id: 'ecuador',       label: '🇪🇨 Ecuador',         flag: '🇪🇨', probability:  0.5, change:  null, midPrice: 0.005, asks: [], bids: [] },
      { id: 'senegal',       label: '🇸🇳 Senegal',         flag: '🇸🇳', probability:  0.5, change:  null, midPrice: 0.005, asks: [], bids: [] },
      { id: 'turkey',        label: '🇹🇷 Turkey',          flag: '🇹🇷', probability:  0.5, change:  null, midPrice: 0.005, asks: [], bids: [] },
      { id: 'australia',     label: '🇦🇺 Australia',       flag: '🇦🇺', probability:  0.5, change:  null, midPrice: 0.005, asks: [], bids: [] },
      { id: 'austria',       label: '🇦🇹 Austria',         flag: '🇦🇹', probability:  0.5, change:  null, midPrice: 0.005, asks: [], bids: [] },
      // ── Tier 4 ──
      { id: 'mexico',        label: '🇲🇽 Mexico',          flag: '🇲🇽', probability:  0.3, change:  null, midPrice: 0.003, asks: [], bids: [] },
      { id: 'algeria',       label: '🇩🇿 Algeria',         flag: '🇩🇿', probability:  0.3, change:  null, midPrice: 0.003, asks: [], bids: [] },
      { id: 'sweden',        label: '🇸🇪 Sweden',          flag: '🇸🇪', probability:  0.3, change:  null, midPrice: 0.003, asks: [], bids: [] },
      { id: 'usa',           label: '🇺🇸 USA',             flag: '🇺🇸', probability:  0.3, change:  null, midPrice: 0.003, asks: [], bids: [] },
      { id: 'ivory-coast',   label: '🇨🇮 Côte d\'Ivoire',  flag: '🇨🇮', probability:  0.2, change:  null, midPrice: 0.002, asks: [], bids: [] },
      { id: 'ghana',         label: '🇬🇭 Ghana',           flag: '🇬🇭', probability:  0.2, change:  null, midPrice: 0.002, asks: [], bids: [] },
      { id: 'egypt',         label: '🇪🇬 Egypt',           flag: '🇪🇬', probability:  0.2, change:  null, midPrice: 0.002, asks: [], bids: [] },
      { id: 'iran',          label: '🇮🇷 Iran',            flag: '🇮🇷', probability:  0.2, change:  null, midPrice: 0.002, asks: [], bids: [] },
      { id: 'czechia',       label: '🇨🇿 Czech Republic',  flag: '🇨🇿', probability:  0.2, change:  null, midPrice: 0.002, asks: [], bids: [] },
      { id: 'paraguay',      label: '🇵🇾 Paraguay',        flag: '🇵🇾', probability:  0.2, change:  null, midPrice: 0.002, asks: [], bids: [] },
      // ── Tier 5: long shots ──
      { id: 'canada',        label: '🇨🇦 Canada',          flag: '🇨🇦', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'scotland',      label: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland',       flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'bosnia',        label: '🇧🇦 Bosnia & Herz.',  flag: '🇧🇦', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'south-africa',  label: '🇿🇦 South Africa',    flag: '🇿🇦', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'saudi-arabia',  label: '🇸🇦 Saudi Arabia',    flag: '🇸🇦', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'tunisia',       label: '🇹🇳 Tunisia',         flag: '🇹🇳', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'dr-congo',      label: '🇨🇩 DR Congo',        flag: '🇨🇩', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'panama',        label: '🇵🇦 Panama',          flag: '🇵🇦', probability:  0.1, change:  null, midPrice: 0.001, asks: [], bids: [] },
      { id: 'haiti',         label: '🇭🇹 Haiti',           flag: '🇭🇹', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
      { id: 'qatar',         label: '🇶🇦 Qatar',           flag: '🇶🇦', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
      { id: 'new-zealand',   label: '🇳🇿 New Zealand',     flag: '🇳🇿', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
      { id: 'cape-verde',    label: '🇨🇻 Cape Verde',      flag: '🇨🇻', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
      { id: 'iraq',          label: '🇮🇶 Iraq',            flag: '🇮🇶', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
      { id: 'jordan',        label: '🇯🇴 Jordan',          flag: '🇯🇴', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
      { id: 'uzbekistan',    label: '🇺🇿 Uzbekistan',      flag: '🇺🇿', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
      { id: 'curacao',       label: '🇨🇼 Curaçao',         flag: '🇨🇼', probability:  0.05, change: null, midPrice: 0.0005, asks: [], bids: [] },
    ],
    resolutionSource: 'Official FIFA Tournament Results (FIFA.com)',
    traderCount: 58200,
  },

  // ── All 72 WC 2026 group stage match markets ──────────────────────────────
  ...WC2026_MATCHES,

  // ── Crypto markets ────────────────────────────────────────────────────────
  {
    id: 'btc-ath',
    title: 'Will BTC reach a new ATH before the end of Q4?',
    description:
      'This market resolves YES if Bitcoin (BTC) reaches a new all-time high price (above $73,750) before December 31, 2025, as reported by CoinGecko.',
    category: 'Crypto',
    subcategory: 'Bitcoin',
    status: 'open',
    type: 'binary',
    closeDate: '2025-12-31',
    resolutionDate: '2026-01-03',
    volume: 2_400_000,
    traders: 18_420,
    icon: 'currency_bitcoin',
    iconColor: 'primary',
    outcomes: binaryOutcomes(68, 0.68),
    resolutionSource: 'CoinGecko — BTC/USD All-Time High',
    traderCount: 18420,
  },
  {
    id: 'eth-price',
    title: 'Price of ETH at EOY 2025',
    description:
      'What will be the closing price range of Ethereum (ETH/USD) on December 31, 2025?',
    category: 'Crypto',
    subcategory: 'Ethereum',
    status: 'open',
    type: 'multiple_choice',
    closeDate: '2025-12-31',
    resolutionDate: '2026-01-02',
    volume: 2_100_000,
    traders: 31_400,
    icon: 'currency_bitcoin',
    iconColor: 'primary',
    outcomes: [
      { id: '3k-4k',    label: '$3k – $4k',  probability: 51, change:  2.1, midPrice: 0.51, asks: [], bids: [] },
      { id: '4k-5k',    label: '$4k – $5k',  probability: 28, change: -1.2, midPrice: 0.28, asks: [], bids: [] },
      { id: 'above-5k', label: 'Above $5k',  probability: 14, change:  0.5, midPrice: 0.14, asks: [], bids: [] },
      { id: 'below-3k', label: 'Below $3k',  probability:  7, change: -1.4, midPrice: 0.07, asks: [], bids: [] },
    ],
    resolutionSource: 'CoinGecko — ETH/USD closing price',
    traderCount: 31400,
  },

  // ── Tech markets ──────────────────────────────────────────────────────────
  {
    id: 'starship',
    title: 'Starship Integrated Flight 5 Launch?',
    description:
      'Resolves YES if SpaceX successfully completes Starship Integrated Flight Test 5 with booster catch before October 31, 2025.',
    category: 'Tech',
    subcategory: 'Space',
    status: 'open',
    type: 'binary',
    closeDate: '2025-10-31',
    resolutionDate: '2025-11-01',
    volume: 412_500,
    traders: 3_240,
    icon: 'rocket_launch',
    iconColor: 'primary',
    outcomes: binaryOutcomes(82, 0.82),
    resolutionSource: 'SpaceX official press release',
    traderCount: 3240,
  },

  // ── Entertainment markets ─────────────────────────────────────────────────
  {
    id: 'golden-globes',
    title: 'Golden Globes: Best Drama Series?',
    description:
      'Which series will win Best Television Series – Drama at the 83rd Golden Globe Awards?',
    category: 'Entertainment',
    subcategory: 'Awards',
    status: 'open',
    type: 'binary',
    closeDate: '2026-01-05',
    resolutionDate: '2026-01-06',
    volume: 88_200,
    traders: 1_120,
    icon: 'theater_comedy',
    iconColor: 'tertiary',
    outcomes: binaryOutcomes(34, 0.34),
    resolutionSource: 'Hollywood Foreign Press Association official results',
    traderCount: 1120,
  },

  // ── Sports markets ────────────────────────────────────────────────────────
  {
    id: 'premier-league',
    title: 'Premier League Winner 2024/25',
    description: 'Which club will win the 2024–25 Premier League title?',
    category: 'Sports',
    subcategory: 'Football',
    status: 'open',
    type: 'multiple_choice',
    closeDate: '2025-05-25',
    resolutionDate: '2025-05-26',
    volume: 1_200_000,
    traders: 22_800,
    icon: 'stadium',
    iconColor: 'secondary',
    outcomes: [
      { id: 'man-city', label: 'Man City', probability: 42, change:  1.5, midPrice: 0.42, asks: [{ price: 0.44, size: 900, cumulative: 900 }, { price: 0.45, size: 1800, cumulative: 2700 }], bids: [{ price: 0.41, size: 1100, cumulative: 1100 }, { price: 0.40, size: 2200, cumulative: 3300 }] },
      { id: 'arsenal',  label: 'Arsenal',  probability: 35, change: -0.8, midPrice: 0.35, asks: [{ price: 0.37, size: 750,  cumulative: 750  }, { price: 0.38, size: 1400, cumulative: 2150 }], bids: [{ price: 0.34, size:  900, cumulative:  900 }, { price: 0.33, size: 1800, cumulative: 2700 }] },
      { id: 'liverpool',label: 'Liverpool',probability: 18, change:  0.3, midPrice: 0.18, asks: [], bids: [] },
      { id: 'other',    label: 'Other',    probability:  5, change:  null, midPrice: 0.05, asks: [], bids: [] },
    ],
    resolutionSource: 'Premier League official website',
    traderCount: 22800,
  },

  // ── Politics markets ──────────────────────────────────────────────────────
  {
    id: 'uk-eu',
    title: 'Will the UK rejoin the EU Single Market by 2030?',
    description:
      'Resolves YES if the United Kingdom officially rejoins the EU Single Market through any formal agreement before January 1, 2030.',
    category: 'Politics',
    subcategory: 'Global Affairs',
    status: 'open',
    type: 'binary',
    closeDate: '2029-12-31',
    resolutionDate: '2030-01-05',
    volume: 5_200_000,
    traders: 14_200,
    icon: 'public',
    iconColor: 'primary',
    outcomes: binaryOutcomes(18, 0.18),
    resolutionSource: 'UK Government official announcement and EU Council confirmation',
    traderCount: 14200,
  },
  {
    id: 'us-election',
    title: 'Will the 2026 US Presidential Election be decided by < 50 Electoral Votes?',
    description:
      'Resolves YES if the margin of victory in the 2026 US Presidential Election is fewer than 50 Electoral College votes.',
    category: 'Politics',
    subcategory: 'U.S. Elections',
    status: 'open',
    type: 'binary',
    closeDate: '2026-11-03',
    resolutionDate: '2026-12-15',
    volume: 12_800_000,
    traders: 41_000,
    icon: 'how_to_vote',
    iconColor: 'primary',
    outcomes: binaryOutcomes(42, 0.42),
    resolutionSource: 'Associated Press official election call',
    traderCount: 41000,
  },
  {
    id: 'ai-regulation',
    title: 'Will Congress pass a comprehensive AI Regulation Act before Jan 2027?',
    description:
      'Resolves YES if the US Congress passes and the President signs a comprehensive federal AI regulation bill before January 1, 2027.',
    category: 'Politics',
    subcategory: 'Legislative',
    status: 'open',
    type: 'binary',
    closeDate: '2026-12-31',
    resolutionDate: '2027-01-05',
    volume: 3_100_000,
    traders: 8_900,
    icon: 'gavel',
    iconColor: 'primary',
    outcomes: binaryOutcomes(64, 0.64),
    resolutionSource: 'US Congressional Record and official White House signing statement',
    traderCount: 8900,
  },
  {
    id: 'g7-cbdc',
    title: 'Will any G7 nation adopt a Central Bank Digital Currency (CBDC) by 2027?',
    description:
      'Resolves YES if any G7 nation (US, UK, Canada, France, Germany, Italy, Japan) officially launches a retail CBDC before January 1, 2027.',
    category: 'Politics',
    subcategory: 'Economics',
    status: 'open',
    type: 'binary',
    closeDate: '2026-12-31',
    resolutionDate: '2027-01-07',
    volume: 8_700_000,
    traders: 19_500,
    icon: 'query_stats',
    iconColor: 'primary',
    outcomes: binaryOutcomes(29, 0.29),
    resolutionSource: 'Official central bank announcements from G7 nations',
    traderCount: 19500,
  },

  // ── Admin-visible markets (non-open states) ───────────────────────────────
  {
    id: 'fed-rate-cut-draft',
    title: 'Will the Fed cut rates in Q3 2026?',
    description: 'Resolves YES if the Federal Reserve cuts the federal funds rate at least once during Q3 2026 (July–September).',
    category: 'Economics',
    subcategory: 'Monetary Policy',
    status: 'draft',
    type: 'binary',
    closeDate: '2026-09-30',
    resolutionDate: '2026-10-05',
    volume: 0,
    traders: 0,
    icon: 'account_balance',
    iconColor: 'primary',
    outcomes: binaryOutcomes(55, 0.55),
    resolutionSource: 'Federal Reserve FOMC official statement',
    traderCount: 0,
  },
  {
    id: 'nba-finals-draft',
    title: 'NBA Finals 2026 Winner',
    description: 'Which team will win the 2026 NBA Championship?',
    category: 'Sports',
    subcategory: 'Basketball',
    status: 'draft',
    type: 'multiple_choice',
    closeDate: '2026-06-01',
    resolutionDate: '2026-06-25',
    volume: 0,
    traders: 0,
    icon: 'sports_basketball',
    iconColor: 'secondary',
    outcomes: [
      { id: 'boston', label: 'Boston Celtics',       probability: 28, change: null, midPrice: 0.28, asks: [], bids: [] },
      { id: 'denver', label: 'Denver Nuggets',       probability: 22, change: null, midPrice: 0.22, asks: [], bids: [] },
      { id: 'gsw',    label: 'Golden State Warriors',probability: 18, change: null, midPrice: 0.18, asks: [], bids: [] },
      { id: 'other',  label: 'Other',                probability: 32, change: null, midPrice: 0.32, asks: [], bids: [] },
    ],
    resolutionSource: 'NBA official website',
    traderCount: 0,
  },
  {
    id: 'oscar-best-picture-closed',
    title: 'Oscars 2026: Best Picture Winner',
    description: 'Which film will win Best Picture at the 98th Academy Awards?',
    category: 'Entertainment',
    subcategory: 'Awards',
    status: 'closed',
    type: 'binary',
    closeDate: '2026-03-15',
    resolutionDate: '2026-03-16',
    volume: 340_000,
    traders: 4_200,
    icon: 'movie',
    iconColor: 'tertiary',
    outcomes: binaryOutcomes(61, 0.61),
    resolutionSource: 'Academy of Motion Picture Arts and Sciences',
    traderCount: 4200,
  },
  {
    id: 'btc-100k-resolved',
    title: 'Will BTC hit $100K before end of 2025?',
    description: 'Resolves YES if Bitcoin (BTC/USD) reaches $100,000 on any major exchange before December 31, 2025.',
    category: 'Crypto',
    subcategory: 'Bitcoin',
    status: 'resolved',
    type: 'binary',
    closeDate: '2025-12-31',
    resolutionDate: '2026-01-02',
    volume: 18_400_000,
    traders: 62_100,
    icon: 'currency_bitcoin',
    iconColor: 'primary',
    outcomes: binaryOutcomes(100, 1.0),
    resolutionSource: 'CoinGecko — BTC/USD',
    traderCount: 62100,
  },
  {
    id: 'eth-etf-1b-finalized',
    title: 'Will Ethereum ETFs see $1B net inflows in Q1 2026?',
    description: 'Resolves YES if the cumulative net inflows across all US spot Ethereum ETFs exceed $1,000,000,000 between January 1 and March 31, 2026, as reported by Bloomberg ETF data.',
    category: 'Crypto',
    subcategory: 'Ethereum',
    status: 'finalized',
    type: 'binary',
    closeDate: '2026-03-31',
    resolutionDate: '2026-04-02',
    volume: 4_200_000,
    traders: 9_800,
    icon: 'currency_exchange',
    iconColor: 'secondary',
    outcomes: binaryOutcomes(100, 1.0),
    resolutionSource: 'Bloomberg ETF flow data — cumulative Q1 2026',
    traderCount: 9800,
  },
  {
    id: 'france-elections-cancelled',
    title: 'France snap elections before July 2026?',
    description: 'Resolves YES if France holds snap legislative elections before July 1, 2026.',
    category: 'Politics',
    subcategory: 'Global Affairs',
    status: 'cancelled',
    type: 'binary',
    closeDate: '2026-06-30',
    resolutionDate: '2026-07-05',
    volume: 92_000,
    traders: 1_800,
    icon: 'how_to_vote',
    iconColor: 'primary',
    outcomes: binaryOutcomes(35, 0.35),
    resolutionSource: 'French government official announcement',
    traderCount: 1800,
  },

  // ── Science markets ───────────────────────────────────────────────────────
  {
    id: 'h5n1-pheic-2026',
    title: 'Will the WHO declare H5N1 a PHEIC before 31 December 2026?',
    description:
      'Resolves YES if the World Health Organization formally declares H5N1 influenza a Public Health Emergency of International Concern (PHEIC) before December 31, 2026. A PHEIC requires a convened Emergency Committee recommendation accepted by the WHO Director-General. Resolves NO if no such declaration is made by market close.',
    category: 'Science',
    subcategory: 'Health',
    status: 'open',
    type: 'binary',
    closeDate: '2026-12-30',
    resolutionDate: '2026-12-31',
    volume: 1_840_000,
    traders: 14_200,
    icon: 'health_and_safety',
    iconColor: 'secondary',
    outcomes: binaryOutcomes(28, 0.28),
    resolutionSource: 'WHO official declaration (who.int/emergencies)',
    traderCount: 14200,
  },

  // ── Current Events markets ────────────────────────────────────────────────
  {
    id: 'hormuz-reopen-jun30',
    title: 'Will the Strait of Hormuz open before 30 June?',
    description:
      'Resolves YES if the Strait of Hormuz is confirmed fully open to commercial shipping before June 30, 2026, as reported by official statements from the US Navy, UKMTO, or a comparable maritime authority. Partial re-openings or temporary ceasefires do not constitute resolution.',
    category: 'Current Events',
    subcategory: 'Geopolitics',
    status: 'open',
    type: 'binary',
    closeDate: '2026-06-29',
    resolutionDate: '2026-06-30',
    volume: 3_140_000,
    traders: 24_600,
    icon: 'water',
    iconColor: 'primary',
    outcomes: binaryOutcomes(40, 0.40),
    resolutionSource: 'US Navy 5th Fleet / UKMTO official statements',
    traderCount: 24600,
  },
  {
    id: 'brent-150-jul31',
    title: 'Will Brent Crude Oil be above US$150 on 31 July?',
    description:
      'Resolves YES if the ICE Brent Crude Oil front-month futures settlement price is strictly above US$150.00 per barrel on July 31, 2026. If July 31 is not a trading day, the nearest prior trading day settlement price is used.',
    category: 'Current Events',
    subcategory: 'Energy',
    status: 'open',
    type: 'binary',
    closeDate: '2026-07-30',
    resolutionDate: '2026-07-31',
    volume: 2_870_000,
    traders: 19_300,
    icon: 'oil_barrel',
    iconColor: 'tertiary',
    outcomes: binaryOutcomes(35, 0.35),
    resolutionSource: 'ICE Brent Crude Oil futures settlement price (ICE.com)',
    traderCount: 19300,
  },
];

// ── Trending sidebar ─────────────────────────────────────────────────────────

export const TRENDING_ITEMS = [
  { id: 'us-election',   title: 'Will the US Presidential Election be decided by < 50 Electoral Votes?', probability: 42, volume: 12_800_000 },
  { id: 'world-cup-2026',title: 'Who will win the FIFA World Cup 2026?',                                 probability: 17, volume: 18_400_000 },
  { id: 'btc-ath',       title: 'Bitcoin ATH before end of Q4?',                                         probability: 68, volume: 2_400_000  },
];

// ── Closing soon sidebar ─────────────────────────────────────────────────────

export const CLOSING_SOON_ITEMS = [
  { id: 'starship',      title: 'Starship Flight 5 Success?',             probability: 82, timeLeft: '14h 22m' },
  { id: 'btc-ath',       title: 'Fed Rate Cut in November?',              probability: 91, timeLeft: '1d 08h'  },
  { id: 'golden-globes', title: 'Oscars: Best Picture Winner?',           probability: 34, timeLeft: '2d 05h'  },
];

// ── Category definitions ─────────────────────────────────────────────────────

export const NAV_CATEGORIES = [
  { label: 'Trending',        path: '/',                              icon: 'local_fire_department' },
  { label: 'Current Events',  path: '/markets?category=Current+Events', icon: 'newspaper'          },
  { label: 'Politics',        path: '/markets?category=Politics',    icon: 'how_to_vote'           },
  { label: 'Sports',          path: '/markets?category=Sports',      icon: 'sports_soccer'         },
  { label: 'Crypto',          path: '/markets?category=Crypto',      icon: 'currency_bitcoin'      },
  { label: 'Tech',            path: '/markets?category=Tech',        icon: 'computer'              },
  { label: 'Economics',       path: '/markets?category=Economics',   icon: 'trending_up'           },
  { label: 'Entertainment',   path: '/markets?category=Entertainment',icon: 'movie'                },
  { label: 'Science',         path: '/markets?category=Science',     icon: 'science'               },
];

export const CATEGORY_SUBCATEGORIES: Record<string, { label: string; icon: string }[]> = {
  Politics: [
    { label: 'U.S. Elections', icon: 'how_to_vote' },
    { label: 'Global Affairs', icon: 'public'      },
    { label: 'Legislative',    icon: 'gavel'        },
    { label: 'Polling',        icon: 'query_stats'  },
  ],
  Sports: [
    { label: 'Football',   icon: 'sports_soccer'    },
    { label: 'Basketball', icon: 'sports_basketball'},
    { label: 'Tennis',     icon: 'sports_tennis'    },
    { label: 'Baseball',   icon: 'sports_baseball'  },
  ],
  Crypto: [
    { label: 'Bitcoin',  icon: 'currency_bitcoin' },
    { label: 'Ethereum', icon: 'currency_bitcoin' },
    { label: 'Altcoins', icon: 'paid'             },
    { label: 'DeFi',     icon: 'account_balance'  },
  ],
  Tech: [
    { label: 'AI & ML',  icon: 'psychology'      },
    { label: 'Space',    icon: 'rocket_launch'    },
    { label: 'Gaming',   icon: 'sports_esports'   },
    { label: 'Startups', icon: 'lightbulb'        },
  ],
  Entertainment: [
    { label: 'Awards', icon: 'emoji_events' },
    { label: 'Movies', icon: 'movie'        },
    { label: 'Music',  icon: 'music_note'   },
    { label: 'TV',     icon: 'tv'           },
  ],
  'Current Events': [
    { label: 'Geopolitics', icon: 'public'           },
    { label: 'Energy',      icon: 'oil_barrel'       },
    { label: 'Conflict',    icon: 'crisis_alert'     },
    { label: 'Economy',     icon: 'trending_up'      },
  ],
  Science: [
    { label: 'Health',   icon: 'health_and_safety' },
    { label: 'Space',    icon: 'rocket_launch'     },
    { label: 'Climate',  icon: 'thermostat'        },
    { label: 'Biology',  icon: 'biotech'           },
  ],
};

// ── Profile stub ─────────────────────────────────────────────────────────────

export type StubPosition = {
  marketId: string;
  marketTitle: string;
  category: string;
  outcome: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  closeDate: string;
};

export type StubTrade = {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: string;
  side: 'buy' | 'sell';
  shares: number;
  price: number;
  fee: number;
  timestamp: string; // ISO
};

export const STUB_POSITIONS: StubPosition[] = [
  {
    marketId: 'btc-ath',
    marketTitle: 'Will BTC reach a new ATH before the end of Q4?',
    category: 'Crypto',
    outcome: 'Yes',
    shares: 500,
    avgPrice: 0.62,
    currentPrice: 0.68,
    closeDate: '2025-12-31',
  },
  {
    marketId: 'world-cup-2026',
    marketTitle: 'Who will win the FIFA World Cup 2026?',
    category: 'Sports',
    outcome: '🇧🇷 Brazil',
    shares: 200,
    avgPrice: 0.14,
    currentPrice: 0.17,
    closeDate: '2026-07-19',
  },
  {
    marketId: 'us-election',
    marketTitle: 'Will the 2026 US Presidential Election be decided by < 50 Electoral Votes?',
    category: 'Politics',
    outcome: 'No',
    shares: 150,
    avgPrice: 0.56,
    currentPrice: 0.58,
    closeDate: '2026-11-03',
  },
  {
    marketId: 'ai-regulation',
    marketTitle: 'Will Congress pass a comprehensive AI Regulation Act before Jan 2027?',
    category: 'Politics',
    outcome: 'Yes',
    shares: 80,
    avgPrice: 0.60,
    currentPrice: 0.64,
    closeDate: '2026-12-31',
  },
];

export const STUB_TRADE_HISTORY: StubTrade[] = [
  {
    id: 't1',
    marketId: 'btc-ath',
    marketTitle: 'Will BTC reach a new ATH before the end of Q4?',
    outcome: 'Yes',
    side: 'buy',
    shares: 300,
    price: 0.64,
    fee: 0.96,
    timestamp: '2026-04-20T14:32:00Z',
  },
  {
    id: 't2',
    marketId: 'world-cup-2026',
    marketTitle: 'Who will win the FIFA World Cup 2026?',
    outcome: '🇧🇷 Brazil',
    side: 'buy',
    shares: 200,
    price: 0.14,
    fee: 0.14,
    timestamp: '2026-04-18T09:15:00Z',
  },
  {
    id: 't3',
    marketId: 'btc-ath',
    marketTitle: 'Will BTC reach a new ATH before the end of Q4?',
    outcome: 'Yes',
    side: 'buy',
    shares: 200,
    price: 0.60,
    fee: 0.60,
    timestamp: '2026-04-15T11:44:00Z',
  },
  {
    id: 't4',
    marketId: 'premier-league',
    marketTitle: 'Premier League Winner 2024/25',
    outcome: 'Man City',
    side: 'sell',
    shares: 120,
    price: 0.44,
    fee: 0.26,
    timestamp: '2026-04-10T16:20:00Z',
  },
  {
    id: 't5',
    marketId: 'us-election',
    marketTitle: '2026 US Presidential Election — < 50 Electoral Votes margin?',
    outcome: 'No',
    side: 'buy',
    shares: 150,
    price: 0.56,
    fee: 0.42,
    timestamp: '2026-04-08T08:05:00Z',
  },
  {
    id: 't6',
    marketId: 'starship',
    marketTitle: 'Starship Integrated Flight 5 Launch?',
    outcome: 'Yes',
    side: 'buy',
    shares: 100,
    price: 0.78,
    fee: 0.39,
    timestamp: '2026-04-02T19:30:00Z',
  },
  {
    id: 't7',
    marketId: 'ai-regulation',
    marketTitle: 'Will Congress pass a comprehensive AI Regulation Act before Jan 2027?',
    outcome: 'Yes',
    side: 'buy',
    shares: 80,
    price: 0.60,
    fee: 0.24,
    timestamp: '2026-03-28T13:10:00Z',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getMarketById(id: string): StubMarket | undefined {
  return STUB_MARKETS.find((m) => m.id === id);
}

export function getMarketsByCategory(category: string): StubMarket[] {
  if (!category || category === 'All') return STUB_MARKETS;
  return STUB_MARKETS.filter((m) => m.category === category);
}

export function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export function formatTraders(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function formatTimeLeft(closeDate: string): string {
  const diff = new Date(closeDate).getTime() - Date.now();
  if (diff <= 0) return 'Closed';
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ── Resolution & dispute stub data ───────────────────────────────────────────

export const STUB_RESOLUTIONS: StubResolution[] = [
  {
    marketId: 'btc-100k-resolved',
    winningOutcomeId: 'yes',
    resolverName: 'Moderator #12',
    resolvedAt: '2026-04-27T10:00:00Z',
    evidenceUrl: 'https://www.coingecko.com/en/coins/bitcoin',
    notes: 'BTC/USD reached $100,247 on December 5, 2024 per CoinGecko. Price sustained above $100k on Binance and Coinbase for over 1 hour.',
  },
  {
    marketId: 'eth-etf-1b-finalized',
    winningOutcomeId: 'yes',
    resolverName: 'Moderator #7',
    resolvedAt: '2026-04-02T16:00:00Z',
    evidenceUrl: 'https://www.bloomberg.com/crypto',
    notes: 'Cumulative Q1 2026 net inflows reached $1.34B per Bloomberg ETF flow data as of March 31, 2026. Dispute window closed April 3 with no challenges filed.',
  },
];

export const STUB_DISPUTES: StubDispute[] = [
  {
    id: 'dispute-1',
    marketId: 'btc-100k-resolved',
    disputer: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    reason: 'The resolution used an incorrect data source. The price only briefly touched $100k on a low-liquidity exchange and did not sustain the level on major exchanges like Binance or Coinbase.',
    suggestedOutcomeId: 'no',
    status: 'pending',
    disputedAt: '2026-04-27T14:22:00Z',
  },
];

export function getResolutionForMarket(marketId: string): StubResolution | undefined {
  return STUB_RESOLUTIONS.find((r) => r.marketId === marketId);
}

export function getDisputesForMarket(marketId: string): StubDispute[] {
  return STUB_DISPUTES.filter((d) => d.marketId === marketId);
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
