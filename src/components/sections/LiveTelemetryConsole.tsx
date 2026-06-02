import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section } from '../ui/Section';
import { Terminal, Cpu, RefreshCw } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'OK' | 'DEV' | 'SYS';
  message: string;
}

export const LiveTelemetryConsole = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '12:15:02', level: 'SYS', message: 'ESP32 calibration workspace initialized.' },
    { id: '2', timestamp: '12:15:03', level: 'DEV', message: 'Ayu-Boat: Serial connection established.' },
    { id: '3', timestamp: '12:15:05', level: 'OK', message: 'Haptic telemetry link ping stable at 6ms.' },
    { id: '4', timestamp: '12:15:08', level: 'DEV', message: 'IOBot: Speech synth module loaded.' },
    { id: '5', timestamp: '12:15:10', level: 'SYS', message: 'Loading Arduino PID control loop scripts.' },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Periodic Log Generator
  useEffect(() => {
    const messages = [
      { level: 'DEV', message: 'Ayu-Boat: Verifying dual thruster differential mixing curves.' },
      { level: 'OK', message: 'Workspace synced: Local Git changes successfully pushed.' },
      { level: 'SYS', message: 'Regulating telemetry buffer cache (allocated 12KB stack).' },
      { level: 'DEV', message: 'H2R: Compiling Arduino motor encoder feedback sketch.' },
      { level: 'OK', message: 'IOBot: Local object detection model is running at 15 FPS.' },
      { level: 'SYS', message: 'Ayu-Boat telemetry stream: voltage reading steady at 3.31V.' },
    ];

    const logInterval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      setLogs(prev => {
        const next = [...prev, {
          id: Math.random().toString(),
          timestamp: timeStr,
          level: randomMsg.level as any,
          message: randomMsg.message
        }];
        if (next.length > 8) {
          next.shift();
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(logInterval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <Section id="telemetry" className="border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Compact Console Box - Height strictly 280px-300px */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="ds-card border-white/10 overflow-hidden shadow-2xl relative max-w-4xl mx-auto h-[290px] flex flex-col justify-between"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-[#050505] backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 mr-2 select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60 border border-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/60 border border-[#eab308]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/60 border border-[#22c55e]" />
              </div>
              <Terminal size={14} className="text-brand-primary" />
              <span className="font-mono text-[10px] font-semibold tracking-wider text-white/80 uppercase">AYUSH-WORKSPACE://LIVE-BUILD-ACTIVITY</span>
            </div>
            
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#22c55e] select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
              ACTIVE CONNECTION
            </div>
          </div>

          {/* Console Output logs body */}
          <div className="flex-grow p-5 bg-[#050505] font-mono text-[11px] overflow-y-auto custom-scrollbar space-y-2 text-left">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2.5 py-0.5 border-b border-white/[0.01]"
                >
                  <span className="text-white/30 shrink-0 select-none">{log.timestamp}</span>
                  <span
                    className={`font-bold shrink-0 ${
                      log.level === 'SYS'
                        ? 'text-brand-accent'
                        : log.level === 'OK'
                        ? 'text-green-400'
                        : 'text-brand-primary'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-white/70">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={logEndRef} />
          </div>

          {/* Footer details */}
          <div className="border-t border-white/5 px-5 py-3 bg-[#050505] flex items-center justify-between text-[10px] font-mono text-white/30 select-none">
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className="text-brand-primary" />
              <span>Workspace diagnostics: All nodes reporting nominal.</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw size={10} className="animate-spin" />
              <span>SYNCED</span>
            </div>
          </div>
        </motion.div>

      </div>
    </Section>
  );
};

export default LiveTelemetryConsole;
