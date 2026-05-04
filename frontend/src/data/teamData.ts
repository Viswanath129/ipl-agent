// IPL Team Data with realistic sponsor data and jersey colors

export interface SponsorZone {
  zone: string;
  label: string;
  sponsor: string;
  visibility_score: number;
  estimated_value: string;
  camera_exposure: string;
  fan_recall: string;
  color: string;
}

export interface TeamData {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  gradient: [string, string];
  neonGlow: string;
  sponsors: SponsorZone[];
  totalSponsorValue: string;
  brandScore: number;
  frontImage: string;
  backImage: string;
}

export const teams: TeamData[] = [
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    primaryColor: '#FFC107',
    secondaryColor: '#1A237E',
    accentColor: '#FFD54F',
    textColor: '#1A237E',
    gradient: ['#FFC107', '#FF8F00'],
    neonGlow: '#FFC107',
    totalSponsorValue: '₹158 Cr',
    brandScore: 96,
    frontImage: '/assets/jerseys/csk/front.png',
    backImage: '/assets/jerseys/csk/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'India Cements', visibility_score: 95, estimated_value: '₹45 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#FFC107' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Myntra', visibility_score: 88, estimated_value: '₹32 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#FF6B6B' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Gulf Oil', visibility_score: 72, estimated_value: '₹18 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#FF9800' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'TVS Eurogrip', visibility_score: 70, estimated_value: '₹16 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#4CAF50' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'Snitch', visibility_score: 55, estimated_value: '₹12 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#9C27B0' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'News9', visibility_score: 40, estimated_value: '₹8 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#00BCD4' },
      { zone: 'collar', label: 'Collar', sponsor: 'Amrutanjan', visibility_score: 35, estimated_value: '₹5 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#E91E63' },
    ]
  },
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    primaryColor: '#004BA0',
    secondaryColor: '#D4AF37',
    accentColor: '#1565C0',
    textColor: '#FFFFFF',
    gradient: ['#004BA0', '#0D47A1'],
    neonGlow: '#2196F3',
    totalSponsorValue: '₹172 Cr',
    brandScore: 98,
    frontImage: '/assets/jerseys/mi/front.png',
    backImage: '/assets/jerseys/mi/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'Marriott Bonvoy', visibility_score: 96, estimated_value: '₹48 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#D4AF37' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Samsung', visibility_score: 90, estimated_value: '₹35 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#1428A0' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Astral Pipes', visibility_score: 74, estimated_value: '₹20 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#FF5722' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'Campa Cola', visibility_score: 71, estimated_value: '₹18 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#E91E63' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'Astroglide', visibility_score: 52, estimated_value: '₹14 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#FF9800' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'DBS', visibility_score: 38, estimated_value: '₹9 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#4CAF50' },
      { zone: 'collar', label: 'Collar', sponsor: 'Jio', visibility_score: 33, estimated_value: '₹6 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#03A9F4' },
    ]
  },
  {
    id: 'rcb',
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    primaryColor: '#EC1C24',
    secondaryColor: '#000000',
    accentColor: '#D4AF37',
    textColor: '#FFFFFF',
    gradient: ['#EC1C24', '#B71C1C'],
    neonGlow: '#FF1744',
    totalSponsorValue: '₹162 Cr',
    brandScore: 97,
    frontImage: '/assets/jerseys/rcb/front.png',
    backImage: '/assets/jerseys/rcb/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'Muthoot Fincorp', visibility_score: 94, estimated_value: '₹42 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#D4AF37' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Puma', visibility_score: 92, estimated_value: '₹38 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#EC1C24' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Jio', visibility_score: 75, estimated_value: '₹22 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#1565C0' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'Exide', visibility_score: 68, estimated_value: '₹15 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#388E3C' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'Kingfisher', visibility_score: 58, estimated_value: '₹15 Cr', camera_exposure: 'low', fan_recall: 'moderate', color: '#F44336' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'CRED', visibility_score: 42, estimated_value: '₹10 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#9C27B0' },
      { zone: 'collar', label: 'Collar', sponsor: 'PayTM', visibility_score: 30, estimated_value: '₹5 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#00BCD4' },
    ]
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    primaryColor: '#3A225D',
    secondaryColor: '#D4AF37',
    accentColor: '#7B1FA2',
    textColor: '#D4AF37',
    gradient: ['#3A225D', '#6A1B9A'],
    neonGlow: '#CE93D8',
    totalSponsorValue: '₹140 Cr',
    brandScore: 92,
    frontImage: '/assets/jerseys/kkr/front.png',
    backImage: '/assets/jerseys/kkr/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'Lux Cozi', visibility_score: 93, estimated_value: '₹38 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#D4AF37' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'My11Circle', visibility_score: 86, estimated_value: '₹30 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#FF6B6B' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'ACE', visibility_score: 70, estimated_value: '₹16 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#FF9800' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'JK Lakshmi', visibility_score: 65, estimated_value: '₹14 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#4CAF50' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'Noise', visibility_score: 50, estimated_value: '₹12 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#3F51B5' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'Kent', visibility_score: 36, estimated_value: '₹8 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#009688' },
      { zone: 'collar', label: 'Collar', sponsor: 'Rasna', visibility_score: 28, estimated_value: '₹4 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#E91E63' },
    ]
  },
  {
    id: 'srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    primaryColor: '#FF822A',
    secondaryColor: '#000000',
    accentColor: '#F57C00',
    textColor: '#000000',
    gradient: ['#FF822A', '#E65100'],
    neonGlow: '#FF9800',
    totalSponsorValue: '₹128 Cr',
    brandScore: 88,
    frontImage: '/assets/jerseys/srh/front.png',
    backImage: '/assets/jerseys/srh/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'JK Lakshmi Cement', visibility_score: 91, estimated_value: '₹35 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#FF822A' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Adidas', visibility_score: 85, estimated_value: '₹28 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#000000' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Ralco Tyres', visibility_score: 68, estimated_value: '₹15 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#F44336' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'Capital First', visibility_score: 64, estimated_value: '₹12 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#2196F3' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'Kent Water', visibility_score: 48, estimated_value: '₹10 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#4CAF50' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'PlayerzPot', visibility_score: 35, estimated_value: '₹7 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#9C27B0' },
      { zone: 'collar', label: 'Collar', sponsor: 'SRH Fans', visibility_score: 25, estimated_value: '₹3 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#00BCD4' },
    ]
  },
  {
    id: 'rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    primaryColor: '#EA1A85',
    secondaryColor: '#254AA5',
    accentColor: '#FF4081',
    textColor: '#FFFFFF',
    gradient: ['#EA1A85', '#AD1457'],
    neonGlow: '#FF4081',
    totalSponsorValue: '₹132 Cr',
    brandScore: 89,
    frontImage: '/assets/jerseys/rr/front.png',
    backImage: '/assets/jerseys/rr/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'Red Bull', visibility_score: 94, estimated_value: '₹40 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#EA1A85' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Adidas', visibility_score: 87, estimated_value: '₹30 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#254AA5' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Jio', visibility_score: 71, estimated_value: '₹16 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#1565C0' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'Colgate', visibility_score: 66, estimated_value: '₹13 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#F44336' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'Dream11', visibility_score: 52, estimated_value: '₹11 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#FF9800' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'Fashion TV', visibility_score: 37, estimated_value: '₹7 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#9C27B0' },
      { zone: 'collar', label: 'Collar', sponsor: 'Star', visibility_score: 27, estimated_value: '₹4 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#FF5722' },
    ]
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    primaryColor: '#1C1C2B',
    secondaryColor: '#D4AF37',
    accentColor: '#FFD54F',
    textColor: '#D4AF37',
    gradient: ['#1C1C2B', '#0D0D1A'],
    neonGlow: '#D4AF37',
    totalSponsorValue: '₹136 Cr',
    brandScore: 90,
    frontImage: '/assets/jerseys/gt/front.png',
    backImage: '/assets/jerseys/gt/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'Navi', visibility_score: 92, estimated_value: '₹36 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#D4AF37' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Adidas', visibility_score: 88, estimated_value: '₹32 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#1C1C2B' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'TATA', visibility_score: 73, estimated_value: '₹18 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#2196F3' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'Toothsi', visibility_score: 67, estimated_value: '₹14 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#4CAF50' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'CRED', visibility_score: 51, estimated_value: '₹11 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#9C27B0' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'Boat', visibility_score: 38, estimated_value: '₹8 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#FF5722' },
      { zone: 'collar', label: 'Collar', sponsor: 'Jio', visibility_score: 30, estimated_value: '₹5 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#03A9F4' },
    ]
  },
  {
    id: 'pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    primaryColor: '#ED1B24',
    secondaryColor: '#A7A9AC',
    accentColor: '#FFFFFF',
    textColor: '#000000',
    gradient: ['#ED1B24', '#C62828'],
    neonGlow: '#FF1744',
    totalSponsorValue: '₹118 Cr',
    brandScore: 85,
    frontImage: '/assets/jerseys/pbks/front.png',
    backImage: '/assets/jerseys/pbks/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'EbixCash', visibility_score: 89, estimated_value: '₹32 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#ED1B24' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Nike', visibility_score: 84, estimated_value: '₹26 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#A7A9AC' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Exide', visibility_score: 66, estimated_value: '₹14 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#388E3C' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'JK Super', visibility_score: 62, estimated_value: '₹12 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#1565C0' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'BKT Tyres', visibility_score: 46, estimated_value: '₹10 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#FF9800' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'Swiggy', visibility_score: 34, estimated_value: '₹6 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#FF5722' },
      { zone: 'collar', label: 'Collar', sponsor: 'Angel One', visibility_score: 26, estimated_value: '₹3 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#9C27B0' },
    ]
  },
  {
    id: 'dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    primaryColor: '#004C93',
    secondaryColor: '#EF1B23',
    accentColor: '#1976D2',
    textColor: '#FFFFFF',
    gradient: ['#004C93', '#01579B'],
    neonGlow: '#42A5F5',
    totalSponsorValue: '₹142 Cr',
    brandScore: 91,
    frontImage: '/assets/jerseys/dc/front.png',
    backImage: '/assets/jerseys/dc/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'JSW', visibility_score: 93, estimated_value: '₹40 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#004C93' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Adidas', visibility_score: 87, estimated_value: '₹30 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#EF1B23' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Optimistix', visibility_score: 69, estimated_value: '₹16 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#FF9800' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'ACE', visibility_score: 65, estimated_value: '₹13 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#4CAF50' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'GMR', visibility_score: 53, estimated_value: '₹12 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#3F51B5' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'Toothsi', visibility_score: 39, estimated_value: '₹8 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#009688' },
      { zone: 'collar', label: 'Collar', sponsor: 'PayTM', visibility_score: 29, estimated_value: '₹5 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#00BCD4' },
    ]
  },
  {
    id: 'lsg',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    primaryColor: '#A72056',
    secondaryColor: '#FFCC00',
    accentColor: '#CE225C',
    textColor: '#FFFFFF',
    gradient: ['#A72056', '#880E4F'],
    neonGlow: '#FF4081',
    totalSponsorValue: '₹125 Cr',
    brandScore: 87,
    frontImage: '/assets/jerseys/lsg/front.png',
    backImage: '/assets/jerseys/lsg/back.png',
    sponsors: [
      { zone: 'front_chest', label: 'Front Chest', sponsor: 'My11Circle', visibility_score: 90, estimated_value: '₹34 Cr', camera_exposure: 'very high', fan_recall: 'strong', color: '#A72056' },
      { zone: 'front_center', label: 'Front Center', sponsor: 'Nike', visibility_score: 85, estimated_value: '₹28 Cr', camera_exposure: 'high', fan_recall: 'strong', color: '#FFCC00' },
      { zone: 'right_sleeve', label: 'Right Sleeve', sponsor: 'Bajaj Finserv', visibility_score: 70, estimated_value: '₹16 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#1565C0' },
      { zone: 'left_sleeve', label: 'Left Sleeve', sponsor: 'RPSG', visibility_score: 63, estimated_value: '₹12 Cr', camera_exposure: 'medium', fan_recall: 'moderate', color: '#388E3C' },
      { zone: 'upper_back', label: 'Upper Back', sponsor: 'Dream11', visibility_score: 49, estimated_value: '₹10 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#FF9800' },
      { zone: 'lower_back', label: 'Lower Back', sponsor: 'Boat', visibility_score: 36, estimated_value: '₹7 Cr', camera_exposure: 'low', fan_recall: 'weak', color: '#9C27B0' },
      { zone: 'collar', label: 'Collar', sponsor: 'Star', visibility_score: 27, estimated_value: '₹4 Cr', camera_exposure: 'very low', fan_recall: 'minimal', color: '#FF5722' },
    ]
  },
];

// Match simulation data
export interface MatchPhase {
  phase: string;
  duration: number;
  zoneExposure: Record<string, number>;
  description: string;
}

export const matchPhases: MatchPhase[] = [
  {
    phase: 'Batting Close-up',
    duration: 4000,
    zoneExposure: { front_chest: 98, front_center: 95, right_sleeve: 85, left_sleeve: 80, upper_back: 10, lower_back: 5, collar: 60 },
    description: 'Batsman facing camera — front sponsors dominate screen time'
  },
  {
    phase: 'Bowling Action',
    duration: 3000,
    zoneExposure: { front_chest: 40, front_center: 35, right_sleeve: 90, left_sleeve: 65, upper_back: 75, lower_back: 60, collar: 30 },
    description: 'Bowler run-up — back & sleeves get maximum exposure'
  },
  {
    phase: 'Fielding',
    duration: 3500,
    zoneExposure: { front_chest: 60, front_center: 55, right_sleeve: 70, left_sleeve: 70, upper_back: 80, lower_back: 75, collar: 25 },
    description: 'Wide-angle fielding shots — back sponsors visible at distance'
  },
  {
    phase: 'Crowd Celebration',
    duration: 2500,
    zoneExposure: { front_chest: 95, front_center: 90, right_sleeve: 50, left_sleeve: 50, upper_back: 15, lower_back: 10, collar: 70 },
    description: 'Celebration shots — front of jersey dominates with tight frames'
  },
  {
    phase: 'Boundary Hit',
    duration: 2000,
    zoneExposure: { front_chest: 85, front_center: 80, right_sleeve: 90, left_sleeve: 40, upper_back: 20, lower_back: 15, collar: 45 },
    description: 'Batting follow-through — dynamic motion highlights right sleeve'
  },
  {
    phase: 'Wicket Fall',
    duration: 3000,
    zoneExposure: { front_chest: 70, front_center: 65, right_sleeve: 60, left_sleeve: 55, upper_back: 85, lower_back: 80, collar: 35 },
    description: 'Walking back to pavilion — back sponsors get sustained exposure'
  },
];

export const getTeamByBrand = (brandName: string): TeamData | undefined => {
  const brand = brandName.toLowerCase();
  if (brand.includes('india cements') || brand.includes('csk') || brand.includes('amrutanjan') || brand.includes('tvs') || brand.includes('gulf')) return teams.find(t => t.id === 'csk');
  if (brand.includes('marriott') || brand.includes('mi') || brand.includes('samsung') || brand.includes('astral') || brand.includes('jio')) return teams.find(t => t.id === 'mi');
  if (brand.includes('muthoot') || brand.includes('rcb') || brand.includes('puma') || brand.includes('kingfisher') || brand.includes('cred')) return teams.find(t => t.id === 'rcb');
  if (brand.includes('lux') || brand.includes('kkr') || brand.includes('my11circle') || brand.includes('noise')) return teams.find(t => t.id === 'kkr');
  if (brand.includes('jk lakshmi') || brand.includes('srh') || brand.includes('adidas')) return teams.find(t => t.id === 'srh');
  if (brand.includes('red bull') || brand.includes('rr') || brand.includes('colgate') || brand.includes('dream11')) return teams.find(t => t.id === 'rr');
  if (brand.includes('navi') || brand.includes('gt') || brand.includes('tata') || brand.includes('boat')) return teams.find(t => t.id === 'gt');
  if (brand.includes('ebixcash') || brand.includes('pbks') || brand.includes('nike') || brand.includes('bkt')) return teams.find(t => t.id === 'pbks');
  if (brand.includes('jsw') || brand.includes('dc')) return teams.find(t => t.id === 'dc');
  if (brand.includes('rpsg') || brand.includes('lsg')) return teams.find(t => t.id === 'lsg');
  return teams.find(t => t.id === 'mi'); // Default
};
