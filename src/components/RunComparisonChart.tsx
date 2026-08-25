import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

export interface RunComparisonData {
  isVictory: boolean;
  runSanityLost: number;
  careerAvgSanityLost: number;
  runChambersCleared: number;
  totalChambersInMap: number;
  careerAvgChambers: number;
  runScore: number;
  careerAvgScore: number;
  totalCareerRuns: number;
}

interface RunComparisonChartProps {
  data: RunComparisonData;
}

export const RunComparisonChart: React.FC<RunComparisonChartProps> = ({ data }) => {
  const { dict, t } = useTranslation();
  const {
    isVictory,
    runSanityLost,
    careerAvgSanityLost,
    runChambersCleared,
    totalChambersInMap,
    careerAvgChambers,
    runScore,
    careerAvgScore,
    totalCareerRuns
  } = data;

  // Normalizations for bar scales
  const maxSanityScale = Math.max(100, Math.ceil(Math.max(runSanityLost, careerAvgSanityLost) / 20) * 20);
  const runSanityPct = Math.min(100, Math.max(2, (runSanityLost / maxSanityScale) * 100));
  const careerSanityPct = Math.min(100, Math.max(2, (careerAvgSanityLost / maxSanityScale) * 100));

  const maxChamberScale = Math.max(totalChambersInMap, Math.ceil(careerAvgChambers));
  const runChamberPct = Math.min(100, Math.max(4, (runChambersCleared / maxChamberScale) * 100));
  const careerChamberPct = Math.min(100, Math.max(4, (careerAvgChambers / maxChamberScale) * 100));

  // Deltas
  const sanityDelta = Math.round((runSanityLost - careerAvgSanityLost) * 10) / 10;
  const chamberDelta = Math.round((runChambersCleared - careerAvgChambers) * 10) / 10;

  // Tactical Attrition Ratio (Sanity lost per chamber cleared)
  const runAttritionRate = runChambersCleared > 0 ? Math.round((runSanityLost / runChambersCleared) * 10) / 10 : runSanityLost;
  const careerAttritionRate = careerAvgChambers > 0 ? Math.round((careerAvgSanityLost / careerAvgChambers) * 10) / 10 : careerAvgSanityLost;

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0a0a12] border-2 border-[#373c59] p-3.5 sm:p-4 my-4 text-left font-mono shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d324d] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isVictory ? 'bg-[#2ecc71] animate-pulse' : 'bg-[#ff3838]'}`} />
          <span className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase">
            {dict.chartHeader}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[0.65rem] text-[#8e98b7]">
          <span className="px-1.5 py-0.5 border border-[#444b6e] bg-[#14141f]">
            {dict.chartRunsLogged} <b className="text-white">{totalCareerRuns}</b>
          </span>
          <span className={`px-1.5 py-0.5 border font-bold ${
            isVictory ? 'border-[#2ecc71] text-[#2ecc71] bg-[#2ecc71]/10' : 'border-[#ff3838] text-[#ff3838] bg-[#ff3838]/10'
          }`}>
            {isVictory ? dict.chartStatusExtracted : dict.chartStatusTerminated}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-[0.7rem] mb-3 text-[#a0a8c4]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2.5 bg-gradient-to-r from-[#ff3838] to-[#f39c12] rounded-xs inline-block" />
          <span className="font-bold text-white">{dict.chartThisDescent}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2.5 bg-[#444b6e] border border-[#6f7aa3] rounded-xs inline-block" />
          <span className="text-[#8e98b7]">{dict.chartCareerAverage}</span>
        </div>
      </div>

      {/* COMPARATIVE BAR CHART 1: SANITY BLEED */}
      <div className="mb-4 bg-[#0e101a] border border-[#262a40] p-2.5 sm:p-3">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#ff6b6b]">{dict.chartSanityTitle}</span>
            <span className="text-[0.65rem] text-[#707a9e]">{dict.chartSanitySub}</span>
          </div>
          {totalCareerRuns > 1 && (
            <span className={`text-[0.65rem] px-1.5 py-0.5 border font-bold ${
              sanityDelta <= 0
                ? 'border-[#2ecc71] text-[#2ecc71] bg-[#2ecc71]/15'
                : 'border-[#ff3838] text-[#ff3838] bg-[#ff3838]/15'
            }`}>
              {sanityDelta <= 0 
                ? `▼ ${Math.abs(sanityDelta)}% ${dict.chartBelowAvgBleed}` 
                : `▲ +${sanityDelta}% ${dict.chartAboveAvgBleed}`}
            </span>
          )}
        </div>

        {/* Current Run Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[0.7rem] mb-0.5 text-[#c0c8e0]">
            <span>{dict.chartThisDescent}</span>
            <span className="font-bold text-[#ff3838]">{runSanityLost}% {dict.chartSanityBleedLabel}</span>
          </div>
          <div className="h-3.5 bg-[#141422] border border-[#ff3838]/40 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#ff3838] via-[#e74c3c] to-[#f39c12] transition-all duration-700 ease-out"
              style={{ width: `${runSanityPct}%` }}
            />
          </div>
        </div>

        {/* Career Average Bar */}
        <div>
          <div className="flex justify-between text-[0.7rem] mb-0.5 text-[#8e98b7]">
            <span>{dict.chartCareerAverage}</span>
            <span className="font-bold text-[#85a5ff]">{careerAvgSanityLost}% {dict.chartAvgBleedLabel}</span>
          </div>
          <div className="h-3 bg-[#141422] border border-[#444b6e] overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#444b6e] to-[#6c7aab] transition-all duration-700 ease-out"
              style={{ width: `${careerSanityPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* COMPARATIVE BAR CHART 2: CHAMBER PROGRESSION */}
      <div className="mb-4 bg-[#0e101a] border border-[#262a40] p-2.5 sm:p-3">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#f1c40f]">{dict.chartChamberTitle}</span>
            <span className="text-[0.65rem] text-[#707a9e]">{dict.chartChamberSub}</span>
          </div>
          {totalCareerRuns > 1 && (
            <span className={`text-[0.65rem] px-1.5 py-0.5 border font-bold ${
              chamberDelta >= 0
                ? 'border-[#2ecc71] text-[#2ecc71] bg-[#2ecc71]/15'
                : 'border-[#f39c12] text-[#f39c12] bg-[#f39c12]/15'
            }`}>
              {chamberDelta >= 0 
                ? `▲ +${chamberDelta} ${dict.chartChambersDeeper}` 
                : `▼ ${Math.abs(chamberDelta)} ${dict.chartShorterDescent}`}
            </span>
          )}
        </div>

        {/* Current Run Chamber Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[0.7rem] mb-0.5 text-[#c0c8e0]">
            <span>{dict.chartThisDescent}</span>
            <span className="font-bold text-[#ffd700]">
              {runChambersCleared} / {totalChambersInMap} ({Math.round((runChambersCleared / totalChambersInMap) * 100)}%)
            </span>
          </div>
          <div className="h-3.5 bg-[#141422] border border-[#f1c40f]/40 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#f39c12] via-[#f1c40f] to-[#2ecc71] transition-all duration-700 ease-out"
              style={{ width: `${runChamberPct}%` }}
            />
          </div>
        </div>

        {/* Career Average Chamber Bar */}
        <div>
          <div className="flex justify-between text-[0.7rem] mb-0.5 text-[#8e98b7]">
            <span>{dict.chartCareerAverage}</span>
            <span className="font-bold text-[#00cec9]">
              {careerAvgChambers} {dict.chartAvgChambersLabel}
            </span>
          </div>
          <div className="h-3 bg-[#141422] border border-[#444b6e] overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#2c3e50] to-[#00cec9]/70 transition-all duration-700 ease-out"
              style={{ width: `${careerChamberPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* TACTICAL SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-[#262a40]">
        <div className="bg-[#121422] p-2 border border-[#2d324d] flex flex-col justify-between">
          <span className="text-[0.65rem] text-[#707a9e]">{dict.chartAttritionPerChamber}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-bold text-white text-sm">{runAttritionRate}%</span>
            <span className="text-[0.65rem] text-[#8e98b7]">Avg: {careerAttritionRate}%</span>
          </div>
        </div>

        <div className="bg-[#121422] p-2 border border-[#2d324d] flex flex-col justify-between">
          <span className="text-[0.65rem] text-[#707a9e]">{dict.chartMissionScore}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-bold text-[#f39c12] text-sm">{runScore}</span>
            <span className="text-[0.65rem] text-[#8e98b7]">Avg: {careerAvgScore}</span>
          </div>
        </div>

        <div className="bg-[#121422] p-2 border border-[#2d324d] flex flex-col justify-between">
          <span className="text-[0.65rem] text-[#707a9e]">{dict.chartTacticalEfficiency}</span>
          <div className="mt-1">
            <span className={`font-black text-xs px-1.5 py-0.5 border ${
              isVictory 
                ? 'border-[#2ecc71] text-[#2ecc71] bg-[#2ecc71]/15' 
                : runChamberPct >= 60 
                  ? 'border-[#f1c40f] text-[#f1c40f] bg-[#f1c40f]/15' 
                  : 'border-[#ff3838] text-[#ff3838] bg-[#ff3838]/15'
            }`}>
              {isVictory ? dict.chartClassSurvivor : runChamberPct >= 60 ? dict.chartDeepCombatant : dict.chartAttritionCasualty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
