import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserFriends, FaPlay, FaGamepad, FaTrophy, FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import gameService from '../../../services/game.service';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

const GameHost = () => {
    const { pin } = useParams();
    const navigate = useNavigate();
    const [players, setPlayers] = useState<any[]>([]);
    const [gameState, setGameState] = useState<'lobby' | 'question' | 'results' | 'leaderboard' | 'finished'>('lobby');
    const [responses, setResponses] = useState(0);
    const [timer, setTimer] = useState(20);
    const [session, setSession] = useState<any>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

    const socketRef = useRef<Socket | null>(null);
    const timerIntervalRef = useRef<any>(null);

    useEffect(() => {
        initGame();
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, []);

    const initGame = async () => {
        try {
            const sessionData = await gameService.findSessionByPin(pin!);
            setSession(sessionData);
            setPlayers(sessionData.players || []);
        } catch (e) {
            toast.error("Failed to load session data");
        }
    };

    // Better init logic
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // We have the PIN, find the session
                // Need a way to find session by PIN in admin service
                // I'll add this to gameService if needed, but for now let's use the PIN room

                socketRef.current = io(`${SOCKET_URL}/games`, {
                    auth: { token: localStorage.getItem('accessToken') }
                });

                socketRef.current.on('connect', () => {
                    socketRef.current?.emit('hostGame', { pin });
                });

                socketRef.current.on('playerJoined', (player) => {
                    setPlayers(prev => [...prev, player]);
                    toast.info(`${player.nickname} joined the game!`);
                });

                socketRef.current.on('answerReceived', () => {
                    setResponses(prev => prev + 1);
                });

            } catch (err) {
                toast.error("Failed to connect to game server");
            }
        };

        loadInitialData();
    }, [pin]);

    useEffect(() => {
        if (gameState === 'question' && timer > 0) {
            timerIntervalRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setGameState('results');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerIntervalRef.current);
        }

        // Auto transition if everyone answered
        if (gameState === 'question' && responses > 0 && responses === players.length) {
            setGameState('results');
            clearInterval(timerIntervalRef.current);
        }

        return () => clearInterval(timerIntervalRef.current);
    }, [gameState, timer, responses, players.length]);

    const handleStart = async () => {
        if (players.length === 0) {
            toast.warn("Wait for at least one player!");
            return;
        }
        setGameState('question');
        setTimer(session?.quiz?.questions[0]?.timeLimit || 20);
        socketRef.current?.emit('startGame', { sessionId: session.id, pin });
    };

    const handleNext = async () => {
        if (gameState === 'results') {
            // Fetch updated leaderboard
            const updatedSession = await gameService.findSessionByPin(pin!);
            setPlayers(updatedSession.players.sort((a: any, b: any) => b.score - a.score));
            setGameState('leaderboard');
            return;
        }

        if (gameState === 'leaderboard') {
            const nextIdx = currentQuestionIdx + 1;
            if (nextIdx >= session.quiz.questions.length) {
                setGameState('finished');
                return;
            }

            setCurrentQuestionIdx(nextIdx);
            setResponses(0);
            setTimer(session.quiz.questions[nextIdx].timeLimit || 20);
            setGameState('question');
            socketRef.current?.emit('nextQuestion', { sessionId: session.id, pin });
            return;
        }

        const nextIdx = currentQuestionIdx + 1;
        if (nextIdx >= session.quiz.questions.length) {
            setGameState('finished');
            socketRef.current?.emit('nextQuestion', { sessionId: session.id, pin });
            return;
        }

        setCurrentQuestionIdx(nextIdx);
        setResponses(0);
        setTimer(session.quiz.questions[nextIdx].timeLimit || 20);
        setGameState('question');
        socketRef.current?.emit('nextQuestion', { sessionId: session.id, pin });
    };

    return (
        <div className="h-screen w-full bg-[#46178F] flex flex-col items-center justify-center p-8 overflow-hidden font-poppins text-white select-none">
            {/* Lobby View */}
            {gameState === 'lobby' && (
                <div className="flex flex-col items-center w-full max-w-4xl">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white text-[#46178F] px-12 py-6 rounded-[32px] shadow-2xl mb-12 text-center"
                    >
                        <p className="font-bold text-xl uppercase tracking-widest opacity-60 mb-2">Join at lankavibes.lk/play</p>
                        <h1 className="text-8xl font-black">{pin}</h1>
                    </motion.div>

                    <div className="bg-black/20 backdrop-blur-md rounded-[40px] p-8 w-full border border-white/10 min-h-[400px]">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                            <div className="flex items-center gap-3">
                                <FaUserFriends size={32} className="text-game-blue" />
                                <span className="text-3xl font-bold">{players.length} Players connected</span>
                            </div>
                            <button
                                onClick={handleStart}
                                className="bg-game-green hover:bg-game-green/90 text-white px-10 py-4 rounded-2xl font-black text-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-game-green/20"
                            >
                                <FaPlay />
                                START
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto max-h-[300px] scrollbar-hide">
                            <AnimatePresence>
                                {players.map((p, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white/10 px-6 py-3 rounded-xl font-bold text-center truncate border border-white/5"
                                    >
                                        {p.nickname}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {players.length === 0 && (
                                <div className="col-span-full py-20 text-center opacity-30 italic text-xl">
                                    Waiting for adventurers...
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-20 flex items-center gap-8 opacity-50 grayscale brightness-200">
                        {/* Tourism Icons */}
                        <img src="https://itineraries.lankavibes.lk/logo.png" className="h-12" alt="LankaVibes" />
                    </div>
                </div>
            )}

            {/* Leaderboard View */}
            {gameState === 'leaderboard' && (
                <div className="w-full max-w-2xl flex flex-col items-center">
                    <h2 className="text-6xl font-black mb-12 flex items-center gap-4">
                        <FaTrophy className="text-game-yellow" /> SCOREBOARD
                    </h2>
                    <div className="w-full space-y-3">
                        {players.slice(0, 5).map((p, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/10 rounded-2xl p-6 flex justify-between items-center border-l-8 border-game-blue"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-black opacity-30 w-8">{idx + 1}</span>
                                    <span className="text-3xl font-bold">{p.nickname}</span>
                                </div>
                                <span className="text-3xl font-black text-game-blue">{p.score}</span>
                            </motion.div>
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="mt-12 bg-game-green hover:bg-game-green/90 text-white px-12 py-4 rounded-2xl font-black text-2xl flex items-center gap-3 transition-transform hover:scale-105"
                    >
                        NEXT QUESTION <FaPlay size={20} />
                    </button>
                </div>
            )}

            {/* Finished View */}
            {gameState === 'finished' && (
                <div className="flex flex-col items-center">
                    <FaTrophy size={150} className="text-game-yellow mb-8 animate-bounce" />
                    <h1 className="text-7xl font-black mb-12">GAME OVER!</h1>
                    <div className="bg-white/10 rounded-[40px] p-12 text-center backdrop-blur-xl border border-white/10">
                        <p className="text-2xl font-bold text-game-blue mb-4 uppercase tracking-widest">Grand Champion</p>
                        <h2 className="text-8xl font-black mb-8">{players[0]?.nickname || "Someone!"}</h2>
                        <p className="text-4xl font-bold opacity-60">with {players[0]?.score || 0} points</p>
                    </div>
                    <button
                        onClick={() => navigate('/v360/game')}
                        className="mt-12 bg-white text-[#46178F] px-12 py-4 rounded-2xl font-black text-2xl"
                    >
                        BACK TO DASHBOARD
                    </button>
                </div>
            )}

            {/* Question & Results View */}
            {(gameState === 'question' || gameState === 'results') && (
                <div className="w-full flex flex-col h-full">
                    <div className="flex justify-between items-center mb-12 bg-black/10 p-6 rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full border-8 border-game-blue flex items-center justify-center text-3xl font-black rotate-[-10deg] animate-pulse">
                                {timer}
                            </div>
                            <h2 className="text-4xl font-black tracking-tight drop-shadow-lg">
                                {session?.quiz?.questions[currentQuestionIdx]?.text}
                            </h2>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-black">{responses}</span>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Answers</span>
                            </div>
                            <button
                                onClick={handleNext}
                                className="bg-game-blue hover:bg-game-blue/90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-game-blue/20"
                            >
                                NEXT <FaPlay size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center bg-white/5 rounded-[40px] mb-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-game-blue/10 to-transparent"></div>
                        <FaGamepad size={200} className="opacity-5 scale-150 rotate-[15deg] absolute" />
                        <img
                            src={session?.quiz?.questions[currentQuestionIdx]?.imageUrl || "https://images.unsplash.com/photo-1582239454158-7c87082bb48c?q=80&w=1000&auto=format&fit=crop"}
                            className="max-h-[80%] rounded-3xl shadow-2xl relative z-10 border-8 border-white border-b-[24px]"
                            alt="Question"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 h-[200px]">
                        {session?.quiz?.questions[currentQuestionIdx]?.answers.map((answer: any, idx: number) => {
                            const icons = ['▲', '◆', '●', '■'];
                            const bgs = ['bg-game-red', 'bg-game-blue', 'bg-game-yellow', 'bg-game-green'];
                            const isCorrect = answer.isCorrect;
                            return (
                                <div key={idx} className={`${bgs[idx]} rounded-2xl flex items-center p-6 gap-6 shadow-xl relative overflow-hidden`}>
                                    {gameState === 'results' && !isCorrect && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10"></div>
                                    )}
                                    <span className="text-4xl text-white opacity-40 z-20">{icons[idx]}</span>
                                    <span className="text-3xl font-black z-20">{answer.text}</span>
                                    {gameState === 'results' && isCorrect && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto z-20">
                                            <FaCheckCircle className="text-white" size={40} />
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <ToastContainer autoClose={2000} theme="colored" />
        </div>
    );
};

export default GameHost;
