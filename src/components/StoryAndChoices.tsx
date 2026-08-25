import React from 'react';
import { TacticalOption, EnemyStatus, HazardStatus } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface StoryAndChoicesProps {
  sceneTitle: string;
  storyText: string;
  options: TacticalOption[];
  enemyStatus: EnemyStatus;
  hazardStatus: HazardStatus;
  onSelectOption: (option: TacticalOption, index: number) => void;
  disabled?: boolean;
}

export const StoryAndChoices: React.FC<StoryAndChoicesProps> = ({
  sceneTitle,
  storyText,
  options,
  enemyStatus,
  hazardStatus,
  onSelectOption,
  disabled = false
}) => {
  const { dict, t } = useTranslation();

  return (
    <div className="flex flex-col flex-1">
      {/* Entity Alert */}
      {enemyStatus.densityScore >= 40 && (
        <div className="bg-[#b82323]/25 border-2 border-dashed border-[#ff3838] px-3 py-2 mb-3 text-xs text-[#ff3838] flex justify-between items-center uppercase tracking-wider animate-pulse">
          <span className="flex items-center gap-2">
            <span className="font-bold">⚠ {dict.warningEntityCritical || 'WARNING: ENTITY PROXIMITY CRITICAL'}</span>
            <span className="hidden sm:inline">({enemyStatus.name})</span>
          </span>
          <span className="font-bold font-mono">
            {dict.diffHostileDensity || 'DENSITY'}: {enemyStatus.densityScore}% // {enemyStatus.aggressionName}
          </span>
        </div>
      )}

      {/* Hazard Warning Banner */}
      {hazardStatus.active && (
        <div className="bg-[#f39c12]/20 border border-[#f39c12] px-3 py-1.5 mb-3 text-xs text-[#f39c12] flex justify-between items-center">
          <span className="font-bold">⚡ {dict.warningAmbientHazard || 'AMBIENT HAZARD'}: {hazardStatus.name.toUpperCase()}</span>
          <span className="font-mono text-[0.7rem]">{dict.warningSeverity || 'SEVERITY'}: {hazardStatus.severity}/5</span>
        </div>
      )}

      {/* Active Gear Synergy Banner in High Density Encounter */}
      {options.some(o => o.category === 'synergy') && (
        <div className="bg-[#f1c40f]/15 border border-[#f1c40f] px-3 py-1.5 mb-3 text-xs text-[#f1c40f] flex flex-wrap justify-between items-center gap-1 font-mono shadow-[0_0_8px_rgba(241,196,15,0.2)]">
          <span className="font-bold flex items-center gap-1.5">
            <span>⚡ {dict.warningSynergyActive || 'GEAR SYNERGY ACTIVE'}:</span>
            <span className="text-white">
              {Array.from(new Set(options.filter(o => o.category === 'synergy').map(o => o.synergyName || o.title))).join(' · ')}
            </span>
          </span>
          <span className="text-[0.65rem] bg-[#f1c40f]/25 text-[#ffd700] px-1.5 py-0.5 border border-[#f1c40f] font-bold animate-pulse">
            {dict.warningBuffsEngaged || 'HIGH-DENSITY STAT BUFFS ENGAGED'}
          </span>
        </div>
      )}

      {/* Scene Title */}
      <div className="text-[#f39c12] text-sm md:text-base font-bold mb-1 tracking-wider uppercase font-mono">
        {sceneTitle}
      </div>

      {/* Story Box */}
      <div className="story-box bg-[#06060a] border-2 border-[#444b6e] border-l-4 border-l-[#b82323] p-4 mb-4 leading-relaxed text-sm whitespace-pre-line text-[#c8d0e8] shadow-inner font-mono">
        {storyText}
      </div>

      {/* Choices Header */}
      <div className="flex justify-between items-center mb-2 text-xs uppercase tracking-wider text-[#707a9e]">
        <span>{dict.tacticalPromptTitle || 'SELECT TACTICAL COURSE OF ACTION:'}</span>
        <span className="hidden sm:inline">{t('keyboardPrompt', { count: options.length })}</span>
      </div>

      {/* Choices List */}
      <div className="flex flex-col gap-2.5">
        {options.map((opt, idx) => {
          const isCombat = opt.category === 'combat';
          const isRelic = opt.category === 'relic';
          const isGamble = opt.category === 'gamble';
          const isNeutralize = opt.category === 'neutralize';
          const isEcho = opt.category === 'echo' || opt.memoryEcho;
          const isSynergy = opt.category === 'synergy';

          let borderClass = 'border-[#444b6e] hover:border-[#ff3838]';
          let bgClass = 'bg-[#14141f] hover:bg-[#222538]';

          if (isSynergy) {
            borderClass = 'border-[#f1c40f] hover:border-[#ffd700] shadow-[0_0_12px_rgba(241,196,15,0.35)]';
            bgClass = 'bg-[#1a1506] hover:bg-[#2c240a]';
          } else if (isEcho) {
            borderClass = 'border-[#00e1d9] hover:border-[#5cfff8] shadow-[0_0_8px_rgba(0,225,217,0.2)]';
            bgClass = 'bg-[#05181c] hover:bg-[#09282f]';
          } else if (isRelic) {
            borderClass = 'border-[#f39c12] hover:border-[#ffe17d]';
            bgClass = 'bg-[#1c180d] hover:bg-[#2d2614]';
          } else if (isGamble) {
            borderClass = 'border-[#b82323] hover:border-[#ff5959]';
            bgClass = 'bg-[#1a0c0e] hover:bg-[#2c1317]';
          } else if (isNeutralize) {
            borderClass = 'border-[#2e5282] hover:border-[#4d88d6]';
            bgClass = 'bg-[#0c1421] hover:bg-[#15233b]';
          }

          return (
            <button
              key={opt.id || idx}
              disabled={disabled}
              onClick={() => onSelectOption(opt, idx)}
              className={`w-full text-left p-3 border-2 transition-all cursor-pointer shadow-md transform active:translate-x-0.5 active:translate-y-0.5 min-h-[44px] ${borderClass} ${bgClass}`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1.5">
                <div className="font-bold text-xs sm:text-sm text-[#c0c8e0] tracking-wide flex items-start gap-2 break-words min-w-0 flex-1">
                  <span className="text-[#f39c12] font-mono shrink-0">[{idx + 1}]</span>
                  <span className="break-words leading-tight">{opt.title}</span>
                </div>
                {opt.tag && (
                  <span className={`text-[0.65rem] font-bold px-1.5 py-0.5 border uppercase self-start sm:self-auto shrink-0 ${
                    isSynergy
                      ? 'text-[#f1c40f] border-[#f1c40f] bg-[#f1c40f]/20 font-black animate-pulse'
                      : isEcho
                        ? 'text-[#00e1d9] border-[#00e1d9] bg-[#00e1d9]/15 animate-pulse'
                        : isRelic
                          ? 'text-[#f39c12] border-[#f39c12] bg-[#f39c12]/10'
                          : isCombat
                            ? 'text-[#ff3838] border-[#ff3838] bg-[#ff3838]/10'
                            : 'text-[#85a5ff] border-[#85a5ff] bg-[#85a5ff]/10'
                  }`}>
                    {opt.tag}
                  </span>
                )}
              </div>

              {opt.flavor && (
                <div className="text-[0.75rem] text-[#909ab8] mb-1.5 font-mono leading-relaxed break-words">
                  {opt.flavor}
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center gap-1 text-[0.7rem] text-[#707a9e] border-t border-[#2d324d] pt-1.5 mt-1 font-mono">
                <span className={opt.sanityDelta > 0 ? 'text-[#2ecc71] font-bold' : 'text-[#ff7878]'}>
                  {opt.riskLabel}
                </span>
                {opt.bonusScore && (
                  <span className="text-[#f39c12] font-bold">+{opt.bonusScore} {dict.riskScore || 'PTS'}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
