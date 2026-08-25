import React, { useState, useEffect } from 'react';
import { AudioManager } from '../audio/audioManager';
import { useTranslation } from '../i18n/LanguageContext';

interface BonusGameProps {
  isOpen: boolean;
  onClose: () => void;
  onVictory: () => void;
}

export const BonusGame: React.FC<BonusGameProps> = ({ isOpen, onClose, onVictory }) => {
  const { dict } = useTranslation();
  const [energy, setEnergy] = useState<number>(100);
  const [signal, setSignal] = useState<number>(0);
  const [heat, setHeat] = useState<number>(0);
  const [turn, setTurn] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>(['[00] SIGNAL ACQUIRED. SOMETHING ACQUIRED YOU.']);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isLost, setIsLost] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setEnergy(100);
      setSignal(0);
      setHeat(0);
      setTurn(0);
      setIsWon(false);
      setIsLost(false);
      setLogs(['[00] SIGNAL ACQUIRED. SOMETHING ACQUIRED YOU.']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addLog = (msg: string, currentTurn: number) => {
    const timeStr = String(currentTurn).padStart(2, '0');
    setLogs(prev => [`[${timeStr}] ${msg}`, ...prev.slice(0, 10)]);
  };

  const handleAction = (action: string) => {
    if (isWon || isLost) return;
    AudioManager.playClick();

    const nextTurn = turn + 1;
    setTurn(nextTurn);
    const r = Math.random();

    let newEnergy = energy;
    let newSignal = signal;
    let newHeat = heat;

    if (action === 'scan') {
      newSignal += 14 + (r < 0.25 ? 10 : 0);
      newEnergy -= 6;
      newHeat += 5;
      addLog('Frequency sweep locked onto an encrypted fragment.', nextTurn);
    } else if (action === 'tune') {
      newSignal += 20;
      newEnergy -= 12;
      newHeat += 9;
      addLog('Receiver tuned to resonant frequency. Subterranean whisper clarifies.', nextTurn);
    } else if (action === 'cool') {
      newHeat = Math.max(0, newHeat - 28);
      newEnergy -= 4;
      addLog('Emergency coolant vents purged. Steam hisses loudly in the dark.', nextTurn);
    } else if (action === 'hide') {
      newEnergy -= 2;
      newHeat = Math.max(0, newHeat - 10);
      if (r < 0.5) newSignal += 8;
      addLog('Telemetry transmitters silenced. The anomaly scans nearby blindly.', nextTurn);
    } else if (action === 'boost') {
      newSignal += 32;
      newEnergy -= 24;
      newHeat += 26;
      addLog('OVERDRIVE PULSE: Massive signal capture at severe thermal cost!', nextTurn);
    } else if (action === 'decode') {
      if (signal < 50) {
        newEnergy -= 8;
        newHeat += 12;
        addLog('Decode rejected: Incomplete signal buffer.', nextTurn);
      } else {
        newSignal += 25;
        newEnergy -= 15;
        newHeat += 16;
        addLog('Deep cryptographic layer stripped away. It recognizes your biometric ID.', nextTurn);
      }
    }

    // Passive creep
    newHeat += Math.max(0, nextTurn - 4) * 1.5;
    newEnergy -= Math.random() * 3 + 1;

    setEnergy(Math.max(0, Math.round(newEnergy)));
    setSignal(Math.min(100, Math.round(newSignal)));
    setHeat(Math.min(100, Math.round(newHeat)));

    if (newSignal >= 100) {
      setIsWon(true);
      AudioManager.playSuccess();
      onVictory();
    } else if (newEnergy <= 0 || newHeat >= 100) {
      setIsLost(true);
      AudioManager.playHazard();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020204]/95 flex items-center justify-center p-4 font-mono text-sm text-[#c0c8e0]">
      <div className="bg-[#08080c] border-2 border-[#444b6e] w-full max-w-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#2d324d] pb-3 mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-widest text-[#f39c12]">{dict.bonusModalTitle || 'THE LAST SIGNAL'}</h1>
            <p className="text-[0.7rem] text-[#707a9e]">{dict.bonusModalSubtitle || 'TRANSMISSION RECOVERY INTERFACE // RETRO KERNEL'}</p>
          </div>
          <button className="btn py-1 px-3 text-xs" onClick={onClose}>
            {dict.btnCloseKernel || 'EXIT'}
          </button>
        </div>

        {/* Victory Screen */}
        {isWon ? (
          <div className="text-center py-8">
            <h2 className="text-[#2ecc71] font-bold text-xl mb-2 animate-bounce">{dict.bonusWonTitle || 'SIGNAL FULLY RECOVERED'}</h2>
            <p className="text-sm text-[#c0c8e0] mb-4">{dict.bonusWonDesc || 'You extracted the final encrypted transmission:'}</p>
            <div className="bg-[#0e160e] border border-[#2ecc71] p-4 text-[#2ecc71] font-bold text-lg mb-6">
              "THE DESCENT WAS NEVER DOWN."
            </div>
            <button className="btn primary py-2 px-6" onClick={onClose}>
              {dict.btnReturnToTerminal || 'RETURN TO KERNEL'}
            </button>
          </div>
        ) : isLost ? (
          /* Loss Screen */
          <div className="text-center py-8">
            <h2 className="text-[#ff3838] font-bold text-xl mb-2">{dict.bonusLostTitle || 'SIGNAL LOST // THERMAL SHOCK'}</h2>
            <p className="text-sm text-[#707a9e] mb-6">
              {dict.bonusLostDesc || "The terminal overheated and disconnected. The entity locked onto the transmitter's position."}
            </p>
            <button
              className="btn primary py-2 px-6"
              onClick={() => {
                setEnergy(100);
                setSignal(0);
                setHeat(0);
                setTurn(0);
                setIsWon(false);
                setIsLost(false);
                setLogs(['[00] SIGNAL ACQUIRED. SOMETHING ACQUIRED YOU.']);
              }}
            >
              {dict.btnRetryDescent || 'RETRY TRANSMISSION RECOVERY'}
            </button>
          </div>
        ) : (
          /* Active Gameplay */
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-[#0f101a] border border-[#444b6e] p-2">
                <span className="text-[0.65rem] text-[#707a9e] block">{dict.bonusEnergy || 'CORE ENERGY'}</span>
                <b className="text-base text-[#85a5ff]">{energy}%</b>
              </div>
              <div className="bg-[#0f101a] border border-[#f39c12] p-2">
                <span className="text-[0.65rem] text-[#707a9e] block">{dict.bonusSignal || 'SIGNAL BUFFER'}</span>
                <b className="text-base text-[#f39c12]">{signal}%</b>
              </div>
              <div className="bg-[#0f101a] border border-[#ff3838] p-2">
                <span className="text-[0.65rem] text-[#707a9e] block">{dict.bonusHeat || 'HEAT SINK'}</span>
                <b className="text-base text-[#ff3838]">{heat}%</b>
              </div>
            </div>

            <p className="text-xs text-[#9aa3c2] mb-3 leading-tight">
              {dict.bonusInstructions || 'Reach 100% signal before thermal heat reaches 100% or battery energy collapses.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              <button className="btn py-2 px-2 text-xs" onClick={() => handleAction('scan')}>
                {dict.bonusBtnScan || 'SCAN FREQUENCY'}
              </button>
              <button className="btn py-2 px-2 text-xs" onClick={() => handleAction('tune')}>
                {dict.bonusBtnTune || 'TUNE RECEIVER'}
              </button>
              <button className="btn py-2 px-2 text-xs" onClick={() => handleAction('cool')}>
                {dict.bonusBtnCool || 'VENT HEAT'}
              </button>
              <button className="btn py-2 px-2 text-xs" onClick={() => handleAction('hide')}>
                {dict.bonusBtnHide || 'GO SILENT'}
              </button>
              <button className="btn gold py-2 px-2 text-xs" onClick={() => handleAction('boost')}>
                {dict.bonusBtnBoost || 'OVERDRIVE'}
              </button>
              <button className="btn primary py-2 px-2 text-xs" onClick={() => handleAction('decode')}>
                {dict.bonusBtnDecode || 'DECODE SIGNAL'}
              </button>
            </div>

            {/* Event Terminal Logs */}
            <div className="bg-[#040407] border border-[#2d324d] p-3 text-[0.7rem] font-mono text-[#707a9e] h-28 overflow-y-auto leading-relaxed">
              {logs.map((log, idx) => (
                <div key={idx} className={idx === 0 ? 'text-[#c0c8e0]' : ''}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
