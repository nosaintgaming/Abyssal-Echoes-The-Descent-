import React, { useState, useEffect, useRef } from 'react';
import { EnemyStatus, HazardStatus } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface HUDProps {
  mapName: string;
  campaign: string;
  stage: number;
  totalStages: number;
  difficultyName: string;
  sanity: number;
  corrupt: number;
  score: number;
  combo: number;
  enemyStatus: EnemyStatus;
  hazardStatus: HazardStatus;
  hasCorruptionDecay?: boolean;
  isCorruptionDecaying?: boolean;
  decayThreshold?: number;
  onPause: () => void;
  onQuickHeal: () => void;
  onOpenGear: () => void;
  onOpenHelp: () => void;
  onSave: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  mapName,
  campaign,
  stage,
  totalStages,
  difficultyName,
  sanity,
  corrupt,
  score,
  combo,
  enemyStatus,
  hazardStatus,
  hasCorruptionDecay = false,
  isCorruptionDecaying = false,
  decayThreshold = 70,
  onPause,
  onQuickHeal,
  onOpenGear,
  onOpenHelp,
  onSave
}) => {
  const { dict } = useTranslation();
  const sanityClamped = Math.max(0, Math.min(100, Math.round(sanity)));
  const corruptClamped = Math.max(0, Math.min(100, Math.round(corrupt)));

  const prevSanityRef = useRef<number>(sanityClamped);
  const prevCorruptRef = useRef<number>(corruptClamped);

  const [sanityPulse, setSanityPulse] = useState<'red' | 'gold' | null>(null);
  const [sanityDeltaText, setSanityDeltaText] = useState<string | null>(null);
  const [corruptPulse, setCorruptPulse] = useState<'red' | 'gold' | null>(null);
  const [corruptDeltaText, setCorruptDeltaText] = useState<string | null>(null);

  // Monitor sanity changes for glow pulses
  useEffect(() => {
    const diff = sanityClamped - prevSanityRef.current;
    if (Math.abs(diff) >= 3) {
      if (diff < 0) {
        setSanityPulse('red');
        setSanityDeltaText(`${diff}`);
      } else {
        setSanityPulse('gold');
        setSanityDeltaText(`+${diff}`);
      }

      const timer = setTimeout(() => {
        setSanityPulse(null);
        setSanityDeltaText(null);
      }, 1900);

      prevSanityRef.current = sanityClamped;
      return () => clearTimeout(timer);
    } else {
      prevSanityRef.current = sanityClamped;
    }
  }, [sanityClamped]);

  // Monitor corruption changes for glow pulses
  useEffect(() => {
    const diff = corruptClamped - prevCorruptRef.current;
    if (Math.abs(diff) >= 3) {
      if (diff > 0) {
        setCorruptPulse('red');
        setCorruptDeltaText(`+${diff}`);
      } else {
        setCorruptPulse('gold');
        setCorruptDeltaText(`${diff}`);
      }

      const timer = setTimeout(() => {
        setCorruptPulse(null);
        setCorruptDeltaText(null);
      }, 1900);

      prevCorruptRef.current = corruptClamped;
      return () => clearTimeout(timer);
    } else {
      prevCorruptRef.current = corruptClamped;
    }
  }, [corruptClamped]);

  // Determine container classes based on active pulse or persistent critical state
  let sanityContainerClass = 'bg-[#050508] border-2 border-[#444b6e]';
  if (sanityPulse === 'red') {
    sanityContainerClass = 'bg-[#1a0505] border-2 border-[#ff3838] hud-pulse-red';
  } else if (sanityPulse === 'gold') {
    sanityContainerClass = 'bg-[#1c180d] border-2 border-[#f39c12] hud-pulse-gold';
  } else if (sanityClamped <= 25) {
    sanityContainerClass = 'bg-[#140505] border-2 border-[#ff3838] hud-critical-loop';
  }

  let corruptContainerClass = 'bg-[#050508] border-2 border-[#444b6e]';
  if (corruptPulse === 'red') {
    corruptContainerClass = 'bg-[#1a0505] border-2 border-[#ff3838] hud-pulse-red';
  } else if (corruptPulse === 'gold') {
    corruptContainerClass = 'bg-[#1c180d] border-2 border-[#f39c12] hud-pulse-gold';
  } else if (isCorruptionDecaying) {
    corruptContainerClass = 'bg-[#05140a] border-2 border-[#2ecc71] corruption-decay-active-container';
  } else if (corruptClamped >= 75) {
    corruptContainerClass = 'bg-[#140505] border-2 border-[#ff3838] hud-critical-loop';
  }

  const isCriticalSanity = sanityClamped < 25;

  // Real-time Threat Meter Scaling Calculations
  const depthRatio = Math.min(1, Math.max(0, (stage - 1) / Math.max(1, totalStages - 1)));
  const depthContribution = Math.round(depthRatio * 35);
  const enemyContribution = Math.round((enemyStatus.densityScore / 100) * 45);
  const hazardContribution = Math.round(
    hazardStatus.active 
      ? (hazardStatus.severity / 5) * 20 
      : depthRatio * 10
  );
  const rawThreatScore = depthContribution + enemyContribution + hazardContribution;
  const threatScore = Math.min(100, Math.max(6, rawThreatScore));

  // Determine Threat Tier & Color Palette
  let threatTier = {
    code: 'MINIMAL',
    name: dict.hudThreatLevel1,
    badgeClass: 'text-[#2ecc71] border-[#2ecc71] bg-[#2ecc71]/15',
    barGradient: 'from-[#1abc9c] to-[#2ecc71]',
    containerBorder: 'border-[#27ae60]',
    textColor: 'text-[#2ecc71]',
    dotClass: 'bg-[#2ecc71]',
    pulseClass: ''
  };

  if (threatScore >= 90 || depthRatio >= 0.9) {
    threatTier = {
      code: 'APEX',
      name: dict.hudThreatLevel5,
      badgeClass: 'text-[#ff1e7b] border-[#ff1e7b] bg-[#ff1e7b]/25 font-black',
      barGradient: 'from-[#ff1e7b] via-[#e84393] to-[#ff3838]',
      containerBorder: 'border-[#ff1e7b]',
      textColor: 'text-[#ff1e7b]',
      dotClass: 'bg-[#ff1e7b]',
      pulseClass: 'threat-apex-pulse'
    };
  } else if (threatScore >= 75 || depthRatio >= 0.75) {
    threatTier = {
      code: 'CRITICAL',
      name: dict.hudThreatLevel4,
      badgeClass: 'text-[#ff3838] border-[#ff3838] bg-[#ff3838]/20 font-bold',
      barGradient: 'from-[#e74c3c] to-[#ff3838]',
      containerBorder: 'border-[#ff3838]',
      textColor: 'text-[#ff3838]',
      dotClass: 'bg-[#ff3838]',
      pulseClass: 'animate-pulse'
    };
  } else if (threatScore >= 50 || depthRatio >= 0.45) {
    threatTier = {
      code: 'SEVERE',
      name: dict.hudThreatLevel3,
      badgeClass: 'text-[#e67e22] border-[#e67e22] bg-[#e67e22]/20 font-bold',
      barGradient: 'from-[#d35400] to-[#e67e22]',
      containerBorder: 'border-[#e67e22]',
      textColor: 'text-[#e67e22]',
      dotClass: 'bg-[#e67e22]',
      pulseClass: ''
    };
  } else if (threatScore >= 25 || depthRatio >= 0.2) {
    threatTier = {
      code: 'ELEVATED',
      name: dict.hudThreatLevel2,
      badgeClass: 'text-[#f1c40f] border-[#f1c40f] bg-[#f1c40f]/20 font-bold',
      barGradient: 'from-[#f39c12] to-[#f1c40f]',
      containerBorder: 'border-[#f39c12]',
      textColor: 'text-[#f1c40f]',
      dotClass: 'bg-[#f1c40f]',
      pulseClass: ''
    };
  }

  return (
    <div className={`relative transition-all duration-300 ${isCriticalSanity ? 'hud-container-critical' : ''}`}>
      {/* Critical Low Sanity Screen-Edge Flicker Overlay (<25%) */}
      {isCriticalSanity && (
        <div
          id="criticalSanityScreenFlicker"
          className="fixed inset-0 hud-critical-screen-flicker pointer-events-none z-30"
          aria-hidden="true"
        />
      )}

      {/* Top Header Bar */}
      <div className={`flex justify-between items-center bg-[#14141f] border-2 px-4 py-2 mb-3 text-xs uppercase shadow-inner transition-colors duration-300 ${
        isCriticalSanity ? 'border-[#ff3838] bg-[#1a0808]' : 'border-[#444b6e]'
      }`}>
        <div className="flex gap-3 items-center flex-wrap">
          <span className="text-[#f39c12] font-bold">
            [{campaign}] {mapName}
          </span>
          <span className="text-[#c0c8e0] font-mono">
            {dict.hudChamber} {stage}/{totalStages}
          </span>
          {combo > 1 && (
            <span className="bg-[#b82323]/40 text-[#ff3838] border border-[#ff3838] px-2 py-0.5 text-[0.7rem] font-bold animate-pulse">
              {dict.hudMultiplier} x{combo}
            </span>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-[#ff3838] font-bold hidden sm:inline">{difficultyName}</span>
          <button
            id="gPause"
            className="btn primary py-1 px-3 text-xs"
            onClick={onPause}
          >
            {dict.hudBtnPause}
          </button>
        </div>
      </div>

      {/* VISUAL REAL-TIME THREAT METER */}
      <div className={`bg-[#0c0d14] border-2 ${threatTier.containerBorder} ${threatTier.pulseClass} p-2.5 mb-3 shadow-md transition-colors duration-500`}>
        {/* Threat Header Details */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${threatTier.dotClass} ${threatScore >= 50 ? 'animate-ping' : ''}`} />
            <div className="font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[0.65rem] text-[#707a9e] uppercase font-bold tracking-wider">
                  {dict.hudThreatMeter}:
                </span>
                <span className={`text-xs font-black tracking-wider uppercase ${threatTier.textColor}`}>
                  {threatTier.name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[0.65rem] px-2 py-0.5 border uppercase font-mono tracking-wider ${threatTier.badgeClass}`}>
              {threatTier.code} // {threatScore}%
            </span>
          </div>
        </div>

        {/* Dynamic Threat Progress Bar with Ticks and Glow */}
        <div className="relative h-4 bg-[#050508] border border-[#444b6e] overflow-hidden threat-scan-glow mb-2">
          {/* Subtle Grid Ticks */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-10 opacity-30">
            <div className="w-px h-full bg-white/40" />
            <div className="w-px h-full bg-white/40" />
            <div className="w-px h-full bg-white/40" />
            <div className="w-px h-full bg-white/40" />
            <div className="w-px h-full bg-white/40" />
          </div>

          {/* Color-Coded Animated Threat Fill */}
          <div
            id="threatFill"
            className={`h-full bg-gradient-to-r ${threatTier.barGradient} transition-all duration-500 ease-out`}
            style={{ width: `${threatScore}%` }}
          />
        </div>

        {/* Real-time Sub-Metrics Breakdown Bar */}
        <div className="grid grid-cols-3 gap-2 text-[0.65rem] font-mono border-t border-[#1f2338] pt-1.5 text-[#8e98b7]">
          <div className="flex items-center gap-1 overflow-hidden truncate">
            <span className="text-[#707a9e]">{dict.hudSubChamberDepth}:</span>
            <span className="text-white font-bold truncate">
              {stage}/{totalStages} ({Math.round(depthRatio * 100)}%)
            </span>
          </div>
          <div className="flex items-center gap-1 justify-center overflow-hidden truncate">
            <span className="text-[#707a9e]">{dict.hudSubHostileDensity}:</span>
            <span className={`font-bold truncate ${threatTier.textColor}`}>
              {enemyStatus.densityScore}%
            </span>
          </div>
          <div className="flex items-center gap-1 justify-end overflow-hidden truncate">
            <span className="text-[#707a9e]">{dict.hudSubActiveHazard}:</span>
            <span className={`font-bold truncate ${hazardStatus.active ? 'text-[#f39c12]' : 'text-[#2ecc71]'}`}>
              {hazardStatus.active ? `LVL ${hazardStatus.severity}` : 'STABLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Telemetry Gauges with dynamic glow & status pulse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Sanity Bar */}
        <div className={`${sanityContainerClass} h-7 relative overflow-hidden shadow-inner transition-colors duration-300 rounded-sm`}>
          <div
            id="sanityFill"
            className={`h-full transition-all duration-500 ease-out ${
              sanityPulse === 'gold' 
                ? 'bg-[#f39c12]' 
                : sanityClamped <= 25 
                  ? 'bg-[#ff2020] animate-pulse' 
                  : 'bg-[#ff3838]'
            }`}
            style={{ width: `${sanityClamped}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-3 text-[0.7rem] font-bold text-white tracking-widest text-shadow drop-shadow z-10 pointer-events-none">
            <span className="flex items-center gap-1.5">
              <span>{dict.hudNeuralStability}: {sanityClamped}%</span>
              {sanityClamped <= 25 && (
                <span className="text-[#ff3838] bg-[#000]/70 px-1 py-0.2 text-[0.6rem] border border-[#ff3838] animate-pulse">
                  CRITICAL
                </span>
              )}
            </span>
            {sanityDeltaText && (
              <span className={`font-black font-mono px-1.5 py-0.5 rounded text-[0.65rem] border ${
                sanityPulse === 'gold'
                  ? 'text-[#f39c12] bg-[#2d2614] border-[#f39c12] animate-bounce'
                  : 'text-[#ff3838] bg-[#2a0808] border-[#ff3838] animate-bounce'
              }`}>
                {sanityDeltaText}
              </span>
            )}
          </div>
        </div>

        {/* Corruption Bar */}
        <div className={`${corruptContainerClass} h-7 relative overflow-hidden shadow-inner transition-colors duration-300 rounded-sm`}>
          <div
            id="corruptFill"
            className={`h-full transition-all duration-500 ease-out relative ${
              corruptPulse === 'red'
                ? 'bg-[#ff3838]'
                : isCorruptionDecaying
                  ? 'bg-gradient-to-r from-[#2ecc71] via-[#f39c12] to-[#e67e22]'
                  : corruptClamped >= 75
                    ? 'bg-[#e67e22] animate-pulse'
                    : 'bg-[#f39c12]'
            }`}
            style={{ width: `${corruptClamped}%` }}
          >
            {isCorruptionDecaying && <div className="corruption-purge-stream" />}
          </div>
          <div className="absolute inset-0 flex items-center justify-between px-3 text-[0.7rem] font-bold text-white tracking-widest text-shadow drop-shadow z-10 pointer-events-none">
            <span className="flex items-center gap-1.5">
              <span>{dict.hudAbyssalCorruption}: {corruptClamped}%</span>
              {isCorruptionDecaying ? (
                <span className="text-[#2ecc71] bg-[#000]/80 px-1.5 py-0.2 text-[0.6rem] border border-[#2ecc71] font-mono animate-pulse flex items-center gap-1">
                  <span>▼</span>
                  <span>{dict.hudCorruptionDecayActive || 'DECAY PURGING'}</span>
                </span>
              ) : corruptClamped >= 75 ? (
                <span className="text-[#ff3838] bg-[#000]/70 px-1 py-0.2 text-[0.6rem] border border-[#ff3838] animate-pulse">
                  SURGE
                </span>
              ) : hasCorruptionDecay && corruptClamped > 0 && sanityClamped < decayThreshold ? (
                <span className="text-[#f39c12]/80 bg-[#000]/65 px-1.5 py-0.2 text-[0.58rem] border border-[#f39c12]/40 font-mono hidden md:inline-block">
                  {`MAINTAIN ≥${decayThreshold}% SANITY TO PURGE`}
                </span>
              ) : null}
            </span>
            {corruptDeltaText && (
              <span className={`font-black font-mono px-1.5 py-0.5 rounded text-[0.65rem] border ${
                corruptPulse === 'gold'
                  ? 'text-[#f39c12] bg-[#2d2614] border-[#f39c12] animate-bounce'
                  : 'text-[#ff3838] bg-[#2a0808] border-[#ff3838] animate-bounce'
              }`}>
                {corruptDeltaText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action shortcuts & Score */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0e0f17] border border-[#444b6e] p-2 mb-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1">
          <button onClick={onQuickHeal} className="btn py-1 px-2.5 text-[0.7rem] gold min-h-[36px]">
            {dict.hudBtnHeal}
          </button>
          <button onClick={onOpenGear} className="btn py-1 px-2.5 text-[0.7rem] min-h-[36px]">
            {dict.hudBtnGear}
          </button>
          <button onClick={onOpenHelp} className="btn py-1 px-2.5 text-[0.7rem] min-h-[36px]">
            {dict.hudBtnGuide}
          </button>
          <button onClick={onSave} className="btn py-1 px-2.5 text-[0.7rem] min-h-[36px]">
            {dict.hudBtnSave}
          </button>
        </div>

        <div className="font-mono text-right shrink-0">
          <span className="text-[#707a9e] text-[0.7rem] mr-2">{dict.hudScore}:</span>
          <span className="text-[#f39c12] font-bold text-sm">{Math.floor(score)}</span>
        </div>
      </div>
    </div>
  );
};
