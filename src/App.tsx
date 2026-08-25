import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CampaignId, 
  MapType, 
  DifficultyData, 
  TacticalOption, 
  GameStats,
  AudioLayersConfig 
} from './types';
import { 
  MAPS_BY_CAMPAIGN 
} from './data/maps';
import { ITEMS_CATALOG } from './data/items';
import { DIFFICULTIES, ACHIEVEMENTS_CATALOG } from './data/difficulties';
import { AudioManager, DEFAULT_AUDIO_LAYERS } from './audio/audioManager';
import { VisualFXCanvas } from './components/VisualFXCanvas';
import { HUD } from './components/HUD';
import { StoryAndChoices } from './components/StoryAndChoices';
import { Modals } from './components/Modals';
import { BonusGame } from './components/BonusGame';
import { RunComparisonChart } from './components/RunComparisonChart';
import { 
  calculateEnemyStatus, 
  calculateHazardStatus, 
  generateScaledOptions 
} from './engine/scalingEngine';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';
import { SupportedLanguage } from './i18n/types';

const SAVE_KEY = 'abyssal_echoes_trilogy_v7';

function AppContent() {
  const { dict, t, language, setLanguage } = useTranslation();

  // Screen state
  const [screen, setScreen] = useState<'boot' | 'menu' | 'sectors' | 'game'>('boot');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isBonusOpen, setIsBonusOpen] = useState<boolean>(false);

  // Campaign & Map State
  const [campaign, setCampaign] = useState<CampaignId>('I');
  const [mapType, setMapType] = useState<MapType>('std');
  const [currentMapId, setCurrentMapId] = useState<number>(1);
  const [diffId, setDiffId] = useState<DifficultyData['id']>('easy');

  // Gameplay Run State
  const [stage, setStage] = useState<number>(1);
  const [sanity, setSanity] = useState<number>(100);
  const [corrupt, setCorrupt] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [revives, setRevives] = useState<number>(0);
  const [checkpoint, setCheckpoint] = useState<number>(1);
  const [usedCheckpoints, setUsedCheckpoints] = useState<number[]>([]);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  // Death / Victory overlay & run metrics
  const [deathActive, setDeathActive] = useState<boolean>(false);
  const [deathTitle, setDeathTitle] = useState<string>('');
  const [deathText, setDeathText] = useState<string>('');
  const [runSanityLost, setRunSanityLost] = useState<number>(0);
  const [runChambersCleared, setRunChambersCleared] = useState<number>(0);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent Player Profile
  const [loadout, setLoadout] = useState<string[]>(['relic_compass', 'relic_vial']);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([
    'relic_compass', 'relic_vial', 'relic_mask', 'relic_battery'
  ]);
  const [unlockedMaps, setUnlockedMaps] = useState<Record<CampaignId, { std: number[]; sec: number[] }>>({
    I: { std: [1], sec: [] },
    II: { std: [1], sec: [] },
    III: { std: [1], sec: [] }
  });
  const [omegaUnlocked, setOmegaUnlocked] = useState<boolean>(false);
  const [bonusUnlocked, setBonusUnlocked] = useState<boolean>(false);
  const [unlockedAch, setUnlockedAch] = useState<string[]>([]);
  const [volume, setVolume] = useState<number>(0.5);
  const [audioLayers, setAudioLayers] = useState<AudioLayersConfig>(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.audioLayers) {
          AudioManager.setLayers(data.audioLayers);
          return { ...DEFAULT_AUDIO_LAYERS, ...data.audioLayers };
        }
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_AUDIO_LAYERS };
  });
  const [stats, setStats] = useState<GameStats>({
    runs: 0,
    wins: 0,
    deaths: 0,
    choices: 0,
    chambersCleared: 0,
    sanityLost: 0,
    itemsFound: 0,
    secretsFound: 0,
    score: 0
  });

  // Load Saved Game Profile
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.loadout) setLoadout(data.loadout);
        if (data.unlockedItems) setUnlockedItems(data.unlockedItems);
        if (data.unlockedMaps) setUnlockedMaps(data.unlockedMaps);
        if (data.unlockedAch) setUnlockedAch(data.unlockedAch);
        if (data.stats) setStats(data.stats);
        if (data.omegaUnlocked !== undefined) setOmegaUnlocked(data.omegaUnlocked);
        if (data.bonusUnlocked !== undefined) setBonusUnlocked(data.bonusUnlocked);
        if (data.diffId) setDiffId(data.diffId);
        if (data.audioLayers) {
          setAudioLayers(data.audioLayers);
          AudioManager.setLayers(data.audioLayers);
        }
        if (data.volume !== undefined) {
          setVolume(data.volume);
          AudioManager.setVolume(data.volume);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save Game Profile Helper
  const saveProfile = useCallback((customStats?: GameStats, customAudioLayers?: AudioLayersConfig) => {
    try {
      const payload = {
        loadout,
        unlockedItems,
        unlockedMaps,
        unlockedAch,
        stats: customStats || stats,
        omegaUnlocked,
        bonusUnlocked,
        diffId,
        language,
        volume,
        audioLayers: customAudioLayers || audioLayers
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [loadout, unlockedItems, unlockedMaps, unlockedAch, stats, omegaUnlocked, bonusUnlocked, diffId, language, volume, audioLayers]);

  const handleToggleAudioLayer = useCallback((layerKey: keyof AudioLayersConfig) => {
    const nextVal = AudioManager.toggleLayer(layerKey);
    const updated: AudioLayersConfig = { ...AudioManager.getLayers(), [layerKey]: nextVal };
    setAudioLayers(updated);
    saveProfile(undefined, updated);
    AudioManager.playClick();
  }, [saveProfile]);

  const handlePreviewAudioLayer = useCallback((layerKey: keyof AudioLayersConfig) => {
    AudioManager.previewLayer(layerKey);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const unlockAchievement = useCallback((achId: string) => {
    setUnlockedAch(prev => {
      if (!prev.includes(achId)) {
        const next = [...prev, achId];
        const ach = ACHIEVEMENTS_CATALOG.find(a => a.id === achId);
        if (ach) showToast(`${dict.toastAchievementUnlocked || 'ACHIEVEMENT UNLOCKED:'} ${ach.name}`);
        saveProfile();
        return next;
      }
      return prev;
    });
  }, [dict.toastAchievementUnlocked, saveProfile, showToast]);

  const currentDiff = useMemo(() => {
    return DIFFICULTIES.find(d => d.id === diffId) || DIFFICULTIES[0];
  }, [diffId]);

  const currentMap = useMemo(() => {
    const list = MAPS_BY_CAMPAIGN[campaign][mapType === 'sec' ? 'sec' : 'std'];
    const found = list.find(m => m.id === currentMapId);
    return found || list[0];
  }, [campaign, mapType, currentMapId]);

  // Derived Enemy & Hazard Status based on progressive depth scaling
  const enemyStatus = useMemo(() => {
    return calculateEnemyStatus(stage, currentDiff.stages, currentDiff, currentMap, campaign);
  }, [stage, currentDiff, currentMap, campaign]);

  const hazardStatus = useMemo(() => {
    return calculateHazardStatus(stage, currentDiff.stages, currentDiff, currentMap, campaign);
  }, [stage, currentDiff, currentMap, campaign]);

  // Generate Options for Current Chamber
  const [tacticalOptions, setTacticalOptions] = useState<TacticalOption[]>([]);

  useEffect(() => {
    if (screen === 'game' && !deathActive) {
      const options = generateScaledOptions(
        stage,
        currentDiff.stages,
        currentDiff,
        currentMap,
        campaign,
        enemyStatus,
        hazardStatus,
        loadout
      );
      setTacticalOptions(options);
    }
  }, [screen, stage, currentDiff, currentMap, campaign, enemyStatus, hazardStatus, loadout, deathActive]);

  // Screen Glitch Trigger on Sanity Drops or Low Sanity
  useEffect(() => {
    if (sanity < 30) {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 220);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sanity]);

  // Corruption Decay Mechanic at Higher Difficulty Levels
  // When player maintains sanity at or above the threshold (e.g. >= 70%), corruption gradually purges over time
  const hasCorruptionDecay = !!currentDiff.corruptionDecay;
  const decayThreshold = currentDiff.corruptionDecayThreshold || 70;
  const isCorruptionDecaying = screen === 'game' && !deathActive && !activeModal && !isBonusOpen && hasCorruptionDecay && sanity >= decayThreshold && corrupt > 0;

  useEffect(() => {
    if (screen !== 'game' || deathActive || activeModal || isBonusOpen) {
      return;
    }

    if (!currentDiff.corruptionDecay) {
      return;
    }

    const threshold = currentDiff.corruptionDecayThreshold || 70;
    const intervalTime = currentDiff.corruptionDecayInterval || 2800;

    const timer = setInterval(() => {
      setSanity(currentSanity => {
        if (currentSanity >= threshold) {
          setCorrupt(currentCorrupt => {
            if (currentCorrupt > 0) {
              // Higher composure (>= 85%) earns accelerated double purge
              const decayAmount = currentSanity >= 85 ? 2 : 1;
              const nextCorrupt = Math.max(0, currentCorrupt - decayAmount);
              AudioManager.playPurge();
              return nextCorrupt;
            }
            return currentCorrupt;
          });
        }
        return currentSanity;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [screen, deathActive, activeModal, isBonusOpen, currentDiff]);

  // Start Map Descent
  const startDescent = useCallback((camp: CampaignId, mapId: number, isSecret: boolean) => {
    setCampaign(camp);
    setCurrentMapId(mapId);
    setMapType(isSecret ? 'sec' : 'std');
    setStage(1);
    setSanity(currentDiff.startSanity);
    setCorrupt(0);
    setScore(0);
    setCombo(0);
    setRevives(currentDiff.revives);
    setCheckpoint(1);
    setUsedCheckpoints([]);
    setDeathActive(false);
    setRunSanityLost(0);
    setRunChambersCleared(0);
    setScreen('game');
    AudioManager.playAmbient();
    showToast(`DESCENT INITIATED: ${currentMap.name}`);
  }, [currentDiff.revives, currentDiff.startSanity, currentMap.name, showToast]);

  // Trigger Victory State
  const triggerWin = useCallback(() => {
    const totalLost = currentDiff.startSanity - sanity;
    setRunSanityLost(Math.max(0, totalLost));
    setRunChambersCleared(currentDiff.stages);

    const bonusScore = Math.floor(sanity * 50 + score + (100 - corrupt) * 25);
    const finalScore = score + bonusScore;
    setScore(finalScore);

    setStats(prev => {
      const next: GameStats = {
        ...prev,
        runs: prev.runs + 1,
        wins: prev.wins + 1,
        chambersCleared: prev.chambersCleared + currentDiff.stages,
        sanityLost: prev.sanityLost + Math.max(0, totalLost),
        score: Math.max(prev.score, finalScore)
      };
      saveProfile(next);
      return next;
    });

    // Unlock next map in campaign
    setUnlockedMaps(prev => {
      const currentList = prev[campaign][mapType === 'sec' ? 'sec' : 'std'];
      const nextMapId = currentMapId + 1;
      const allMaps = MAPS_BY_CAMPAIGN[campaign][mapType === 'sec' ? 'sec' : 'std'];
      if (allMaps.some(m => m.id === nextMapId) && !currentList.includes(nextMapId)) {
        const next = {
          ...prev,
          [campaign]: {
            ...prev[campaign],
            [mapType === 'sec' ? 'sec' : 'std']: [...currentList, nextMapId]
          }
        };
        showToast(`MAP UNLOCKED: MAP ${nextMapId}`);
        return next;
      }
      return prev;
    });

    unlockAchievement('first_win');
    if (sanity > 80) unlockAchievement('iron_will');
    if (currentDiff.id === 'nightmare') unlockAchievement('abyss_master');

    AudioManager.playSuccess();
    setDeathTitle(dict.victoryTitle || 'DESCENT SUCCESSFUL // EXTRACTION COMPLETE');
    setDeathText(dict.victoryDesc || 'You cleared all subterranean chambers. Telemetry and artifacts encrypted into neural memory.');
    setDeathActive(true);
  }, [campaign, currentDiff.id, currentDiff.stages, currentDiff.startSanity, currentMapId, dict.victoryDesc, dict.victoryTitle, mapType, sanity, corrupt, score, saveProfile, unlockAchievement, showToast]);

  // Trigger Death State
  const triggerDeath = useCallback((reason: 'sanity' | 'corruption') => {
    const totalLost = currentDiff.startSanity - Math.max(0, sanity);
    setRunSanityLost(Math.max(0, totalLost));
    setRunChambersCleared(stage);

    setStats(prev => {
      const next: GameStats = {
        ...prev,
        runs: prev.runs + 1,
        deaths: prev.deaths + 1,
        chambersCleared: prev.chambersCleared + stage,
        sanityLost: prev.sanityLost + Math.max(0, totalLost)
      };
      saveProfile(next);
      return next;
    });

    unlockAchievement('first_death');
    if (reason === 'corruption') unlockAchievement('corrupt_one');

    AudioManager.playDeath();
    if (reason === 'sanity') {
      setDeathTitle(dict.deathCollapseTitle || 'PSYCHOLOGICAL COLLAPSE // NEURAL FAILURE');
      setDeathText('Your cognitive composure dissolved in the dark. The abyssal entities claimed your vacant physical shell.');
    } else {
      setDeathTitle(dict.deathCorruptionTitle || 'ABYSSAL CONSUMPTION // CORRUPTION OVERFLOW');
      setDeathText('Subterranean radiation mutated your consciousness. You are no longer human.');
    }
    setDeathActive(true);
  }, [currentDiff.startSanity, dict.deathCollapseTitle, dict.deathCorruptionTitle, sanity, saveProfile, stage, unlockAchievement]);

  // Option Selection Handler
  const handleSelectOption = useCallback((option: TacticalOption) => {
    AudioManager.playClick();

    // Calculate Outcomes
    const winRate = option.winChance > 1 ? option.winChance / 100 : option.winChance;
    const isSuccess = Math.random() <= winRate;
    const sanityChange = isSuccess ? option.sanityDelta : -Math.abs(option.sanityDelta) - 8;
    const corruptChange = isSuccess ? option.corruptDelta : Math.abs(option.corruptDelta) + 5;
    const scoreGain = isSuccess ? (option.bonusScore || 100) : 25;

    // Apply Stat Mutations
    const nextSanity = Math.max(0, Math.min(100, sanity + sanityChange));
    const nextCorrupt = Math.max(0, Math.min(100, corrupt + corruptChange));
    const nextScore = score + scoreGain;
    const nextCombo = isSuccess ? combo + 1 : 0;

    setSanity(nextSanity);
    setCorrupt(nextCorrupt);
    setScore(nextScore);
    setCombo(nextCombo);

    if (isSuccess && nextCombo >= 3) {
      showToast(`TACTICAL STREAK x${nextCombo} (+${nextCombo * 50} PTS)`);
      if (nextCombo >= 5) unlockAchievement('combo_king');
    }

    if (option.memoryEcho) {
      showToast(`MEMORY ECHO RECOVERED: +${option.sanityDelta} SANITY RESTORED`);
      unlockAchievement('echo_seeker');
    }

    // Checkpoint mechanism
    if (currentDiff.checkpoints > 0 && stage % 3 === 0 && !usedCheckpoints.includes(stage)) {
      setCheckpoint(stage);
      setUsedCheckpoints(prev => [...prev, stage]);
      showToast(dict.toastCheckpointSaved || 'NEURAL CHECKPOINT REGISTERED');
    }

    // Relic Finding Chance
    if (Math.random() < currentDiff.findChance) {
      const unowned = ITEMS_CATALOG.filter(i => !unlockedItems.includes(i.id));
      if (unowned.length > 0) {
        const found = unowned[Math.floor(Math.random() * unowned.length)];
        setUnlockedItems(prev => [...prev, found.id]);
        showToast(`${dict.toastRelicFound || 'NEW SUBTERRANEAN ARTIFACT DISCOVERED:'} ${found.name}`);
        unlockAchievement('collector');
      }
    }

    // Death Checks
    if (nextSanity <= 0) {
      if (revives > 0) {
        setRevives(prev => prev - 1);
        setSanity(40);
        showToast(`EMERGENCY NEURAL REVIVE CONSUMED (${revives - 1} REMAINING)`);
        AudioManager.playSuccess();
        return;
      }
      triggerDeath('sanity');
      return;
    }

    if (nextCorrupt >= 100) {
      triggerDeath('corruption');
      return;
    }

    // Advance Chamber
    const nextStage = stage + 1;
    if (nextStage > currentDiff.stages) {
      triggerWin();
    } else {
      setStage(nextStage);
    }
  }, [campaign, checkpoint, combo, corrupt, currentDiff.checkpoints, currentDiff.findChance, currentDiff.stages, currentDiff.startSanity, dict.toastCheckpointSaved, dict.toastRelicFound, hazardStatus.type, loadout, revives, sanity, score, showToast, stage, triggerDeath, triggerWin, unlockAchievement, unlockedItems, usedCheckpoints]);

  // Keyboard Shortcuts Handler (1-5 for options, P for pause, Esc for modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) setActiveModal(null);
        if (isBonusOpen) setIsBonusOpen(false);
        return;
      }

      if (e.key.toLowerCase() === 'p' && screen === 'game' && !deathActive) {
        setActiveModal(prev => (prev === 'pause' ? null : 'pause'));
        return;
      }

      if (screen === 'game' && !activeModal && !deathActive && !isBonusOpen) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= tacticalOptions.length) {
          const opt = tacticalOptions[num - 1];
          if (opt) handleSelectOption(opt);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, deathActive, handleSelectOption, isBonusOpen, screen, tacticalOptions]);

  // Render Story Box Narrative
  const currentSceneStory = useMemo(() => {
    const depthRatio = Math.round((stage / currentDiff.stages) * 100);
    let desc = `The atmospheric pressure groans around your boots. Chamber ${stage} reveals its suffocating architecture...\n\n`;

    if (enemyStatus.densityScore > 75) {
      desc += `Hostile entities are swarming the perimeter (${enemyStatus.name}). Audible scratches echo from inside the bulkheads as aggression peaks at ${enemyStatus.aggressionName}.\n`;
    } else if (enemyStatus.densityScore > 40) {
      desc += `Sensors report active hunting packs (${enemyStatus.name}) patrolling the corridor intersection.\n`;
    } else {
      desc += `Sparse biological readings detected ahead. Faint clicking sounds echo in the dark.\n`;
    }

    if (hazardStatus.active) {
      desc += `\nENVIRONMENTAL HAZARD: ${hazardStatus.name}. ${hazardStatus.desc}`;
    }

    desc += `\n[Depth Index: ${depthRatio}% // Sector Threat Rating: ${currentMap.baseThreat || 1}/10]`;
    return desc;
  }, [stage, currentDiff.stages, enemyStatus.densityScore, enemyStatus.name, enemyStatus.aggressionName, hazardStatus.active, hazardStatus.name, hazardStatus.desc, currentMap.baseThreat]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#c0c8e0] flex flex-col items-center justify-center p-3 sm:p-5 relative font-mono select-none">
      <VisualFXCanvas isGlitching={isGlitching} dangerLevel={(100 - sanity) / 100} />

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#14141f] border-2 border-[#f39c12] text-[#f39c12] px-4 py-2 text-xs z-50 transition-all duration-300 shadow-xl uppercase font-mono tracking-wider ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {toastMessage}
      </div>

      {/* Main Container Frame */}
      <div className="w-full max-w-5xl min-h-[92vh] flex flex-col bg-[#0e0f17] border-4 border-[#444b6e] p-4 sm:p-6 shadow-2xl relative z-10">
        
        {/* SCREEN 1: BOOT SCREEN */}
        {screen === 'boot' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl sm:text-6xl font-black text-[#ff3838] mb-2 tracking-widest text-shadow drop-shadow-lg">
              {dict.appTitle || 'ABYSSAL ECHOES'}
            </h1>
            <p className="text-xs sm:text-sm text-[#707a9e] mb-6 tracking-wider">
              {dict.appEdition || 'ADVANCED RETRO SUBTERRANEAN SURVIVAL KERNEL v7.0'}
            </p>
            <p className="text-xs text-[#9aa3c2] max-w-md mb-8 leading-relaxed">
              {dict.appDescription || 'Trilogy Edition featuring escalating enemy density, dynamic environmental hazards, and deep tactical choices.'}
            </p>
            <button
              className="btn primary py-3 px-8 text-sm tracking-wider animate-pulse"
              onClick={() => {
                AudioManager.playClick();
                setScreen('menu');
              }}
            >
              {dict.btnInitialize || '[ INITIALIZE NEURAL INTERFACE ]'}
            </button>
          </div>
        )}

        {/* SCREEN 2: MAIN MENU */}
        {screen === 'menu' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center my-4">
              <h1 className="text-3xl sm:text-4xl font-black text-[#ff3838] tracking-widest mb-1">
                {dict.appTitle || 'ABYSSAL ECHOES'}
              </h1>
              <p className="text-xs text-[#707a9e] uppercase tracking-wider">
                {dict.appSubtitle || 'Subterranean Survival & Psychological Threat Matrix'}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 max-w-md w-full mx-auto my-auto">
              <button
                className="btn primary py-3 text-xs tracking-wider"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('campaignHub');
                }}
              >
                {dict.btnSelectCampaign || 'SELECT CAMPAIGN & MAPS'}
              </button>

              <button
                className="btn gold py-2 text-xs"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('diff');
                }}
              >
                {dict.btnDifficultyMatrix || 'DIFFICULTY MATRIX'} ({currentDiff.name})
              </button>

              <button
                className="btn py-2 text-xs"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('loadout');
                }}
              >
                {dict.btnTacticalLoadout || 'TACTICAL LOADOUT'} ({loadout.length}/{currentDiff.items || 4})
              </button>

              <button
                className="btn py-2 text-xs"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('archive');
                }}
              >
                {dict.btnItemArchive || 'ITEM ARCHIVE'} ({unlockedItems.length}/{ITEMS_CATALOG.length})
              </button>

              <button
                className="btn py-2 text-xs"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('stats');
                }}
              >
                {dict.btnPlayerAnalytics || 'PLAYER ANALYTICS & LOGS'}
              </button>

              <button
                className="btn py-2 text-xs"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('ach');
                }}
              >
                {dict.btnTormentLogs || 'TORMENT LOGS & ACHIEVEMENTS'} ({unlockedAch.length}/{ACHIEVEMENTS_CATALOG.length})
              </button>

              <button
                className="btn py-2 text-xs"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('guide');
                }}
              >
                {dict.btnSurvivalGuide || 'SURVIVAL PROTOCOLS & TUTORIAL'}
              </button>

              <button
                className="btn py-2 text-xs"
                onClick={() => {
                  AudioManager.playClick();
                  setActiveModal('settings');
                }}
              >
                {dict.btnKernelSettings || 'KERNEL SETTINGS & AUDIO'}
              </button>
            </div>

            <div className="text-center text-[0.65rem] text-[#555e7e] mt-4 uppercase">
              {dict.appTitle || 'Abyssal Echoes'} v7.0 // Scaling Threat Engine // Full Trilogy Supported
            </div>
          </div>
        )}

        {/* SCREEN 3: SECTOR MAP DESCENT SELECTION */}
        {screen === 'sectors' && (
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#14141f] border-2 border-[#444b6e] p-3 mb-3 text-xs uppercase">
              <b className="text-[#f39c12]">{dict.selectMapDescent || 'SELECT MAP DESCENT // CAMPAIGN'} {campaign}</b>
              <button
                className="btn py-1 px-3 text-xs self-stretch sm:self-auto"
                onClick={() => {
                  AudioManager.playClick();
                  setScreen('menu');
                }}
              >
                {dict.btnBackToTerminal || 'BACK TO TERMINAL'}
              </button>
            </div>

            {/* Map Category Tabs */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <button
                className={`btn flex-1 py-2 sm:py-1.5 text-xs ${mapType === 'std' ? 'gold' : ''}`}
                onClick={() => {
                  AudioManager.playClick();
                  setMapType('std');
                }}
              >
                {dict.tabStandardSectors || 'STANDARD SECTORS'} ({MAPS_BY_CAMPAIGN[campaign].std.length})
              </button>
              <button
                className={`btn flex-1 py-2 sm:py-1.5 text-xs ${mapType === 'sec' ? 'gold' : ''}`}
                onClick={() => {
                  AudioManager.playClick();
                  setMapType('sec');
                }}
              >
                {dict.tabSecretAnomalies || 'SECRET ANOMALIES'} ({MAPS_BY_CAMPAIGN[campaign].sec.length})
              </button>
              <button
                className={`btn flex-1 py-2 sm:py-1.5 text-xs ${mapType === 'omega' ? 'omega' : ''}`}
                onClick={() => {
                  AudioManager.playClick();
                  setMapType('omega');
                }}
              >
                {dict.tabOmegaNexus || 'OMEGA NEXUS'}
              </button>
            </div>

            {/* Sector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-[62vh] pr-1">
              {mapType === 'omega' ? (
                <div className="card omega-card col-span-full p-6 text-center">
                  <h3 className="text-xl font-bold text-[#ff3838] mb-2">{dict.omegaNullityTitle || 'THE OMEGA NULLITY'}</h3>
                  <p className="text-xs text-[#707a9e] mb-4">
                    {dict.omegaNullityDesc || 'The ultimate convergence point. Reality folds into pure abyss with maximum hazard frequencies.'}
                  </p>
                  {omegaUnlocked ? (
                    <button
                      className="btn primary py-2 px-6 text-xs font-bold"
                      onClick={() => startDescent('I', 999, false)}
                    >
                      {dict.btnDeployOmega || '[ DEPLOY TO OMEGA NEXUS ]'}
                    </button>
                  ) : (
                    <div className="text-xs text-[#ff3838] font-bold">
                      {dict.omegaLockedReq || '[LOCKED: REQUIRES 100% TRILOGY COMPLETION]'}
                    </div>
                  )}
                </div>
              ) : (
                (mapType === 'std' ? MAPS_BY_CAMPAIGN[campaign].std : MAPS_BY_CAMPAIGN[campaign].sec).map(m => {
                  const isUnlocked = mapType === 'std' 
                    ? unlockedMaps[campaign].std.includes(m.id) 
                    : unlockedMaps[campaign].sec.includes(m.id);

                  return (
                    <div
                      key={m.id}
                      className={`card flex flex-col justify-between ${isUnlocked ? 'cursor-pointer' : 'locked'}`}
                      onClick={() => {
                        if (isUnlocked) startDescent(campaign, m.id, mapType === 'sec');
                      }}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xs font-bold text-[#f39c12]">
                            MAP {m.id}: {m.name}
                          </h3>
                          <span className="text-[0.65rem] text-[#707a9e]">
                            {dict.baseLevel || 'BASE LVL'} {m.baseThreat || 1}
                          </span>
                        </div>
                        <p className="text-[0.75rem] text-[#707a9e] mb-3 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-[0.7rem] font-bold ${isUnlocked ? 'text-[#2ecc71]' : 'text-[#ff3838]'}`}>
                          {isUnlocked ? (dict.btnDeploy || '[DEPLOY]') : (dict.btnLocked || '[LOCKED]')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* SCREEN 4: ACTIVE GAMEPLAY */}
        {screen === 'game' && (
          <div className="flex-1 flex flex-col">
            <HUD
              mapName={currentMap.name}
              campaign={campaign}
              stage={stage}
              totalStages={currentDiff.stages}
              difficultyName={currentDiff.name}
              sanity={sanity}
              corrupt={corrupt}
              score={score}
              combo={combo}
              enemyStatus={enemyStatus}
              hazardStatus={hazardStatus}
              hasCorruptionDecay={hasCorruptionDecay}
              isCorruptionDecaying={isCorruptionDecaying}
              decayThreshold={decayThreshold}
              onPause={() => setActiveModal('pause')}
              onQuickHeal={() => {
                if (!loadout.includes('relic_vial')) {
                  showToast(dict.toastQuickHealNone || 'NO STABILIZATION VIAL EQUIPPED');
                  return;
                }
                setSanity(prev => Math.min(100, prev + 14));
                setCorrupt(prev => Math.max(0, prev - 4));
                setLoadout(prev => prev.filter(id => id !== 'relic_vial'));
                showToast(dict.toastQuickHeal || 'VIAL CONSUMED: NEURAL STABILITY +14');
                AudioManager.playSuccess();
              }}
              onOpenGear={() => setActiveModal('loadout')}
              onOpenHelp={() => setActiveModal('guide')}
              onSave={() => {
                saveProfile();
                showToast(dict.toastSaved || 'DESCENT STATE PERSISTED TO KERNEL');
              }}
            />

            <StoryAndChoices
              sceneTitle={`${currentMap.name} // ${dict.hudChamber || 'CHAMBER'} ${stage}`}
              storyText={currentSceneStory}
              options={tacticalOptions}
              enemyStatus={enemyStatus}
              hazardStatus={hazardStatus}
              onSelectOption={handleSelectOption}
              disabled={deathActive}
            />
          </div>
        )}

      </div>

      {/* ALL MODALS COMPONENT */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        campaign={campaign}
        mapType={mapType}
        mapsList={MAPS_BY_CAMPAIGN[campaign][mapType === 'sec' ? 'sec' : 'std']}
        unlockedMaps={unlockedMaps[campaign][mapType === 'sec' ? 'sec' : 'std']}
        omegaUnlocked={omegaUnlocked}
        onSelectMap={(camp, mId, isSec) => {
          setActiveModal(null);
          startDescent(camp, mId, isSec);
        }}
        onSwitchMapTab={t => setMapType(t)}
        onSwitchCampaign={c => {
          setCampaign(c);
          setScreen('sectors');
        }}
        difficulties={DIFFICULTIES}
        currentDiff={diffId}
        maxDiffUnlocked={diffId}
        onSelectDifficulty={id => {
          setDiffId(id);
          saveProfile();
          showToast(`DIFFICULTY SET TO ${id.toUpperCase()}`);
        }}
        itemCatalog={ITEMS_CATALOG}
        loadout={loadout}
        unlockedItems={unlockedItems}
        maxLoadoutItems={currentDiff.items || 4}
        onToggleLoadout={itemId => {
          setLoadout(prev => {
            if (prev.includes(itemId)) {
              return prev.filter(i => i !== itemId);
            }
            if (prev.length < (currentDiff.items || 4)) {
              return [...prev, itemId];
            }
            showToast(`MAXIMUM ${currentDiff.items || 4} RELICS ALLOWED!`);
            return prev;
          });
        }}
        stats={stats}
        achievements={ACHIEVEMENTS_CATALOG}
        unlockedAchievements={unlockedAch}
        volume={volume}
        onVolumeChange={v => {
          setVolume(v);
          AudioManager.setVolume(v);
        }}
        audioLayers={audioLayers}
        onToggleAudioLayer={handleToggleAudioLayer}
        onPreviewAudioLayer={handlePreviewAudioLayer}
        currentLanguage={language}
        onLanguageChange={l => {
          setLanguage(l as SupportedLanguage);
          showToast(`LANGUAGE UPDATED TO ${l.toUpperCase()}`);
        }}
        onAbandonRun={() => {
          setActiveModal(null);
          setScreen('menu');
        }}
        onResumeRun={() => setActiveModal(null)}
        onStartTutorial={() => {
          setActiveModal(null);
          startDescent('I', 1, false);
        }}
        onOpenBonusGame={() => setIsBonusOpen(true)}
        bonusUnlocked={bonusUnlocked}
      />

      {/* BONUS STANDALONE GAME MODAL */}
      <BonusGame
        isOpen={isBonusOpen}
        onClose={() => setIsBonusOpen(false)}
        onVictory={() => {
          setBonusUnlocked(true);
          unlockAchievement('hollow_bonus');
          showToast('SECRET BONUS VICTORY RECORDED!');
        }}
      />

      {/* DEATH / VICTORY OVERLAY SCREEN */}
      {deathActive && (
        <div className="fixed inset-0 bg-[#0c0202]/98 z-50 flex flex-col items-center justify-start sm:justify-center text-center p-4 sm:p-6 font-mono select-none overflow-y-auto">
          <div className="w-full max-w-2xl my-auto py-4">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-widest text-shadow drop-shadow-2xl ${
              deathTitle.includes('SUCCESS') || deathTitle.includes('EXTRACTION') ? 'text-[#2ecc71]' : 'text-[#ff3838]'
            }`}>
              {deathTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#707a9e] max-w-lg mx-auto mb-2 leading-relaxed">
              {deathText}
            </p>

            {/* Comparative Bar Chart */}
            <RunComparisonChart
              data={{
                isVictory: deathTitle.includes('SUCCESS') || deathTitle.includes('EXTRACTION'),
                runSanityLost: runSanityLost,
                careerAvgSanityLost: stats.runs > 0 ? Math.round(((stats.sanityLost || 0) / Math.max(1, stats.runs)) * 10) / 10 : runSanityLost,
                runChambersCleared: runChambersCleared || stage,
                totalChambersInMap: currentDiff.stages,
                careerAvgChambers: stats.runs > 0 ? Math.round(((stats.chambersCleared || 0) / Math.max(1, stats.runs)) * 10) / 10 : (runChambersCleared || stage),
                runScore: Math.floor(score),
                careerAvgScore: stats.runs > 0 ? Math.round(((stats.score || 0) / Math.max(1, stats.runs))) : Math.floor(score),
                totalCareerRuns: stats.runs || 1
              }}
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-md mx-auto justify-center mt-3">
              <button
                className="btn primary py-2.5 px-6 text-xs font-bold tracking-wider w-full sm:w-auto"
                onClick={() => {
                  AudioManager.playClick();
                  setDeathActive(false);
                  setScreen('menu');
                }}
              >
                {dict.btnReturnToTerminal || 'RETURN TO MAIN TERMINAL'}
              </button>
              <button
                className="btn gold py-2.5 px-6 text-xs font-bold w-full sm:w-auto"
                onClick={() => {
                  AudioManager.playClick();
                  setDeathActive(false);
                  startDescent(campaign, currentMapId, mapType === 'sec');
                }}
              >
                {dict.btnRetryDescent || 'RETRY MAP DESCENT'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.language) return data.language as SupportedLanguage;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      data.language = lang;
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  return (
    <LanguageProvider language={language} setLanguage={handleSetLanguage}>
      <AppContent />
    </LanguageProvider>
  );
}
