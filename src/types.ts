export type CampaignId = 'I' | 'II' | 'III';

export type MapType = 'std' | 'sec' | 'omega';

export interface MapData {
  id: number;
  name: string;
  desc: string;
  theme?: string;
  baseThreat?: number;
}

export interface DifficultyData {
  id: 'easy' | 'hard' | 'extreme' | 'nightmare' | 'endless' | 'abyss';
  name: string;
  stages: number;
  startSanity: number;
  items: number;
  revives: number;
  checkpoints: number;
  twisted: boolean;
  winChance: number;
  findChance: number;
  enemyMultiplier: number;
  hazardMultiplier: number;
  corruptionDecay?: boolean;
  corruptionDecayThreshold?: number; // Minimum sanity % required to trigger decay (e.g., 70%)
  corruptionDecayInterval?: number; // Milliseconds per tick
}

export interface ItemData {
  id: string;
  name: string;
  desc: string;
  secret: boolean;
  category?: 'passive' | 'active' | 'relic';
}

export interface AchievementData {
  id: string;
  name: string;
  desc: string;
  secret: boolean;
}

export type HazardType = 
  | 'PRESSURE_SURGE'
  | 'RADIATION_PULSE'
  | 'TOXIC_VENT'
  | 'CRYO_LEAK'
  | 'SEISMIC_SHOCK'
  | 'VOID_DISTORTION'
  | 'ELECTRICAL_ARC'
  | 'ACOUSTIC_FEEDBACK';

export type EnemyThreatLevel = 
  | 'DORMANT'
  | 'SPARSE'
  | 'PATROLLING'
  | 'PACK_HUNT'
  | 'SWARMING'
  | 'APEX_STALKER'
  | 'COGNITIVE_NIGHTMARE';

export interface GearSynergy {
  id: string;
  name: string;
  tag: string;
  relics: [string, string];
  relicNames: [string, string];
  desc: string;
  flavor: string;
  combatEffect: string;
  sanityDelta: number;
  corruptDelta: number;
  bonusScore: number;
  winChance: number;
  hazardMitigation?: boolean;
  secretUnlock?: boolean;
}

export interface TacticalOption {
  id: string;
  title: string;
  tag?: string;
  flavor: string;
  category: 'combat' | 'stealth' | 'neutralize' | 'relic' | 'gamble' | 'sacrifice' | 'echo' | 'synergy';
  riskLabel: string;
  sanityDelta: number;
  corruptDelta: number;
  oxygenDelta?: number;
  noiseDelta?: number;
  bonusScore?: number;
  winChance: number;
  secretUnlock?: boolean;
  hazardMitigation?: boolean;
  relicRequired?: string;
  memoryEcho?: boolean;
  synergyName?: string;
  synergyRelics?: string[];
  synergyBonusDesc?: string;
}

export interface AudioLayersConfig {
  ambientWind: boolean;
  neuralStatic: boolean;
  hostileClicking: boolean;
  subBassDrone: boolean;
  interfaceSFX: boolean;
}

export interface HazardStatus {
  type: HazardType;
  severity: number; // 1 to 5
  name: string;
  desc: string;
  active: boolean;
}

export interface EnemyStatus {
  threatLevel: EnemyThreatLevel;
  densityScore: number; // 0 to 100
  name: string;
  active: boolean;
  aggressionName: string;
}

export interface StoryArcState {
  trust: number;
  knowledge: number;
  noise: number;
  omens: number;
  flags: string[];
  lastChoice: number | null;
}

export interface RunHistoryItem {
  stage: number;
  choiceTitle: string;
  success: boolean;
  sanity: number;
  corrupt: number;
  score: number;
  enemyThreat: string;
  hazardName?: string;
}

export interface GameStats {
  runs: number;
  wins: number;
  deaths: number;
  choices: number;
  chambersCleared: number;
  sanityLost: number;
  itemsFound: number;
  secretsFound: number;
  score: number;
}
