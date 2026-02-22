/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, AlertCircle, Terminal } from 'lucide-react';
import { generateScript } from './services/geminiService';
import { ScriptResponse } from './types';

export default function App() {
  // Input state
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [tone, setTone] = useState('Informational');
  const [duration, setDuration] = useState('30 seconds');
  
  // Output state
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError('');
    setScript(null);
    
    try {
      const result = await generateScript({
        topic,
        platform,
        tone,
        duration
      });
      
      setScript(result);
      
    } catch (err) {
      setError('SYSTEM ERROR: GENERATION_FAILED_RETRY_LATER');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!script) return;
    
    const fullScript = `HOOK:\n${script.hook}\n\nBODY:\n${script.body.map(beat => `• ${beat}`).join('\n')}\n\nPAYOFF:\n${script.payoff}\n\nCTA:\n${script.cta}`;
    
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-mono selection:bg-accent-cyan/30 relative">
      {/* Status Indicator */}
      <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
        <span className={`w-2 h-2 rounded-full animate-pulse ${
          loading ? 'bg-accent-cyan shadow-[0_0_10px_#00FFFF]' : 
          error ? 'bg-accent-magenta shadow-[0_0_10px_#FF00FF]' : 
          'bg-accent-green shadow-[0_0_10px_#39FF14]'
        }`} />
        <span className="text-[10px] tracking-widest text-text-secondary uppercase">
          {loading ? 'Processing...' : error ? 'Error' : 'System Ready'}
        </span>
      </div>

      {/* Decorative Slash */}
      <div className="hidden lg:block fixed top-0 right-0 w-1/3 h-1 bg-accent-cyan/20 -rotate-45 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20">
        {/* Header Section */}
        <header className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-[0.15em] text-text-primary mb-2">
              SCRIPT<span className="text-accent-cyan">FORGE</span>
            </h1>
            <p className="text-text-secondary text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium">
              // FROM_IDEA_TO_VIRAL_SCRIPT_IN_SECONDS
            </p>
          </motion.div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-12 lg:gap-20 items-start">
          {/* Left Column: Inputs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-10"
          >
            {/* Topic Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent-cyan" />
                <label className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent-cyan">
                  Input_Topic
                </label>
              </div>
              <div className="relative group">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="ENTER_VIDEO_TOPIC_HERE..."
                  maxLength={300}
                  className="w-full h-40 px-6 py-5 bg-bg-secondary/50 border border-accent-cyan/30 text-text-primary placeholder-text-dim resize-none focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 transition-all duration-300 rounded-none text-sm leading-relaxed"
                />
                <div className="absolute bottom-4 right-4 text-[10px] text-text-dim font-mono">
                  {topic.length}/300
                </div>
              </div>
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
              {/* Platform */}
              <div className="space-y-3">
                <label className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent-cyan">
                  Platform
                </label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-5 py-4 bg-bg-secondary/50 border border-accent-cyan/30 text-text-primary cursor-pointer focus:outline-none focus:border-accent-cyan appearance-none rounded-none transition-all duration-300 hover:bg-bg-secondary"
                  >
                    <option>TikTok</option>
                    <option>Reels</option>
                    <option>Shorts</option>
                    <option>Twitter/X</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-accent-cyan">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tone */}
              <div className="space-y-3">
                <label className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent-cyan">
                  Tone
                </label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-5 py-4 bg-bg-secondary/50 border border-accent-cyan/30 text-text-primary cursor-pointer focus:outline-none focus:border-accent-cyan appearance-none rounded-none transition-all duration-300 hover:bg-bg-secondary"
                  >
                    <option>Emotional</option>
                    <option>Informational</option>
                    <option>Aggressive</option>
                    <option>Motivational</option>
                    <option>Storytelling</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-accent-cyan">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <label className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent-cyan">
                  Duration
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-5 py-4 bg-bg-secondary/50 border border-accent-cyan/30 text-text-primary cursor-pointer focus:outline-none focus:border-accent-cyan appearance-none rounded-none transition-all duration-300 hover:bg-bg-secondary"
                  >
                    <option>15 seconds</option>
                    <option>30 seconds</option>
                    <option>60 seconds</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-accent-cyan">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className={`
                w-full py-6 text-xs font-bold uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group
                ${loading || !topic.trim()
                  ? 'bg-bg-secondary text-text-dim cursor-not-allowed border border-text-dim/20'
                  : 'bg-accent-magenta text-white border border-accent-cyan hover:shadow-[0_0_30px_rgba(255,0,255,0.4)]'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  INITIALIZING_FORGE...
                </div>
              ) : (
                <>
                  <Sparkles size={16} className="group-hover:text-accent-cyan transition-colors" />
                  EXECUTE_GENERATION
                </>
              )}
            </motion.button>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 text-accent-magenta text-[10px] font-bold tracking-widest bg-accent-magenta/5 border border-accent-magenta/30 p-4 uppercase"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Output */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {!script && !loading && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-text-dim/30 glass-panel"
                >
                  <Terminal size={40} className="text-text-dim mb-6" />
                  <p className="text-text-dim text-xs tracking-widest uppercase">
                    Waiting for input parameters...<br/>Forge is currently idle.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12 glass-panel border border-accent-cyan/30"
                >
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-2 border-accent-cyan/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-accent-cyan rounded-full animate-spin" />
                    <div className="absolute inset-4 border-2 border-b-accent-magenta rounded-full animate-spin-slow" />
                  </div>
                  <p className="text-accent-cyan text-[10px] tracking-[0.5em] uppercase animate-pulse">
                    Synthesizing_Script_Data...
                  </p>
                </motion.div>
              )}

              {script && (
                <motion.div 
                  key="output"
                  initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-panel border border-accent-cyan/30 p-8 md:p-12 relative neon-border neon-border-tl neon-border-tr neon-border-bl neon-border-br"
                >
                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className={`
                      absolute top-8 right-8 px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 flex items-center gap-2 z-10
                      ${copied
                        ? 'bg-accent-green border-accent-green text-bg-primary'
                        : 'bg-transparent border-accent-cyan/30 text-accent-cyan hover:border-accent-magenta hover:text-accent-magenta hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]'
                      }
                    `}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'COPIED' : 'COPY_DATA'}
                  </button>
                  
                  <div className="space-y-10">
                    {/* Hook */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 flex items-center gap-2">
                        <span className="w-1 h-1 bg-accent-cyan" /> 01_THE_HOOK
                      </h4>
                      <p className="text-text-primary text-xl md:text-2xl font-bold leading-tight tracking-tight fira">
                        {script.hook}
                      </p>
                    </motion.div>
                    
                    {/* Body */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-accent-cyan mb-6 flex items-center gap-2">
                        <span className="w-1 h-1 bg-accent-cyan" /> 02_CORE_BEATS
                      </h4>
                      <ul className="space-y-5">
                        {script.body.map((beat, index) => (
                          <li key={index} className="text-text-secondary text-sm md:text-base leading-relaxed flex items-start group">
                            <span className="text-accent-magenta mr-4 font-mono text-xs mt-1.5 opacity-50 group-hover:opacity-100 transition-opacity">[{index + 1}]</span>
                            <span className="group-hover:text-text-primary transition-colors">{beat}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-accent-cyan/10">
                      {/* Payoff */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4">
                          03_THE_PAYOFF
                        </h4>
                        <p className="text-text-primary text-sm md:text-base leading-relaxed italic border-l-2 border-accent-magenta/30 pl-4">
                          {script.payoff}
                        </p>
                      </motion.div>
                      
                      {/* CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4">
                          04_CALL_TO_ACTION
                        </h4>
                        <p className="text-accent-green text-sm md:text-base leading-relaxed font-bold tracking-wide">
                          {script.cta}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-32 pt-8 border-t border-text-dim/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-dim text-[9px] uppercase tracking-[0.5em]">
            SCRIPTFORGE_v2.0.0 // TERMINAL_ID: SF-99
          </p>
          <div className="flex gap-6">
            <span className="text-text-dim text-[9px] uppercase tracking-[0.2em] hover:text-accent-cyan cursor-pointer transition-colors">Documentation</span>
            <span className="text-text-dim text-[9px] uppercase tracking-[0.2em] hover:text-accent-magenta cursor-pointer transition-colors">System_Status</span>
          </div>
        </footer>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
