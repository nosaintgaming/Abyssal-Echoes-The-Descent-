import { GearSynergy } from '../types';

export const GEAR_SYNERGIES: GearSynergy[] = [
  {
    id: 'syn_void_overcharge',
    name: 'SINGULARITY OVERCHARGE',
    tag: '[GEAR SYNERGY // SINGULARITY ARC]',
    relics: ['relic_shard', 'relic_battery'],
    relicNames: ['Singularity Shard', 'Overcharged Core Battery'],
    desc: 'Combines singularity gravitational resonance with high-discharge battery plasma, collapsing hostile pack formations.',
    flavor: 'You route the overcharged core battery directly into the Singularity Shard. A roaring sub-atomic gravity wave tears through the corridor, obliterating hostiles with zero psychic strain.',
    combatEffect: 'Nullifies swarm damage, purges corruption, and grants maximum score telemetry.',
    sanityDelta: 14,
    corruptDelta: -8,
    bonusScore: 1600,
    winChance: 0.99,
    hazardMitigation: true
  },
  {
    id: 'syn_neural_bastion',
    name: 'NEURAL BASTION',
    tag: '[GEAR SYNERGY // MIND FORTRESS]',
    relics: ['relic_neural', 'relic_pendant'],
    relicNames: ['Cerebral Governor Chip', 'Weeping Silver Pendant'],
    desc: 'Stabilizes neural feedback loops against psychological terror shocks, transmuting cognitive horror into pure mental focus.',
    flavor: 'The governor chip and weeping pendant resonate at counter-harmonic frequencies. The cognitive screams of apex stalkers are converted into calming neural rhythm.',
    combatEffect: 'Massive sanity restoration and severe corruption dampening in high-density sectors.',
    sanityDelta: 24,
    corruptDelta: -12,
    bonusScore: 1250,
    winChance: 0.98
  },
  {
    id: 'syn_scorch_excision',
    name: 'PYROTECHNIC EXCISION',
    tag: '[GEAR SYNERGY // THERMITE SCALPEL]',
    relics: ['relic_flare', 'relic_scalpel'],
    relicNames: ['Magnesium Emergency Flare', 'Rusted Bio-Scalpel'],
    desc: 'Thermite ignition along the bio-scalpel edge severs neural ganglia and burns bio-mass across attacking hordes.',
    flavor: 'You strike the flare against the bio-scalpel, igniting superheated magnesium along the blade. You carve through the charging pack in a blinding arc of flame.',
    combatEffect: 'Instant pack dispersal with zero sanity penalty and massive score multipliers.',
    sanityDelta: 6,
    corruptDelta: 0,
    bonusScore: 1450,
    winChance: 0.99
  },
  {
    id: 'syn_abyssal_dominion',
    name: 'ABYSSAL DOMINION',
    tag: '[GEAR SYNERGY // SOVEREIGN BLOOD]',
    relics: ['relic_crown', 'relic_tome'],
    relicNames: ['The Submerged Crown', 'The Bleeding Codex'],
    desc: 'Ancient sovereign authority and forbidden codex chants force aberrant predators to bow and dismantle each other.',
    flavor: 'Crowning your brow while reciting forbidden passages from the Bleeding Codex, your psychic footprint expands exponentially. The subterranean horrors halt in worship.',
    combatEffect: 'Supreme telemetry yield, sanity surge, and total enemy submission.',
    sanityDelta: 16,
    corruptDelta: 4,
    bonusScore: 2200,
    winChance: 0.98,
    secretUnlock: true
  },
  {
    id: 'syn_cryo_hazmat',
    name: 'HERMETIC CRYO-EXOSUIT',
    tag: '[GEAR SYNERGY // ABSOLUTE ZERO SHIELD]',
    relics: ['relic_mask', 'relic_flask'],
    relicNames: ['Lead Gas Respirator', 'Mercury Stasis Flask'],
    desc: 'Flash-freezes environmental atmosphere while lead gaskets provide 100% hermetic isolation against toxic gas, radiation, and thermal stalkers.',
    flavor: 'Mercury stasis coolant pumps through respirator channels, instantly condensing bio-toxic clouds into harmless frost crystals and dampening predator thermal vision.',
    combatEffect: 'Total ambient hazard immunity, sanity fortification, and clean swarm bypass.',
    sanityDelta: 14,
    corruptDelta: -4,
    bonusScore: 1100,
    winChance: 0.97,
    hazardMitigation: true
  },
  {
    id: 'syn_chrono_mirage',
    name: 'CHRONO-SPECTRAL MIRAGE',
    tag: '[GEAR SYNERGY // REFRACTIVE TIMELINE]',
    relics: ['relic_compass', 'relic_prism'],
    relicNames: ['Broken Chrono-Compass', 'Refractive Quartz Prism'],
    desc: 'Splits temporal signatures across refractive quartz crystals, creating holographic temporal decoys that lure enemy swarms into dead-end chasms.',
    flavor: 'The broken chrono-compass spins wildly inside the quartz prism, refracting five duplicate timelines into the darkness. Swarming predators pounce on empty optical ghosts.',
    combatEffect: 'Safe evasive maneuver with high sanity preservation and timeline stability.',
    sanityDelta: 18,
    corruptDelta: -6,
    bonusScore: 1300,
    winChance: 0.97
  },
  {
    id: 'syn_phosphor_oracle',
    name: 'PHOSPHOR CLAIRVOYANCE',
    tag: '[GEAR SYNERGY // OBSIDIAN PHOSPHOR]',
    relics: ['relic_skull', 'relic_eye'],
    relicNames: ['Engraved Phosphor Skull', 'Obsidian Third Eye'],
    desc: 'Fuses obsidian dimensional perception with phosphor pacification to reveal hidden chamber veins and soothe subterranean horrors.',
    flavor: 'The engraved skull radiates pale turquoise light while the Obsidian Eye opens within your mind. You see every hidden fracture in the abyssal bedrock and pacify the stalking horrors.',
    combatEffect: 'Unlocks secret map coordinates, grants deep sanity recovery, and completely pacifies apex entities.',
    sanityDelta: 16,
    corruptDelta: 0,
    bonusScore: 1750,
    winChance: 0.99,
    secretUnlock: true
  },
  {
    id: 'syn_void_juggernaut',
    name: 'EVENT HORIZON BULWARK',
    tag: '[GEAR SYNERGY // VOID REINFORCEMENT]',
    relics: ['relic_void', 'relic_band'],
    relicNames: ['Void Singularity Ring', 'Torn Military Dogtags'],
    desc: 'Binds veteran military resolve with event-horizon spatial distortion to shrug off lethal kinetic collisions and crushing pressure.',
    flavor: 'The Void Ring projects a localized gravitational event horizon over your military dogtags, absorbing the kinetic momentum of charging behemoths and crushing them under their own weight.',
    combatEffect: 'Guaranteed combat triumph with extreme resilience and score boost.',
    sanityDelta: 20,
    corruptDelta: -8,
    bonusScore: 1800,
    winChance: 1.0,
    hazardMitigation: true
  },
  {
    id: 'syn_saline_governor',
    name: 'NEURAL CRYO-FLUSH',
    tag: '[GEAR SYNERGY // COGNITIVE SALINE]',
    relics: ['relic_vial', 'relic_neural'],
    relicNames: ['Cold Saline Vial', 'Cerebral Governor Chip'],
    desc: 'Pumps ice-cold neurological stabilizer directly into the governor chip, purging hallucinations and restoring peak reflex speed.',
    flavor: 'Chilled saline floods your cerebral governor, creating an intense rush of sub-zero clarity. Hallucinatory phantoms dissolve immediately into cold numbers and reaction lines.',
    combatEffect: 'Maximum immediate sanity restoration (+28) and deep corruption purge (-15).',
    sanityDelta: 28,
    corruptDelta: -15,
    bonusScore: 1150,
    winChance: 0.96
  },
  {
    id: 'syn_bulkhead_overdrive',
    name: 'BULKHEAD LOCKDOWN OVERDRIVE',
    tag: '[GEAR SYNERGY // SECURITY LOCKDOWN]',
    relics: ['relic_key', 'relic_battery'],
    relicNames: ['Skeleton Security Pass', 'Overcharged Core Battery'],
    desc: 'Overcharges station security bus lines, triggering heavy hydraulic blast bulkheads to crush charging hostiles instantly.',
    flavor: 'You bridge the battery cell into the skeleton key card reader. Heavy steel blast doors slam shut down the hallway, bisecting the charging predator vanguard.',
    combatEffect: 'Crushes entity threat density, prevents pursuit, and secures sector telemetry.',
    sanityDelta: 10,
    corruptDelta: -2,
    bonusScore: 1400,
    winChance: 0.98,
    hazardMitigation: true
  }
];

export function getActiveSynergies(equippedRelics: string[]): GearSynergy[] {
  return GEAR_SYNERGIES.filter(syn => 
    syn.relics.every(relicId => equippedRelics.includes(relicId))
  );
}

export function isHighDensityCombat(
  enemyDensity: number,
  threatLevel: string,
  enemyMultiplier: number
): boolean {
  return (
    enemyDensity >= 40 ||
    ['PACK_HUNT', 'SWARMING', 'APEX_STALKER', 'COGNITIVE_NIGHTMARE'].includes(threatLevel) ||
    enemyMultiplier >= 1.2
  );
}
