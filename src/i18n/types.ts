export type SupportedLanguage = 
  | 'en' 
  | 'es' 
  | 'ja' 
  | 'fr' 
  | 'de' 
  | 'it' 
  | 'pt' 
  | 'ru' 
  | 'zh' 
  | 'ko' 
  | 'pl' 
  | 'tr' 
  | 'ar' 
  | 'hi' 
  | 'uk';

export type Language = SupportedLanguage;

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag?: string;
}

export interface TranslationDictionary {
  // Index signature for dynamic access & safety
  [key: string]: string | undefined;

  // Common UI & Buttons
  appTitle: string;
  appSubtitle: string;
  appEdition: string;
  appDescription: string;
  btnInitialize: string;
  btnSelectCampaign: string;
  btnDifficultyMatrix: string;
  btnTacticalLoadout: string;
  btnItemArchive: string;
  btnPlayerAnalytics: string;
  btnTormentLogs: string;
  btnSurvivalGuide: string;
  btnKernelSettings: string;
  btnBackToTerminal: string;
  btnReturnToTerminal: string;
  btnRetryDescent: string;
  btnResumeDescent: string;
  btnAbandonDescent: string;
  btnCloseKernel: string;
  btnEquip: string;
  btnUnequip: string;
  btnDeploy: string;
  btnLocked: string;
  btnDeployOmega: string;
  btnStartInteractiveTutorial: string;
  btnLaunchBonusHacking: string;
  btnUnlockBonusGame: string;
  btnResetData: string;

  // Sector Matrix & Campaign Hub
  campaignHubTitle: string;
  campaignHubDesc: string;
  campaign1Title: string;
  campaign1Tag: string;
  campaign1Desc: string;
  btnEnterCampaign1: string;
  campaign2Title: string;
  campaign2Tag: string;
  campaign2Desc: string;
  btnEnterCampaign2: string;
  campaign3Title: string;
  campaign3Tag: string;
  campaign3Desc: string;
  btnEnterCampaign3: string;
  selectMapDescent: string;
  tabStandardSectors: string;
  tabSecretAnomalies: string;
  tabOmegaNexus: string;
  omegaNullityTitle: string;
  omegaNullityDesc: string;
  omegaLockedReq: string;
  baseLevel: string;

  // Loadout & Vault
  loadoutVaultTitle: string;
  loadoutCapacity: string;
  loadoutActiveSynergiesTitle: string;
  loadoutEquippedRelicsTitle: string;
  loadoutEmptyHint: string;
  loadoutArchiveTitle: string;
  loadoutArchiveDesc: string;
  filterAll: string;
  filterPassives: string;
  filterActives: string;
  filterRelics: string;
  itemSecretHidden: string;
  itemSecretUndiscovered: string;

  // Difficulties
  diffMatrixTitle: string;
  diffMatrixDesc: string;
  diffStageCount: string;
  diffStartSanity: string;
  diffItemSlots: string;
  diffRevives: string;
  diffCheckpoints: string;
  diffHostileDensity: string;
  diffHazardSeverity: string;
  diffCorruptionDecay?: string;
  diffSelectedBadge: string;
  diffActiveBadge: string;
  diffLockedBadge: string;

  // HUD & Telemetry
  hudNeuralStability: string;
  hudAbyssalCorruption: string;
  hudCorruptionDecayActive?: string;
  hudCorruptionDecayStandby?: string;
  hudCorruptionDecayBadge?: string;
  hudChamber: string;
  hudScore: string;
  hudMultiplier: string;
  hudThreatMeter: string;
  hudThreatLevel1: string; // Minimal / Stable Crust
  hudThreatLevel2: string; // Elevated / Patrol Phase
  hudThreatLevel3: string; // Severe / Swarm Packs
  hudThreatLevel4: string; // Critical / Abyssal Apex
  hudThreatLevel5: string; // Apex Lethal / Void Collapse
  hudSubChamberDepth: string;
  hudSubHostileDensity: string;
  hudSubActiveHazard: string;
  hudBtnPause: string;
  hudBtnHeal: string;
  hudBtnGear: string;
  hudBtnGuide: string;
  hudBtnSave: string;

  // Warnings & Story
  warningEntityCritical: string;
  warningAmbientHazard: string;
  warningSeverity: string;
  warningSynergyActive: string;
  warningBuffsEngaged: string;
  tacticalPromptTitle: string;
  keyboardPrompt: string;

  // Option categories
  categoryCombat: string;
  categoryStealth: string;
  categoryHazard: string;
  categoryRelic: string;
  categoryGamble: string;
  categoryEcho: string;
  categorySynergy: string;
  riskSanity: string;
  riskCorruption: string;
  riskScore: string;
  riskChance: string;

  // Stats Modal
  statsModalTitle: string;
  statsModalDesc: string;
  statsCareerRuns: string;
  statsSuccessfulExtractions: string;
  statsPsychologicalCollapses: string;
  statsTotalChambers: string;
  statsAvgChambersPerRun: string;
  statsTotalSanityBleed: string;
  statsAvgSanityPerRun: string;
  statsArtifactsDiscovered: string;
  statsSecretMapsFound: string;
  statsOmegaNexusStatus: string;
  statsOmegaOnline: string;
  statsOmegaLocked: string;
  statsTacticalChoicesMade: string;

  // Torment Logs & Achievements
  achModalTitle: string;
  achModalDesc: string;
  achCompleted: string;
  achLocked: string;
  achHiddenTitle: string;
  achHiddenDesc: string;

  // Survival Guide
  guideModalTitle: string;
  guideStep1Title: string;
  guideStep1Desc: string;
  guideStep2Title: string;
  guideStep2Desc: string;
  guideStep3Title: string;
  guideStep3Desc: string;
  guideStep4Title: string;
  guideStep4Desc: string;
  guideStep5Title?: string;
  guideStep5Desc?: string;

  // Kernel Settings
  settingsModalTitle: string;
  settingsVolume: string;
  settingsLanguage: string;
  soundscapeTitle?: string;
  soundscapeDesc?: string;
  layerAmbientWindTitle?: string;
  layerAmbientWindDesc?: string;
  layerNeuralStaticTitle?: string;
  layerNeuralStaticDesc?: string;
  layerHostileClickingTitle?: string;
  layerHostileClickingDesc?: string;
  layerSubBassDroneTitle?: string;
  layerSubBassDroneDesc?: string;
  layerInterfaceSFXTitle?: string;
  layerInterfaceSFXDesc?: string;
  layerActive?: string;
  layerMuted?: string;
  btnPreviewLayer?: string;

  // Pause Modal
  pauseModalTitle: string;
  pauseModalDesc: string;

  // Comparison Chart / Death & Victory Screen
  chartHeader: string;
  chartStatusExtracted: string;
  chartStatusTerminated: string;
  chartRunsLogged: string;
  chartThisDescent: string;
  chartCareerAverage: string;
  chartSanityTitle: string;
  chartSanitySub: string;
  chartBelowAvgBleed: string;
  chartAboveAvgBleed: string;
  chartSanityBleedLabel: string;
  chartAvgBleedLabel: string;
  chartChamberTitle: string;
  chartChamberSub: string;
  chartChambersDeeper: string;
  chartShorterDescent: string;
  chartChambersClearedLabel: string;
  chartAvgChambersLabel: string;
  chartAttritionPerChamber: string;
  chartMissionScore: string;
  chartTacticalEfficiency: string;
  chartClassSurvivor: string;
  chartDeepCombatant: string;
  chartAttritionCasualty: string;

  // Death / Victory overlay
  victoryTitle: string;
  victoryDesc: string;
  deathCollapseTitle: string;
  deathCorruptionTitle: string;

  // Bonus Game
  bonusModalTitle: string;
  bonusModalSubtitle: string;
  bonusInstructions: string;
  bonusEnergy: string;
  bonusSignal: string;
  bonusHeat: string;
  bonusTurn: string;
  bonusBtnScan: string;
  bonusBtnTune: string;
  bonusBtnCool: string;
  bonusBtnHide: string;
  bonusBtnBoost: string;
  bonusBtnDecode: string;
  bonusWonTitle: string;
  bonusWonDesc: string;
  bonusLostTitle: string;
  bonusLostDesc: string;

  // Toasts
  toastSaved: string;
  toastQuickHeal: string;
  toastQuickHealNone: string;
  toastAchievementUnlocked: string;
  toastRelicFound: string;
  toastCheckpointSaved: string;
  toastCheckpointRevive: string;
  toastSynergyTriggered: string;
  toastLowSanityWarning: string;
}

export type TranslationKey = keyof TranslationDictionary;
