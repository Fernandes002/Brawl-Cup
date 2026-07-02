import React, { useState } from 'react';
import PlayerSetup from './components/PlayerSetup';
import DrawAnimation from './components/DrawAnimation';
import BracketView from './components/BracketView';
import { Player } from './types';
import { Trophy, Sparkles, Star, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Stage = 'setup' | 'drawing' | 'bracket';

const BrawlLogo = () => (
  <div className="relative flex flex-col items-center select-none py-6 mb-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
    {/* Colored Star Sparkles around */}
    <div className="absolute top-0 -left-12 sm:-left-20 animate-bounce" style={{ animationDelay: '0.2s' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#06b6d4">
        <path d="M12 0L15.5 8.5L24 12L15.5 15.5L12 24L8.5 15.5L0 12L8.5 8.5Z" />
      </svg>
    </div>
    <div className="absolute bottom-12 -left-16 sm:-left-24 animate-pulse" style={{ animationDelay: '0.6s' }}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#ef4444">
        <path d="M12 0L15.5 8.5L24 12L15.5 15.5L12 24L8.5 15.5L0 12L8.5 8.5Z" />
      </svg>
    </div>
    <div className="absolute top-4 -right-12 sm:-right-20 animate-bounce" style={{ animationDelay: '0.4s' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#ec4899">
        <path d="M12 0L15.5 8.5L24 12L15.5 15.5L12 24L8.5 15.5L0 12L8.5 8.5Z" />
      </svg>
    </div>
    <div className="absolute bottom-10 -right-16 sm:-right-24 animate-pulse" style={{ animationDelay: '0.8s' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#22c55e">
        <path d="M12 0L15.5 8.5L24 12L15.5 15.5L12 24L8.5 15.5L0 12L8.5 8.5Z" />
      </svg>
    </div>

    {/* Skull Cup Graphic - Golden Cup, circular eyes, skull style face */}
    <div className="relative w-36 h-32 flex justify-center items-center scale-110 sm:scale-125 mb-4">
      {/* Back wings / blue banner part of the cup logo */}
      <div className="absolute -z-10 w-40 h-14 bg-sky-400 border-[4px] border-black rounded-[2rem] transform -rotate-12 flex items-center justify-center opacity-95 shadow-[4px_4px_0px_0px_#000]" />
      <div className="absolute -z-10 w-40 h-14 bg-sky-400 border-[4px] border-black rounded-[2rem] transform rotate-12 flex items-center justify-center opacity-95 shadow-[4px_4px_0px_0px_#000]" />
      
      {/* Outer Golden Skull Cup */}
      <div className="relative w-28 h-24 bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 border-[5px] border-black rounded-b-[2.2rem] rounded-t-[1rem] shadow-[6px_6px_0px_0px_#000] flex flex-col items-center justify-center">
        {/* Cup Handles */}
        <div className="absolute -left-6 top-2 w-8 h-12 bg-amber-400 border-[4px] border-black rounded-l-full -z-10 shadow-[2px_2px_0px_0px_#000]" />
        <div className="absolute -right-6 top-2 w-8 h-12 bg-amber-400 border-[4px] border-black rounded-r-full -z-10 shadow-[2px_2px_0px_0px_#000]" />

        {/* Star Emblem inside Cup (Cartoon style decal) */}
        <div className="relative w-12 h-12 flex items-center justify-center animate-pulse">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#FFE57F" className="filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <path 
              d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" 
              stroke="#000000" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>

      {/* Gold Pedestal Base */}
      <div className="absolute bottom-0 w-16 h-4 bg-amber-600 border-[4px] border-black rounded-md shadow-[4px_4px_0px_0px_#000]" />
    </div>

    {/* Big Tilted Text Layout */}
    <div className="relative flex flex-col items-center mt-2">
      <h1 className="text-5xl sm:text-7xl font-comic tracking-wide text-white uppercase transform -rotate-[4deg] select-none text-center leading-none filter drop-shadow-[0_4px_0px_#000] brawl-text-outline-lg">
        BRAWL
      </h1>
      <h1 className="text-6xl sm:text-8xl font-comic tracking-wide text-amber-400 uppercase transform -rotate-[3deg] select-none text-center leading-none filter drop-shadow-[0_6px_0px_#000] brawl-text-outline-lg mt-1">
        CUP
      </h1>
    </div>
  </div>
);

export default function App() {
  const [stage, setStage] = useState<Stage>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isRigged, setIsRigged] = useState<boolean>(true);
  const [slotAssignments, setSlotAssignments] = useState<Record<number, Player | null>>({});

  // Sync / Sharing States
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [adminCode, setAdminCode] = useState<string | null>(null);
  const [isOperator, setIsOperator] = useState<boolean>(true); // Default to operator for new creations
  const [tournamentName, setTournamentName] = useState<string>("Brawl Cup");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedTournamentProp, setLoadedTournamentProp] = useState<any>(null);
  const [isArchived, setIsArchived] = useState<boolean>(false);

  // Copy / Clipboard feedback
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedAdmin, setCopiedAdmin] = useState<boolean>(false);
  const [inputAdminCode, setInputAdminCode] = useState<string>('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Load tournament from backend if t query param is present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tId = params.get('t');
    const codeParam = params.get('code');

    if (tId) {
      setLoading(true);
      fetch(`/api/tournaments/${tId}`)
        .then(res => res.json())
        .then(async data => {
          if (data.success && data.tournament) {
            const tour = data.tournament;
            setTournamentId(tId);
            setTournamentName(tour.name);
            setPlayers(tour.players || []);
            setSlotAssignments(tour.slotAssignments || {});
            setStage(tour.stage || 'setup');
            setIsArchived(!!tour.isArchived);

            if (tour.rounds && tour.rounds.length > 0) {
              setLoadedTournamentProp(tour);
            }

            // Verify if administrator
            const localCode = localStorage.getItem(`brawl_admin_code_${tId}`);
            const codeToVerify = codeParam || localCode;

            if (codeToVerify) {
              const verifyRes = await fetch(`/api/tournaments/${tId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminCode: codeToVerify.toUpperCase().trim() })
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success && verifyData.match) {
                setAdminCode(codeToVerify.toUpperCase().trim());
                setIsOperator(true);
                localStorage.setItem(`brawl_admin_code_${tId}`, codeToVerify.toUpperCase().trim());

                // Keep url clean of code so user doesn't copy it to others
                if (codeParam) {
                  const newUrl = `${window.location.origin}${window.location.pathname}?t=${tId}`;
                  window.history.replaceState({ path: newUrl }, '', newUrl);
                }
              } else {
                setIsOperator(false);
              }
            } else {
              setIsOperator(false);
            }
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading tournament:", err);
          setLoading(false);
        });
    }
  }, []);

  // Poll for spectator updates when not operator
  React.useEffect(() => {
    if (!tournamentId || isOperator) return;

    const interval = setInterval(() => {
      fetch(`/api/tournaments/${tournamentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.tournament) {
            const tour = data.tournament;
            setTournamentName(tour.name);
            setPlayers(tour.players || []);
            setSlotAssignments(tour.slotAssignments || {});
            setStage(tour.stage || 'setup');
            setIsArchived(!!tour.isArchived);
            if (tour.rounds && tour.rounds.length > 0) {
              setLoadedTournamentProp(tour);
            }
          }
        })
        .catch(err => console.error("Error polling updates:", err));
    }, 3000);

    return () => clearInterval(interval);
  }, [tournamentId, isOperator]);

  const copyToClipboard = (text: string, isAdmin: boolean) => {
    navigator.clipboard.writeText(text);
    if (isAdmin) {
      setCopiedAdmin(true);
      setTimeout(() => setCopiedAdmin(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAdminCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId || !inputAdminCode) return;

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminCode: inputAdminCode.toUpperCase().trim() })
      });
      const data = await res.json();
      if (data.success && data.match) {
        setAdminCode(inputAdminCode.toUpperCase().trim());
        setIsOperator(true);
        setAdminError(null);
        localStorage.setItem(`brawl_admin_code_${tournamentId}`, inputAdminCode.toUpperCase().trim());
      } else {
        setAdminError("CÓDIGO DE ADMINISTRADOR INCORRETO!");
      }
    } catch (err) {
      console.error("Error submitting admin code:", err);
    }
  };

  const handleStartDraw = async (setupPlayers: Player[], setupIsRigged: boolean) => {
    // Generate Tournament ID and Admin Code on start
    const newId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newAdminCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    setTournamentId(newId);
    setAdminCode(newAdminCode);
    setIsOperator(true);
    setPlayers(setupPlayers);
    setIsRigged(setupIsRigged);
    setStage('drawing');

    // Update URL bar
    const newUrl = `${window.location.origin}${window.location.pathname}?t=${newId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    try {
      await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newId,
          name: tournamentName,
          date: new Date().toLocaleDateString("pt-BR"),
          players: setupPlayers,
          rounds: [],
          championId: null,
          isCompleted: false,
          stage: 'drawing',
          slotAssignments: {},
          adminCode: newAdminCode
        })
      });
      localStorage.setItem(`brawl_admin_code_${newId}`, newAdminCode);
    } catch (err) {
      console.error("Error saving initial tournament state:", err);
    }
  };

  const handleDrawComplete = async (finalSlots: Record<number, Player | null>) => {
    setSlotAssignments(finalSlots);
    setStage('bracket');

    if (isOperator && tournamentId && adminCode) {
      try {
        await fetch('/api/tournaments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: tournamentId,
            name: tournamentName,
            date: new Date().toLocaleDateString("pt-BR"),
            players: players,
            rounds: [],
            championId: null,
            isCompleted: false,
            stage: 'bracket',
            slotAssignments: finalSlots,
            adminCode: adminCode
          })
        });
      } catch (err) {
        console.error("Error saving draw completeness:", err);
      }
    }
  };

  const handleTournamentChange = (updatedTour: any) => {
    if (!isOperator || !tournamentId || !adminCode) return;

    fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: tournamentId,
        name: updatedTour.name,
        date: updatedTour.date,
        players: updatedTour.players,
        rounds: updatedTour.rounds,
        championId: updatedTour.championId,
        isCompleted: updatedTour.isCompleted,
        stage: 'bracket',
        slotAssignments: slotAssignments,
        adminCode: adminCode
      })
    }).catch(err => console.error("Error persisting updated tournament tree:", err));
  };

  const handleReset = () => {
    if (isOperator && tournamentId && adminCode) {
      fetch(`/api/tournaments/${tournamentId}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminCode })
      }).catch(err => console.error("Error archiving tournament:", err));
    }

    setPlayers([]);
    setSlotAssignments({});
    setTournamentId(null);
    setAdminCode(null);
    setIsOperator(true);
    setLoadedTournamentProp(null);
    setIsArchived(false);
    setStage('setup');
    
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({ path: cleanUrl }, '', cleanUrl);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#eceff4] text-slate-900 font-sans antialiased relative selection:bg-amber-400 selection:text-black overflow-x-hidden pb-12">
      {/* Dynamic Animated Gaming Background Arena in Light Style */}
      <div className="absolute inset-0 bg-[#e8ecf1] z-0 pointer-events-none" />
      
      {/* High-contrast cartoon grid lines in dark theme style but soft gray for light style */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.5px,transparent_1.5px),linear-gradient(to_bottom,#cbd5e1_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none select-none z-0" />
      
      {/* Colored arena spotlight glows for the light layout */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[550px] bg-rose-300/20 blur-[130px] pointer-events-none select-none z-0 rounded-full" />
      <div className="absolute top-0 right-1/4 w-[700px] h-[550px] bg-sky-300/20 blur-[130px] pointer-events-none select-none z-0 rounded-full" />
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-amber-400/10 blur-[150px] pointer-events-none select-none z-0 rounded-full" />

      {/* Floating authentic tournament stickers on the sides (Hidden on mobile) */}
      <div className="absolute top-12 left-6 hidden xl:block space-y-6 z-0">
        <div className="brawl-sticker transform -rotate-12 hover:scale-110 hover:rotate-6 transition duration-200">
          <span>💀 BRAWL SOUL</span>
        </div>
        <div className="brawl-sticker bg-yellow-400 text-black border-yellow-300 transform rotate-6 hover:scale-110 hover:rotate-[-6deg] transition duration-200 !text-sm">
          <span>👑 CAMPEÃO</span>
        </div>
        <div className="brawl-sticker transform -rotate-3 text-rose-500 bg-white hover:scale-110 transition">
          <Star size={14} className="fill-rose-500 stroke-none" />
          <span>ESTRELA</span>
        </div>
        <div className="brawl-sticker bg-slate-900 text-white border-black transform rotate-[15deg] hover:scale-110 transition">
          <span>BERLIN LAN 🇩🇪</span>
        </div>
      </div>

      <div className="absolute top-16 right-6 hidden xl:block space-y-6 z-0">
        <div className="brawl-sticker bg-purple-600 text-white border-purple-400 transform rotate-12 hover:scale-110 transition !text-sm">
          <span>🔥 DAY 3 FINAL</span>
        </div>
        <div className="brawl-sticker bg-sky-400 text-black border-sky-300 transform -rotate-12 hover:scale-110 transition">
          <span>⚡ ARENA CRASH</span>
        </div>
        <div className="brawl-sticker bg-emerald-500 text-white border-emerald-400 transform rotate-6 hover:scale-110 transition">
          <span>🏆 COPA 2026</span>
        </div>
        <div className="brawl-sticker bg-rose-600 text-white border-rose-400 transform -rotate-[15deg] hover:scale-110 transition">
          <span>⭐ QUALIFIED TEAMS</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-8">
        
        {/* Brawl Cup Logo Header */}
        <header className="flex flex-col items-center text-center space-y-4">
          <BrawlLogo />
          
          <p className="text-black font-extrabold font-sans text-sm tracking-widest uppercase bg-white border-[4px] border-black px-6 py-3 rounded-full shadow-[5px_5px_0px_0px_#000] inline-block select-none">
            🏆 CAMPEONATO OFICIAL DE BRAWL STARS
          </p>
        </header>

        {/* Share & Role Control Central Panel */}
        {tournamentId && (
          <div className="bg-white border-[4px] border-black p-5 rounded-3xl shadow-[5px_5px_0px_0px_#000] space-y-4 max-w-4xl mx-auto relative z-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border-2 border-black ${isOperator ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'}`}>
                  {isOperator ? <ShieldCheck size={24} /> : <Sparkles size={24} />}
                </div>
                <div>
                  <h3 className="font-comic text-base text-black uppercase tracking-tight">
                    {isOperator ? '⚡ CENTRAL DO OPERADOR' : '👁️ CENTRAL DO ESPECTADOR'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {isOperator 
                      ? 'Você é o operador deste torneio! Compartilhe o link de visualização com os competidores.'
                      : 'Você está visualizando este torneio ao vivo. Atualizações automáticas ativas.'}
                  </p>
                </div>
              </div>

              {/* Live Status indicator */}
              <div className="flex items-center gap-2 bg-slate-100 border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                <span className="text-[10px] font-sans font-black text-slate-700 tracking-wider">ONLINE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t-2 border-dashed border-black">
              {/* Public Link */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">Link de Visualização (Público)</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}?t=${tournamentId}`}
                    className="flex-1 bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none truncate select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${window.location.origin}?t=${tournamentId}`, false)}
                    className="brawl-button-yellow text-xs font-bold py-2 px-4 cursor-pointer"
                  >
                    {copiedLink ? 'COPIADO!' : 'COPIAR'}
                  </button>
                </div>
              </div>

              {/* Operator Status / Access Control */}
              <div className="space-y-1.5">
                {isOperator ? (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Link de Administrador (Não compartilhe!)</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}?t=${tournamentId}&code=${adminCode}`}
                        className="flex-1 bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none truncate select-all"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${window.location.origin}?t=${tournamentId}&code=${adminCode}`, true)}
                        className="brawl-button-green text-xs font-bold py-2 px-4 cursor-pointer"
                      >
                        {copiedAdmin ? 'COPIADO!' : 'COPIAR'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAdminCodeSubmit} className="space-y-1.5">
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">Acessar como Operador (Inserir Código)</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="EX: ABC123"
                        value={inputAdminCode}
                        onChange={(e) => setInputAdminCode(e.target.value)}
                        className="flex-1 bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="brawl-button-blue text-xs font-bold py-2 px-4 cursor-pointer"
                      >
                        ENTRAR
                      </button>
                    </div>
                    {adminError && (
                      <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider block">{adminError}</span>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Stages */}
        <main className="transition-all duration-300 relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-black border-t-purple-700 rounded-full animate-spin" />
              <p className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Carregando Torneio do Servidor...</p>
            </div>
          ) : isArchived && !isOperator ? (
            <motion.div
              key="archived"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-xl mx-auto text-center px-4"
            >
              <div className="bg-white border-[6px] border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden space-y-6">
                {/* Yellow & Black stripe warning banner */}
                <div className="bg-amber-400 border-b-4 border-black py-4 -mx-8 -mt-8 flex justify-center items-center gap-3 animate-pulse">
                  <span className="text-xl font-comic text-black">⚠️</span>
                  <h2 className="text-xl md:text-2xl font-comic text-black uppercase tracking-wider">
                    CONEXÃO ENCERRADA
                  </h2>
                  <span className="text-xl font-comic text-black">⚠️</span>
                </div>

                <div className="py-6 space-y-4">
                  <div className="inline-block p-4 bg-rose-500 text-white border-[4px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-3deg]">
                    <Trophy size={48} className="stroke-[3]" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-comic text-rose-500 uppercase tracking-tight brawl-text-outline rotate-[1deg]">
                    ENCERRADO • NOVO TORNEIO CRIADO
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600 font-extrabold uppercase tracking-wide max-w-sm mx-auto leading-relaxed">
                    Este campeonato foi encerrado pelo operador. Um novo torneio foi iniciado!
                  </p>
                </div>

                {/* Cute live ticker decoration */}
                <div className="border-t-4 border-dashed border-slate-300 pt-4 flex justify-center items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-sans font-black text-slate-500 tracking-widest uppercase">AGUARDANDO NOVO LINK DO OPERADOR</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {stage === 'setup' && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <PlayerSetup onStartDraw={handleStartDraw} isOperator={isOperator} />
                </motion.div>
              )}

              {stage === 'drawing' && (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <DrawAnimation
                    players={players}
                    isRigged={isRigged}
                    onDrawComplete={handleDrawComplete}
                    isOperator={isOperator}
                  />
                </motion.div>
              )}

              {stage === 'bracket' && (
                <motion.div
                  key="bracket"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <BracketView
                    initialSlotAssignments={slotAssignments}
                    onReset={handleReset}
                    isOperator={isOperator}
                    tournamentProp={loadedTournamentProp}
                    onTournamentChange={handleTournamentChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>

        {/* Footer */}
        <footer className="pt-8 text-center border-t-4 border-black text-xs font-mono space-y-3 uppercase tracking-wider text-slate-600">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-rose-100 border-[3px] border-black text-rose-600 px-4 py-1.5 rounded-full text-[11px] font-black shadow-[2.5px_2.5px_0px_0px_#000]">
              <span>★ BRAWL CUP CONECTADO ★</span>
            </div>
          </div>
          <p className="font-sans font-extrabold text-slate-800 tracking-wide">BRAWL CUP COPA TORNEIOS © 2026 • TODOS OS DIREITOS RESERVADOS</p>
        </footer>
      </div>
    </div>
  );
}

