import React from 'react';
import { 
  CampaignId, 
  MapType, 
  MapData, 
  DifficultyData, 
  ItemData, 
  AchievementData, 
  GameStats,
  AudioLayersConfig 
} from '../types';
import { GEAR_SYNERGIES, getActiveSynergies } from '../data/synergies';
import { useTranslation } from '../i18n/LanguageContext';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  // Campaign & Maps
  campaign: CampaignId;
  mapType: MapType;
  mapsList: MapData[];
  unlockedMaps: number[];
  omegaUnlocked: boolean;
  onSelectMap: (campaign: CampaignId, mapId: number, isSecret: boolean) => void;
  onSwitchMapTab: (type: MapType) => void;
  onSwitchCampaign: (camp: CampaignId) => void;
  // Difficulty
  difficulties: DifficultyData[];
  currentDiff: string;
  maxDiffUnlocked: string;
  onSelectDifficulty: (diffId: DifficultyData['id']) => void;
  // Loadout & Items
  itemCatalog: ItemData[];
  loadout: string[];
  unlockedItems: string[];
  maxLoadoutItems: number;
  onToggleLoadout: (itemId: string) => void;
  // Stats & Achievements
  stats: GameStats;
  achievements: AchievementData[];
  unlockedAchievements: string[];
  // Settings & Audio
  volume: number;
  onVolumeChange: (vol: number) => void;
  audioLayers: AudioLayersConfig;
  onToggleAudioLayer: (layer: keyof AudioLayersConfig) => void;
  onPreviewAudioLayer: (layer: keyof AudioLayersConfig) => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  // Actions
  onAbandonRun: () => void;
  onResumeRun: () => void;
  onStartTutorial: () => void;
  onOpenBonusGame: () => void;
  bonusUnlocked: boolean;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  campaign,
  mapType,
  mapsList,
  unlockedMaps,
  omegaUnlocked,
  onSelectMap,
  onSwitchMapTab,
  onSwitchCampaign,
  difficulties,
  currentDiff,
  onSelectDifficulty,
  itemCatalog,
  loadout,
  unlockedItems,
  maxLoadoutItems,
  onToggleLoadout,
  stats,
  achievements,
  unlockedAchievements,
  volume,
  onVolumeChange,
  audioLayers,
  onToggleAudioLayer,
  onPreviewAudioLayer,
  currentLanguage,
  onLanguageChange,
  onAbandonRun,
  onResumeRun,
  onStartTutorial,
  onOpenBonusGame,
  bonusUnlocked
}) => {
  const { dict, t } = useTranslation();

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 bg-[#050508]/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#14141f] border-3 border-[#ff3838] w-full max-w-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl font-mono text-sm text-[#c0c8e0]">
        
        {/* MODAL: CAMPAIGN SELECTOR / HUB */}
        {activeModal === 'campaignHub' && (
          <div>
            <h2 className="text-[#ff3838] font-bold text-lg mb-3 tracking-wider uppercase">
              {dict.campaignHubTitle || 'ABYSSAL ECHOES — TRILOGY SAGA HUB'}
            </h2>
            <p className="text-[#707a9e] text-xs mb-4">
              {dict.campaignHubDesc || 'Select your campaign descent. Each installment features unique subterranean maps, deepening enemy aggression, and scaling environmental hazards.'}
            </p>

            <div className="flex flex-col gap-3">
              {/* Campaign I */}
              <div className="border border-[#444b6e] p-3 bg-[#0d0d17]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#ff3838] font-bold">{dict.campaign1Title || 'I // THE DESCENT'}</span>
                  <span className="text-[#2ecc71] text-xs font-bold">{dict.campaign1Tag || '[AVAILABLE]'}</span>
                </div>
                <p className="text-xs text-[#707a9e] mb-2">
                  {dict.campaign1Desc || 'The original subterranean collapse. Explore 24 standard pressure sectors and 18 secret deep-crust anomalies.'}
                </p>
                <button
                  className="btn primary py-1 px-3 text-xs w-full sm:w-auto"
                  onClick={() => {
                    onSwitchCampaign('I');
                    onClose();
                  }}
                >
                  {dict.btnEnterCampaign1 || 'ENTER CAMPAIGN I'}
                </button>
              </div>

              {/* Campaign II */}
              <div className="border border-[#444b6e] p-3 bg-[#0d0d17]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#ff3838] font-bold">{dict.campaign2Title || 'II // THE BLACK MERIDIAN'}</span>
                  <span className="text-[#f39c12] text-xs font-bold">{dict.campaign2Tag || '[EXTENDED DESCENT]'}</span>
                </div>
                <p className="text-xs text-[#707a9e] mb-2">
                  {dict.campaign2Desc || '8-chamber deep-crust runs. Heightened hazard frequencies, cognitive distortions, and responsive enemy swarm triggers.'}
                </p>
                <button
                  className="btn omega py-1 px-3 text-xs w-full sm:w-auto"
                  onClick={() => {
                    onSwitchCampaign('II');
                    onClose();
                  }}
                >
                  {dict.btnEnterCampaign2 || 'ENTER CAMPAIGN II'}
                </button>
              </div>

              {/* Campaign III */}
              <div className="border border-[#444b6e] p-3 bg-[#0d0d17]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#ff3838] font-bold">{dict.campaign3Title || 'III // THE HOLLOW CROWN'}</span>
                  <span className="text-[#f39c12] text-xs font-bold">{dict.campaign3Tag || '[APEX ESCALATION]'}</span>
                </div>
                <p className="text-xs text-[#707a9e] mb-2">
                  {dict.campaign3Desc || '10-chamber terminal runs. Extreme enemy density scaling, unshielded radiation pulses, and psychological mutations.'}
                </p>
                <button
                  className="btn omega py-1 px-3 text-xs w-full sm:w-auto"
                  onClick={() => {
                    onSwitchCampaign('III');
                    onClose();
                  }}
                >
                  {dict.btnEnterCampaign3 || 'ENTER CAMPAIGN III'}
                </button>
              </div>

              {/* Bonus Game */}
              {bonusUnlocked && (
                <div className="border border-[#f39c12] p-3 bg-[#171308]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#f39c12] font-bold">{dict.bonusModalTitle || '??? // THE LAST SIGNAL'}</span>
                    <span className="text-[#2ecc71] text-xs font-bold">{dict.btnUnlockBonusGame || '[SECRET UNLOCKED]'}</span>
                  </div>
                  <p className="text-xs text-[#707a9e] mb-2">
                    {dict.bonusInstructions || 'A hidden standalone terminal simulation. Recover encrypted signal layers before receiver thermal overload.'}
                  </p>
                  <button
                    className="btn gold py-1 px-3 text-xs w-full sm:w-auto"
                    onClick={() => {
                      onClose();
                      onOpenBonusGame();
                    }}
                  >
                    {dict.btnLaunchBonusHacking || 'LAUNCH SECRET TRANSMISSION'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: DIFFICULTY MATRIX */}
        {activeModal === 'diff' && (
          <div>
            <h2 className="text-[#ff3838] font-bold text-lg mb-3 tracking-wider uppercase">
              {dict.diffMatrixTitle || 'DIFFICULTY MATRIX & HAZARD SCALING'}
            </h2>
            <p className="text-[#707a9e] text-xs mb-3">
              {dict.diffMatrixDesc || 'Higher difficulties drastically escalate enemy spawn densities, trigger lethal ambient hazard frequencies, and activate Monkey’s Paw choices.'}
            </p>

            <div className="flex flex-col gap-2.5">
              {difficulties.map(d => {
                const isSelected = currentDiff === d.id;
                return (
                  <div
                    key={d.id}
                    className={`border p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                      isSelected ? 'border-[#ff3838] bg-[#1a0c0e]' : 'border-[#444b6e] bg-[#0c0d14]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#f39c12] font-bold">{d.name}</span>
                        <span className="text-xs text-[#707a9e]">({d.stages} {dict.hudChamber || 'STAGES'})</span>
                        {isSelected && (
                          <span className="text-[0.65rem] bg-[#ff3838] text-white px-1.5 py-0.2 font-bold">{dict.diffSelectedBadge || 'ACTIVE'}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#9aa3c2] mt-0.5">
                        {dict.diffStartSanity || 'Sanity'}: {d.startSanity}% · {dict.btnTacticalLoadout || 'Items'}: {d.items} · {dict.diffRevives || 'Revives'}: {d.revives} · {dict.diffCheckpoints || 'Checkpoints'}: {d.checkpoints}
                      </p>
                      <p className="text-[0.7rem] text-[#707a9e]">
                        {dict.diffHostileDensity || 'Enemy Density'}: x{d.enemyMultiplier} · {dict.diffHazardSeverity || 'Hazard Frequency'}: x{d.hazardMultiplier}
                        {d.twisted && " · [MONKEY'S PAW ACTIVE]"}
                        {d.corruptionDecay && (
                          <span className="text-[#2ecc71] font-mono">
                            {` · [CORRUPTION DECAY: ≥${d.corruptionDecayThreshold || 70}% SANITY]`}
                          </span>
                        )}
                      </p>
                    </div>

                    <button
                      className={`btn py-1 px-3 text-xs uppercase ${isSelected ? 'gold' : 'primary'}`}
                      onClick={() => {
                        onSelectDifficulty(d.id);
                        onClose();
                      }}
                    >
                      {isSelected ? (dict.diffSelectedBadge || 'SELECTED') : (dict.diffActiveBadge || 'SELECT')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL: TACTICAL LOADOUT */}
        {activeModal === 'loadout' && (
          <div>
            <h2 className="text-[#f39c12] font-bold text-lg mb-2 tracking-wider uppercase">
              {dict.loadoutVaultTitle || 'TACTICAL LOADOUT VAULT'} ({loadout.length}/{maxLoadoutItems})
            </h2>
            <p className="text-[#707a9e] text-xs mb-3">
              {dict.loadoutArchiveDesc || `Equip up to ${maxLoadoutItems} artifacts discovered in subterranean sectors. Equipped relics unlock specialized tactical options to counter enemy swarms and mitigate environmental hazards.`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {itemCatalog.map(item => {
                const isOwned = unlockedItems.includes(item.id);
                const isEquipped = loadout.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`border p-2.5 flex flex-col justify-between ${
                      isEquipped 
                        ? 'border-[#f39c12] bg-[#1a160b]' 
                        : isOwned 
                          ? 'border-[#444b6e] bg-[#0c0d14]' 
                          : 'border-[#222538] bg-[#08080c] opacity-40'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`font-bold text-xs ${isEquipped ? 'text-[#f39c12]' : isOwned ? 'text-[#c0c8e0]' : 'text-[#555]'}`}>
                          {isOwned ? item.name : (dict.itemSecretHidden || '???? [LOCKED RELIC]')}
                        </span>
                        {isOwned && item.secret && (
                          <span className="text-[0.6rem] text-[#f39c12] border border-[#f39c12] px-1">SECRET</span>
                        )}
                      </div>
                      <p className="text-[0.7rem] text-[#707a9e] mt-1 leading-tight">
                        {isOwned ? item.desc : (dict.itemSecretUndiscovered || 'Discover through deep exploration or achievements.')}
                      </p>
                    </div>

                    <div className="mt-2 text-right">
                      {isOwned ? (
                        <button
                          className={`btn py-0.5 px-2 text-[0.7rem] ${isEquipped ? 'gold' : ''}`}
                          onClick={() => onToggleLoadout(item.id)}
                        >
                          {isEquipped ? `${dict.btnEquip || 'EQUIPPED'} ✓` : (dict.btnEquip || 'EQUIP')}
                        </button>
                      ) : (
                        <span className="text-[0.65rem] text-[#555]">{dict.btnLocked || '[LOCKED]'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GEAR SYNERGY MATRIX GUIDE */}
            <div className="mt-4 pt-3 border-t border-[#444b6e]">
              <div className="flex flex-wrap justify-between items-center gap-1 mb-2">
                <span className="text-[#f1c40f] font-bold text-xs flex items-center gap-1.5 font-mono">
                  <span>⚡ {dict.loadoutActiveSynergiesTitle || 'RELIC GEAR SYNERGY MATRIX'}</span>
                  <span className="text-[0.65rem] text-[#707a9e]">
                    ({getActiveSynergies(loadout).length} SYNCHRONIZED)
                  </span>
                </span>
                <span className="text-[0.65rem] text-[#8e98b7]">
                  {dict.warningBuffsEngaged || 'ACTIVATES SPECIAL OPTIONS & BUFFS IN HIGH-DENSITY COMBAT'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-1">
                {GEAR_SYNERGIES.map(syn => {
                  const isSynergized = syn.relics.every(r => loadout.includes(r));
                  const hasBoth = syn.relics.every(r => unlockedItems.includes(r));
                  const hasOne = syn.relics.some(r => unlockedItems.includes(r));

                  if (!hasOne && !hasBoth) return null;

                  return (
                    <div
                      key={syn.id}
                      className={`border p-2 text-xs flex flex-col justify-between ${
                        isSynergized 
                          ? 'border-[#f1c40f] bg-[#1d1706] shadow-[0_0_8px_rgba(241,196,15,0.25)]' 
                          : 'border-[#2d324d] bg-[#090a10] opacity-80'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`font-bold text-[0.75rem] ${isSynergized ? 'text-[#ffd700]' : 'text-[#a0a8c4]'}`}>
                            {syn.name}
                          </span>
                          {isSynergized ? (
                            <span className="text-[0.6rem] bg-[#f1c40f] text-black px-1.5 py-0.2 font-black animate-pulse">
                              SYNCHRONIZED
                            </span>
                          ) : (
                            <span className="text-[0.6rem] text-[#707a9e]">
                              {hasBoth ? 'READY TO EQUIP' : 'PARTIAL UNLOCK'}
                            </span>
                          )}
                        </div>
                        <p className="text-[0.65rem] text-[#707a9e] mb-1 font-mono">
                          Relics: <span className={loadout.includes(syn.relics[0]) ? 'text-[#2ecc71] font-bold' : 'text-[#c0c8e0]'}>{syn.relicNames[0]}</span> + <span className={loadout.includes(syn.relics[1]) ? 'text-[#2ecc71] font-bold' : 'text-[#c0c8e0]'}>{syn.relicNames[1]}</span>
                        </p>
                        <p className="text-[0.65rem] text-[#8e98b7] leading-tight">
                          {syn.combatEffect}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ITEM ARCHIVE */}
        {activeModal === 'archive' && (
          <div>
            <h2 className="text-[#f39c12] font-bold text-lg mb-2 tracking-wider uppercase">
              {dict.loadoutArchiveTitle || 'TACTICAL ITEM ARCHIVE'} ({unlockedItems.length}/{itemCatalog.length})
            </h2>
            <p className="text-[#707a9e] text-xs mb-3">
              {dict.loadoutArchiveDesc || 'Catalog of all known abyssal relics, countermeasures, and atmospheric preservation technologies.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {itemCatalog.map(item => {
                const isOwned = unlockedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`border p-2.5 ${
                      isOwned ? 'border-[#444b6e] bg-[#0e101a]' : 'border-[#222538] bg-[#08080c] opacity-40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-bold text-xs ${isOwned ? 'text-[#f39c12]' : 'text-[#666]'}`}>
                        {isOwned ? item.name : (dict.itemSecretHidden || '???? [UNDISCOVERED]')}
                      </span>
                      <span className={`text-[0.65rem] ${isOwned ? 'text-[#2ecc71]' : 'text-[#666]'}`}>
                        {isOwned ? (dict.achCompleted || '[UNLOCKED]') : (dict.btnLocked || '[LOCKED]')}
                      </span>
                    </div>
                    <p className="text-[0.7rem] text-[#707a9e] mt-1 leading-normal">
                      {isOwned ? item.desc : (dict.itemSecretUndiscovered || 'Explore deeper chambers or achieve extraction milestones to unearth this relic.')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL: PLAYER ANALYTICS / STATS */}
        {activeModal === 'stats' && (
          <div>
            <h2 className="text-[#ff3838] font-bold text-lg mb-3 tracking-wider uppercase">
              {dict.statsModalTitle || 'PLAYER ANALYTICS & EXTRACTION LOGS'}
            </h2>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsCareerRuns || 'Total Descents Initiated'}:</span>
                <b className="text-white font-mono">{stats.runs}</b>
              </div>
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsSuccessfulExtractions || 'Successful Extractions'}:</span>
                <b className="text-[#2ecc71] font-mono">{stats.wins}</b>
              </div>
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsPsychologicalCollapses || 'Psychological Collapses'}:</span>
                <b className="text-[#ff3838] font-mono">{stats.deaths}</b>
              </div>
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsTotalChambers || 'Total Chambers Cleared'}:</span>
                <b className="text-white font-mono">{stats.chambersCleared} ({dict.statsAvgChambersPerRun || 'Avg'}: {stats.runs > 0 ? (Math.round((stats.chambersCleared / stats.runs) * 10) / 10) : 0}/run)</b>
              </div>
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsTotalSanityBleed || 'Total Sanity Bleed'}:</span>
                <b className="text-[#ff3838] font-mono">{stats.sanityLost}% ({dict.statsAvgSanityPerRun || 'Avg'}: {stats.runs > 0 ? (Math.round((stats.sanityLost / stats.runs) * 10) / 10) : 0}%/run)</b>
              </div>
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsArtifactsDiscovered || 'Artifacts Discovered'}:</span>
                <b className="text-[#f39c12] font-mono">{stats.itemsFound}</b>
              </div>
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsSecretMapsFound || 'Secret Coordinates Uncovered'}:</span>
                <b className="text-[#f39c12] font-mono">{stats.secretsFound}</b>
              </div>
              <div className="flex justify-between border-b border-[#2d324d] py-1.5">
                <span className="text-[#707a9e]">{dict.statsOmegaNexusStatus || 'Omega Nexus Threshold'}:</span>
                <b className={omegaUnlocked ? 'text-[#2ecc71]' : 'text-[#ff3838]'}>
                  {omegaUnlocked ? (dict.statsOmegaOnline || 'ONLINE [100% COMPLETION]') : (dict.statsOmegaLocked || 'LOCKED (REQUIRES ALL MAPS & RELICS)')}
                </b>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ACHIEVEMENTS & TORMENT LOGS */}
        {activeModal === 'ach' && (
          <div>
            <h2 className="text-[#f39c12] font-bold text-lg mb-2 tracking-wider uppercase">
              {dict.achModalTitle || 'TORMENT LOGS & ACHIEVEMENTS'} ({unlockedAchievements.length}/{achievements.length})
            </h2>
            <p className="text-[#707a9e] text-xs mb-3">
              {dict.achModalDesc || 'Milestone achievements earned through surviving extreme depths, apex predator encounters, and psychological collapses.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
              {achievements.map(ach => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`border p-2 ${
                      isUnlocked ? 'border-[#f39c12] bg-[#14120a]' : 'border-[#222538] bg-[#08080c] opacity-40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-bold text-xs ${isUnlocked ? 'text-[#f39c12]' : 'text-[#555]'}`}>
                        {isUnlocked || !ach.secret ? ach.name : (dict.achHiddenTitle || '???? [HIDDEN LOG]')}
                      </span>
                      <span className={`text-[0.65rem] ${isUnlocked ? 'text-[#2ecc71]' : 'text-[#555]'}`}>
                        {isUnlocked ? (dict.achCompleted || '[COMPLETED]') : (dict.achLocked || '[LOCKED]')}
                      </span>
                    </div>
                    <p className="text-[0.7rem] text-[#707a9e] mt-1 leading-tight">
                      {isUnlocked || !ach.secret ? ach.desc : (dict.achHiddenDesc || 'Conditions unknown.')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL: SURVIVAL GUIDE */}
        {activeModal === 'guide' && (
          <div>
            <h2 className="text-[#f39c12] font-bold text-lg mb-3 tracking-wider uppercase">
              {dict.guideModalTitle || 'CONTAINMENT PROTOCOL & SURVIVAL GUIDE'}
            </h2>
            <div className="flex flex-col gap-2.5 text-xs text-[#c0c8e0] leading-relaxed">
              <p>
                <b className="text-[#ff3838]">{dict.guideStep1Title || '1. Scaling Depth & Danger:'}</b> {dict.guideStep1Desc || 'As you venture deeper into chambers, enemy density escalates from sparse scouts to swarming broods and apex horrors. Active hazard frequencies multiply in intensity.'}
              </p>
              <p>
                <b className="text-[#f39c12]">{dict.guideStep2Title || '2. Composure vs. Corruption:'}</b> {dict.guideStep2Desc || 'Hitting 0% Sanity triggers psychological collapse. If Corruption reaches 100%, your mind merges irreversibly with the abyss.'}
              </p>
              <p>
                <b className="text-[#85a5ff]">{dict.guideStep3Title || '3. Dynamic Tactical Options:'}</b> {dict.guideStep3Desc || 'Each chamber generates tailored courses of action: Combat breaches clear enemy hordes, silent evasion lowers noise, and manual hazard overrides shield your life support.'}
              </p>
              <p>
                <b className="text-[#2ecc71]">{dict.guideStep4Title || '4. Relic Countermeasures:'}</b> {dict.guideStep4Desc || 'Equipping specialized artifacts unlocks instant counter-actions in dangerous chambers.'}
              </p>
              <p>
                <b className="text-[#2ecc71]">{dict.guideStep5Title || '5. Corruption Decay & Equilibrium:'}</b> {dict.guideStep5Desc || 'On Hard+ difficulties, maintaining high Sanity (≥70%) triggers passive Corruption Decay over time. Use this tactical trade-off to cleanse bio-radiation while planning your descent.'}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="btn primary py-1.5 px-4 text-xs" onClick={onStartTutorial}>
                {dict.btnStartInteractiveTutorial || 'LAUNCH INTERACTIVE TUTORIAL'}
              </button>
            </div>
          </div>
        )}

        {/* MODAL: KERNEL SETTINGS & LANGUAGE */}
        {activeModal === 'settings' && (
          <div>
            <h2 className="text-[#ff3838] font-bold text-lg mb-3 tracking-wider uppercase flex items-center justify-between">
              <span>{dict.settingsModalTitle || 'KERNEL SETTINGS & LOCALIZATION'}</span>
              <span className="text-[0.65rem] px-2 py-0.5 border border-[#ff3838]/40 text-[#ff7878] bg-[#ff3838]/10 font-mono">
                AUDIO KERNEL v3.4
              </span>
            </h2>

            <div className="flex flex-col gap-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {/* Volume */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border border-[#2d324d] bg-[#0a0c16] p-2.5">
                <div>
                  <span className="font-bold text-[#c0c8e0] block">{dict.settingsVolume || 'MASTER AUDIO VOLUME'}</span>
                  <span className="text-[0.7rem] text-[#707a9e]">Primary gain bus for all ambient layers & tactical SFX</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-36 sm:w-44 cursor-pointer accent-[#ff3838]"
                  />
                  <span className="font-mono text-[#f39c12] w-9 text-right font-bold">{Math.round(volume * 100)}%</span>
                </div>
              </div>

              {/* Language Selection */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border border-[#2d324d] bg-[#0a0c16] p-2.5">
                <div>
                  <span className="font-bold text-[#c0c8e0] block">{dict.settingsLanguage || 'LANGUAGE SELECTION (15+ LOCALES)'}</span>
                  <span className="text-[0.7rem] text-[#707a9e]">Dynamic telemetry localization engine</span>
                </div>
                <select
                  value={currentLanguage}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="bg-[#0e0f17] border-2 border-[#444b6e] text-[#c0c8e0] px-3 py-1.5 font-mono cursor-pointer"
                >
                  <option value="en">ENGLISH (EN)</option>
                  <option value="es">ESPAÑOL (ES)</option>
                  <option value="ja">日本語 (JA)</option>
                  <option value="fr">FRANÇAIS (FR)</option>
                  <option value="de">DEUTSCH (DE)</option>
                  <option value="it">ITALIANO (IT)</option>
                  <option value="pt">PORTUGUÊS (PT)</option>
                  <option value="ru">РУССКИЙ (RU)</option>
                  <option value="zh">中文 (ZH)</option>
                  <option value="ko">한국어 (KO)</option>
                  <option value="pl">POLSKI (PL)</option>
                  <option value="tr">TÜRKÇE (TR)</option>
                  <option value="uk">УКРАЇНСЬКА (UK)</option>
                  <option value="ar">العربية (AR)</option>
                  <option value="hi">हिन्दी (HI)</option>
                </select>
              </div>

              {/* IMMERSIVE SOUNDSCAPE & AUDIO LAYERS */}
              <div className="border border-[#343b59] bg-[#07080f] p-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5 border-b border-[#22273d] pb-2">
                  <div>
                    <h3 className="text-[#f39c12] font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#f39c12] animate-pulse"></span>
                      {dict.soundscapeTitle || 'IMMERSIVE SOUNDSCAPE & AUDIO LAYERS'}
                    </h3>
                    <p className="text-[0.68rem] text-[#707a9e] mt-0.5">
                      {dict.soundscapeDesc || 'Toggle individual audio layers independently to customize your immersive acoustic soundscape.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      key: 'ambientWind' as const,
                      title: dict.layerAmbientWindTitle || 'Ambient Wind',
                      desc: dict.layerAmbientWindDesc || 'Low-frequency resonant air currents groaning through excavated deep-crust tunnels.',
                      icon: '💨'
                    },
                    {
                      key: 'neuralStatic' as const,
                      title: dict.layerNeuralStaticTitle || 'Neural Static',
                      desc: dict.layerNeuralStaticDesc || 'Subtle high-frequency cognitive telemetry hiss and psychic radiation hum.',
                      icon: '📡'
                    },
                    {
                      key: 'hostileClicking' as const,
                      title: dict.layerHostileClickingTitle || 'Hostile Clicking',
                      desc: dict.layerHostileClickingDesc || 'Chitinous scuttling and bio-acoustic echolocation clicks echoing from bulkhead vents.',
                      icon: '🕷️'
                    },
                    {
                      key: 'subBassDrone' as const,
                      title: dict.layerSubBassDroneTitle || 'Sub-Bass Drone',
                      desc: dict.layerSubBassDroneDesc || 'Deep 40Hz seismic pressure vibration throbbing in the rock strata.',
                      icon: '🔊'
                    },
                    {
                      key: 'interfaceSFX' as const,
                      title: dict.layerInterfaceSFXTitle || 'Terminal SFX',
                      desc: dict.layerInterfaceSFXDesc || 'Auditory feedback for tactical commands, breach sirens, and system alerts.',
                      icon: '⚡'
                    }
                  ].map((layer) => {
                    const isEnabled = audioLayers ? audioLayers[layer.key] : true;
                    return (
                      <div
                        key={layer.key}
                        className={`p-2.5 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                          isEnabled
                            ? 'border-[#3f4a75] bg-[#0c1020]'
                            : 'border-[#1b1f30] bg-[#06070c] opacity-55'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => onToggleAudioLayer(layer.key)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 mt-0.5 flex items-center ${
                              isEnabled ? 'bg-[#2ecc71] justify-end' : 'bg-[#33384f] justify-start'
                            }`}
                            title={isEnabled ? 'Click to Mute Layer' : 'Click to Enable Layer'}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{layer.icon}</span>
                              <span className={`font-bold text-xs ${isEnabled ? 'text-[#c8d4f8]' : 'text-[#626a88]'}`}>
                                {layer.title}
                              </span>
                              <span
                                className={`text-[0.6rem] font-mono px-1.5 py-0.2 border ${
                                  isEnabled
                                    ? 'border-[#2ecc71]/40 text-[#2ecc71] bg-[#2ecc71]/10'
                                    : 'border-[#666]/40 text-[#777] bg-[#222]/20'
                                }`}
                              >
                                {isEnabled ? (dict.layerActive || 'ACTIVE') : (dict.layerMuted || 'MUTED')}
                              </span>
                            </div>
                            <p className="text-[0.68rem] text-[#707a9e] leading-tight mt-0.5">
                              {layer.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => onPreviewAudioLayer(layer.key)}
                            className="btn py-1 px-2 text-[0.65rem] border border-[#444b6e] hover:border-[#f39c12] text-[#a0a9c8] hover:text-[#f39c12] flex items-center gap-1"
                            title="Audition / Preview this isolated sound layer"
                          >
                            <span>▶</span>
                            <span>{dict.btnPreviewLayer || 'PREVIEW'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleAudioLayer(layer.key)}
                            className={`btn py-1 px-2.5 text-[0.65rem] font-bold ${
                              isEnabled
                                ? 'border border-[#2ecc71]/50 text-[#2ecc71] hover:bg-[#2ecc71]/10'
                                : 'border border-[#ff3838]/50 text-[#ff7878] hover:bg-[#ff3838]/10'
                            }`}
                          >
                            {isEnabled ? 'MUTE' : 'ENABLE'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PAUSE SIMULATION */}
        {activeModal === 'pause' && (
          <div>
            <h2 className="text-[#f39c12] font-bold text-lg mb-3 tracking-wider uppercase">
              {dict.pauseModalTitle || 'NEURAL SIMULATION PAUSED'}
            </h2>
            <p className="text-xs text-[#707a9e] mb-4">
              {dict.pauseModalDesc || 'Current chamber progress and telemetry state are safely suspended in memory.'}
            </p>
            <div className="flex flex-col gap-2">
              <button className="btn primary py-2 text-xs" onClick={onResumeRun}>
                {dict.btnResumeDescent || 'RESUME DESCENT'}
              </button>
              <button className="btn py-2 text-xs" onClick={onAbandonRun}>
                {dict.btnAbandonDescent || 'ABANDON DESCENT TO MAIN TERMINAL'}
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-[#2d324d] text-right">
          <button className="btn primary py-1.5 px-4 text-xs" onClick={onClose}>
            {dict.btnCloseKernel || 'CLOSE KERNEL'}
          </button>
        </div>

      </div>
    </div>
  );
};
