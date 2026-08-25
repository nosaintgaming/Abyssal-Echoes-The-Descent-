import { 
  CampaignId, 
  DifficultyData, 
  MapData, 
  TacticalOption, 
  HazardStatus, 
  EnemyStatus, 
  EnemyThreatLevel, 
  HazardType 
} from '../types';
import { getActiveSynergies, isHighDensityCombat } from '../data/synergies';

export function calculateEnemyStatus(
  stage: number, 
  totalStages: number, 
  diff: DifficultyData, 
  map: MapData, 
  campaign: CampaignId
): EnemyStatus {
  const depthRatio = Math.min(1, Math.max(0, (stage - 1) / Math.max(1, totalStages - 1)));
  const mapBase = (map.baseThreat || 1) / 10;
  const campaignMod = campaign === 'I' ? 1.0 : campaign === 'II' ? 1.25 : 1.5;
  
  // Base raw density from 10 to 100
  const rawDensity = (15 + depthRatio * 65 + mapBase * 20) * diff.enemyMultiplier * campaignMod;
  const densityScore = Math.min(100, Math.round(rawDensity));

  let threatLevel: EnemyThreatLevel = 'DORMANT';
  let aggressionName = 'NORMAL';

  if (densityScore > 85 || depthRatio >= 0.85) {
    threatLevel = 'COGNITIVE_NIGHTMARE';
    aggressionName = 'APEX OVERLOAD';
  } else if (densityScore > 70 || depthRatio >= 0.70) {
    threatLevel = 'APEX_STALKER';
    aggressionName = 'APEX PREDATOR';
  } else if (densityScore > 50 || depthRatio >= 0.45) {
    threatLevel = 'SWARMING';
    aggressionName = 'SWARM HOSTILE';
  } else if (densityScore > 35 || depthRatio >= 0.25) {
    threatLevel = 'PACK_HUNT';
    aggressionName = 'HUNTING PACKS';
  } else if (densityScore > 20) {
    threatLevel = 'PATROLLING';
    aggressionName = 'ACTIVE PATROL';
  } else {
    threatLevel = 'SPARSE';
    aggressionName = 'SPARSE ECHOES';
  }

  const enemyNames = [
    'Subterranean Stalkers',
    'Biomechanical Carcass Leech',
    'Abyssal Lurker Brood',
    'Chittering Void Swarm',
    'Neural Phosphor Parasite',
    'Screaming Hull Crawlers',
    'Black Meridian Specter',
    'Hollow Crown Executioner'
  ];
  const nameIndex = Math.min(enemyNames.length - 1, Math.floor(depthRatio * enemyNames.length));

  return {
    threatLevel,
    densityScore,
    name: enemyNames[nameIndex],
    active: densityScore >= 25,
    aggressionName
  };
}

export function calculateHazardStatus(
  stage: number, 
  totalStages: number, 
  diff: DifficultyData, 
  map: MapData,
  campaign: CampaignId
): HazardStatus {
  const depthRatio = Math.min(1, Math.max(0, (stage - 1) / Math.max(1, totalStages - 1)));
  const campaignMod = campaign === 'I' ? 1.0 : campaign === 'II' ? 1.2 : 1.4;
  const hazardFrequencyScore = (depthRatio * 80 + 15) * diff.hazardMultiplier * campaignMod;
  const active = Math.random() * 100 < Math.min(95, hazardFrequencyScore);

  const hazardTypes: { type: HazardType; name: string; desc: string }[] = [
    { type: 'PRESSURE_SURGE', name: 'Catastrophic Pressure Surge', desc: 'Oceanic depths groan through buckled seams, threatening violent bulkhead implosion.' },
    { type: 'TOXIC_VENT', name: 'Corrosive Neuro-Toxin Vent', desc: 'Acrid caustic fumes breach ventilation shafts, rapidly dissolving bio-filters.' },
    { type: 'RADIATION_PULSE', name: 'Unshielded Reactor Radiation', desc: 'High-intensity ionizing decay floods corridors with blinding radioactive static.' },
    { type: 'CRYO_LEAK', name: 'Flash-Freeze Cryogenic Rupture', desc: 'Liquid coolant spills across steel catwalks, dropping temperatures to sub-zero shock.' },
    { type: 'SEISMIC_SHOCK', name: 'Sub-Crustal Tectonic Tremor', desc: 'Fault line grinding collapses ceiling arches and severs emergency communication links.' },
    { type: 'VOID_DISTORTION', name: 'Non-Euclidean Spatial Tear', desc: 'Geometric angles bend backwards; shadows move independently of light sources.' },
    { type: 'ACOUSTIC_FEEDBACK', name: 'Psychotronic Sonic Screech', desc: 'Terminal speakers scream at resonance frequencies that destabilize cerebral synapses.' }
  ];

  const typeIndex = (stage + (map.id % 5)) % hazardTypes.length;
  const chosen = hazardTypes[typeIndex];
  const severity = Math.min(5, Math.max(1, Math.floor(depthRatio * 4 + 1)));

  return {
    type: chosen.type,
    severity,
    name: chosen.name,
    desc: chosen.desc,
    active
  };
}

export function generateScaledOptions(
  stage: number,
  totalStages: number,
  diff: DifficultyData,
  map: MapData,
  campaign: CampaignId,
  enemy: EnemyStatus,
  hazard: HazardStatus,
  loadout: string[]
): TacticalOption[] {
  const depthRatio = Math.min(1, Math.max(0, (stage - 1) / Math.max(1, totalStages - 1)));
  const isDeep = depthRatio > 0.6;
  const isApex = depthRatio > 0.85;
  const scale = 1 + depthRatio * 0.85 * diff.enemyMultiplier;

  // Gear Synergy Check
  const activeSynergies = getActiveSynergies(loadout);
  const isHighDensity = isHighDensityCombat(enemy.densityScore, enemy.threatLevel, diff.enemyMultiplier);

  // Passive stat modifications derived from active gear synergies during high-density encounters
  const synergySanityMult = isHighDensity && activeSynergies.length > 0 ? 0.6 : 1.0;
  const synergyWinChanceBuff = isHighDensity && activeSynergies.length > 0 ? Math.min(0.20, 0.08 * activeSynergies.length) : 0;
  const synergyScoreBuff = isHighDensity && activeSynergies.length > 0 ? 250 * activeSynergies.length : 0;

  const options: TacticalOption[] = [];

  // 1. COMBAT / AGGRESSIVE BREACH OPTION (Buffed by Gear Synergy if active)
  const baseCombatSanityCost = Math.round((14 + depthRatio * 18) * scale);
  const combatSanityCost = Math.max(4, Math.round(baseCombatSanityCost * synergySanityMult));
  const combatCorruptGain = Math.round(6 + depthRatio * 10);
  const combatScore = Math.round((180 + depthRatio * 320) * (diff.enemyMultiplier >= 1.5 ? 1.5 : 1.0) + synergyScoreBuff);
  const combatWinChance = Math.max(0.25, Math.min(0.96, (0.80 - depthRatio * 0.40) * diff.winChance + synergyWinChanceBuff));

  const combatTag = isHighDensity && activeSynergies.length > 0
    ? `[ENEMY DENSITY: ${enemy.densityScore}% // ⚡ SYNERGY EMPOWERED]`
    : `[ENEMY DENSITY: ${enemy.densityScore}% // ${enemy.aggressionName}]`;

  options.push({
    id: 'opt_combat',
    title: isApex 
      ? 'CONFRONT THE APEX ENTITY WITH OVERCHARGED FLUX'
      : isDeep 
        ? 'DISCHARGE WEAPONS INTO THE ENEMY SWARM' 
        : 'PRY OPEN THE SEALED BULKHEAD & ENGAGE ROAMERS',
    tag: combatTag,
    flavor: isDeep 
      ? `Cut through the ${enemy.name}. ${activeSynergies.length > 0 ? `Equipped gear synergies (${activeSynergies.map(s => s.name).join(', ')}) dampen recoil and stabilize neural feedback.` : 'High enemy density increases risk, but clears the forward pathway.'}`
      : `Advance aggressively through hostile patrol vectors to secure the chamber core.`,
    category: 'combat',
    riskLabel: `Sanity -${combatSanityCost}, Corrupt +${combatCorruptGain}, Score +${combatScore}`,
    sanityDelta: -combatSanityCost,
    corruptDelta: combatCorruptGain,
    bonusScore: combatScore,
    winChance: combatWinChance
  });

  // 2. STEALTH / EVASION OPTION
  const baseStealthSanityCost = Math.round((8 + depthRatio * 12) * scale);
  const stealthSanityCost = Math.max(2, Math.round(baseStealthSanityCost * synergySanityMult));
  const stealthCorruptGain = Math.round(10 + depthRatio * 12);
  const stealthScore = Math.round(120 + depthRatio * 180 + synergyScoreBuff * 0.75);
  const stealthWinChance = Math.max(0.30, Math.min(0.96, (0.75 - depthRatio * 0.25) * diff.winChance + synergyWinChanceBuff));

  options.push({
    id: 'opt_stealth',
    title: isApex
      ? 'DOUSE ALL SIGNALS & CRAWL THROUGH SEVERED CONDUITS'
      : isDeep
        ? 'SLIP THROUGH SHADOWS TO CIRCUMVENT THE SWARM'
        : 'KILL ILLUMINATION & ADVANCE UNDER SILENT PROTOCOL',
    tag: isHighDensity && activeSynergies.length > 0 ? '[TACTICAL EVASION // ⚡ SYNERGY DAMPENED]' : '[TACTICAL EVASION // SUPPRESS NOISE]',
    flavor: `Bypass the ${enemy.name} without triggering pack aggression. Dampens telemetry exposure.`,
    category: 'stealth',
    riskLabel: `Sanity -${stealthSanityCost}, Corrupt +${stealthCorruptGain}, Noise -25, Score +${stealthScore}`,
    sanityDelta: -stealthSanityCost,
    corruptDelta: stealthCorruptGain,
    noiseDelta: -25,
    bonusScore: stealthScore,
    winChance: stealthWinChance
  });

  // 3. GEAR SYNERGY EXCLUSIVE TACTICAL OPTIONS (High-density combat power spikes)
  if (activeSynergies.length > 0 && (isHighDensity || stage >= 2)) {
    activeSynergies.forEach(syn => {
      options.push({
        id: `opt_${syn.id}`,
        title: `[${syn.name}] ${syn.combatEffect.toUpperCase()}`,
        tag: syn.tag,
        flavor: syn.flavor,
        category: 'synergy',
        riskLabel: `Sanity ${syn.sanityDelta >= 0 ? '+' + syn.sanityDelta : syn.sanityDelta}, Corrupt ${syn.corruptDelta >= 0 ? '+' + syn.corruptDelta : syn.corruptDelta}, Score +${syn.bonusScore}`,
        sanityDelta: syn.sanityDelta,
        corruptDelta: syn.corruptDelta,
        bonusScore: syn.bonusScore,
        winChance: syn.winChance,
        hazardMitigation: syn.hazardMitigation,
        secretUnlock: syn.secretUnlock,
        synergyName: syn.name,
        synergyRelics: [...syn.relics],
        synergyBonusDesc: syn.desc
      });
    });
  }

  // 3. HAZARD CONTAINMENT / RECOVERY OPTION
  const hazardSanityCost = hazard.active ? Math.round((10 + hazard.severity * 4) * scale) : Math.round(-12 / scale);
  const hazardCorruptGain = Math.round(5 + depthRatio * 8);
  const hazardScore = Math.round(140 + depthRatio * 200);
  const hazardWinChance = Math.max(0.35, Math.min(0.92, (0.85 - depthRatio * 0.30) * diff.winChance));

  options.push({
    id: 'opt_hazard',
    title: hazard.active
      ? `CONTAIN ${hazard.name.toUpperCase()} VIA MANUAL VALVES`
      : 'STABILIZE NEURAL INTERFACE & REINFORCE HULL SEALS',
    tag: hazard.active ? `[ACTIVE HAZARD: LEVEL ${hazard.severity}]` : '[NEURAL RESTORATION]',
    flavor: hazard.active
      ? `${hazard.desc} Diverting auxiliary power neutralizes ongoing environmental trauma.`
      : 'Take a calculated pause to restore cognitive coherence before plunging into deeper sectors.',
    category: 'neutralize',
    riskLabel: hazard.active 
      ? `Sanity -${hazardSanityCost}, Corrupt +${hazardCorruptGain}, Mitigates Hazard` 
      : `Sanity +14, Corrupt +${hazardCorruptGain}, Score +${hazardScore}`,
    sanityDelta: hazard.active ? -hazardSanityCost : 14,
    corruptDelta: hazardCorruptGain,
    bonusScore: hazardScore,
    winChance: hazardWinChance,
    hazardMitigation: true
  });

  // 4. ANOMALOUS GAMBIT / RELIC EXTRACTION
  const gambitSanityCost = Math.round((20 + depthRatio * 22) * scale);
  const gambitCorruptGain = Math.round(18 + depthRatio * 15);
  const gambitScore = Math.round((350 + depthRatio * 600) * (diff.enemyMultiplier >= 1.5 ? 1.8 : 1.2));
  const gambitWinChance = Math.max(0.18, Math.min(0.65, (0.50 - depthRatio * 0.25) * diff.winChance));

  options.push({
    id: 'opt_gambit',
    title: isApex 
      ? 'HARVEST THE SINGULARITY CORE BENEATH THE HORROR' 
      : 'EXTRACT THE PULSING ANOMALOUS RELIC CASING',
    tag: '[HIGH RISK // ANOMALOUS DRILL]',
    flavor: 'Severe psychological trauma and explosive corruption risk, but offers massive telemetry yield and possible relic discovery.',
    category: 'gamble',
    riskLabel: `Sanity -${gambitSanityCost}, Corrupt +${gambitCorruptGain}, Score +${gambitScore}`,
    sanityDelta: -gambitSanityCost,
    corruptDelta: gambitCorruptGain,
    bonusScore: gambitScore,
    winChance: gambitWinChance
  });

  // 5. MEMORY ECHO OPTION (Deeper chambers sanity recovery mechanic)
  const isEchoCandidate = depthRatio >= 0.35 || stage >= 3;
  if (isEchoCandidate) {
    const echoHeal = Math.min(26, Math.max(12, Math.round(14 + depthRatio * 10)));
    const echoScore = Math.round(150 + depthRatio * 250);
    const echoCorrupt = Math.max(0, Math.round(2 + depthRatio * 3));

    const echoMemories = [
      {
        title: 'CHANNEL RESIDUAL CREW MEMORY ECHO',
        flavor: 'A glowing psychic imprint of a lost expedition member lingers in the chamber. Reconnecting with their human thoughts restores cognitive stability.',
        tag: '[MEMORY ECHO // SANITY RESTORE]'
      },
      {
        title: 'COMMUNE WITH CRYSTALLIZED MEMORY ESSENCE',
        flavor: 'Phosphorescent neural residue coats the bulkheads. Absorbing the calming harmonic frequency eases psychological panic and re-anchors sanity.',
        tag: '[MEMORY ECHO // PSYCHE RECOVERY]'
      },
      {
        title: 'DECIPHER SURVIVOR AUDIO LOG & FAMILIAR VOICES',
        flavor: 'Faint static from an old communicator plays warm, familiar voices from the surface, clearing mental fog and soothing acute psychosis.',
        tag: '[MEMORY ECHO // COGNITIVE ANCHOR]'
      },
      {
        title: 'SYNCHRONIZE WITH ASTRONAVIGATOR’S REMNANT SOUL',
        flavor: 'A calm mathematical cadence left behind by an ancient navigator stabilizes your neural impulses against the abyssal horrors.',
        tag: '[MEMORY ECHO // NEURAL RESTORATION]'
      }
    ];

    const echoIndex = (stage + map.id) % echoMemories.length;
    const selectedEcho = echoMemories[echoIndex];

    options.push({
      id: 'opt_memory_echo',
      title: selectedEcho.title,
      tag: selectedEcho.tag,
      flavor: selectedEcho.flavor,
      category: 'echo',
      riskLabel: `Sanity +${echoHeal}, Corrupt +${echoCorrupt}, Score +${echoScore}`,
      sanityDelta: echoHeal,
      corruptDelta: echoCorrupt,
      bonusScore: echoScore,
      winChance: 0.92,
      memoryEcho: true
    });
  }

  // 6. CONTEXTUAL / RELIC OPTIONS
  if (loadout.includes('relic_eye') && (stage % 2 === 0 || isDeep)) {
    options.push({
      id: 'opt_relic_eye',
      title: '[OBSIDIAN EYE] PROJECT OBSIDIAN VISION OVER BLIND ZONES',
      tag: '[RELIC MASTERY // SECRET DISCOVERY]',
      flavor: 'Peer into impossible subterranean dimensions to map secret pathways and evade ambushes completely.',
      category: 'relic',
      riskLabel: 'Sanity -6, Reveals Secret Map Coordinates, Score +750',
      sanityDelta: -6,
      corruptDelta: 2,
      bonusScore: 750,
      winChance: 0.95,
      secretUnlock: true,
      relicRequired: 'relic_eye'
    });
  } else if (loadout.includes('relic_mask') && hazard.type === 'TOXIC_VENT') {
    options.push({
      id: 'opt_relic_mask',
      title: '[GAS RESPIRATOR] SEAL LEAD GASKETS & MARCH THROUGH TOXICITY',
      tag: '[RELIC IMMUNITY]',
      flavor: 'The heavy lead filter negates corrosive vapors entirely.',
      category: 'relic',
      riskLabel: 'Sanity -2, Corrupt +0, Complete Hazard Immunity, Score +400',
      sanityDelta: -2,
      corruptDelta: 0,
      bonusScore: 400,
      winChance: 0.98,
      hazardMitigation: true,
      relicRequired: 'relic_mask'
    });
  } else if (loadout.includes('relic_flare') && enemy.densityScore > 60) {
    options.push({
      id: 'opt_relic_flare',
      title: '[MAGNESIUM FLARE] IGNITE BLINDING PYROTECHNIC CONE',
      tag: '[SWARM SUPPRESSION]',
      flavor: 'Blinds and repels the creeping hostiles, instantly breaking their aggressive charge.',
      category: 'relic',
      riskLabel: 'Sanity -4, Corrupt +3, Disperses Swarms, Score +500',
      sanityDelta: -4,
      corruptDelta: 3,
      bonusScore: 500,
      winChance: 0.95,
      relicRequired: 'relic_flare'
    });
  } else if (loadout.includes('relic_skull') && (isDeep || enemy.threatLevel === 'APEX_STALKER')) {
    options.push({
      id: 'opt_relic_skull',
      title: '[PHOSPHOR SKULL] CHANNEL BLUE RESONANCE PULSE',
      tag: '[RELIC PACIFICATION]',
      flavor: 'Emits an ancient hypnotic glow that temporarily calms even the most ravenous horrors.',
      category: 'relic',
      riskLabel: 'Sanity +5, Corrupt +8, Pacifies Threat, Score +450',
      sanityDelta: 5,
      corruptDelta: 8,
      bonusScore: 450,
      winChance: 0.92,
      relicRequired: 'relic_skull'
    });
  }

  return options;
}
