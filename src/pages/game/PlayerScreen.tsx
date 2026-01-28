import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import gameService from '../../services/game.service';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

const PlayerScreen = () => {
    const { pin } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState<any>(null);
    const [gameState, setGameState] = useState<'waiting' | 'answering' | 'result' | 'finished'>('waiting');
    const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [answeredCurrent, setAnsweredCurrent] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [questionStartTime, setQuestionStartTime] = useState<number>(0);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const pData = sessionStorage.getItem('game_player');
        if (!pData) {
            navigate('/play');
            return;
        }
        const parsedPlayer = JSON.parse(pData);
        setPlayer(parsedPlayer);

        const initSync = async () => {
            try {
                const state = await gameService.getSessionState(pin!);
                if (state.status === 'in_progress' && state.question) {
                    setGameState('answering');
                    setCurrentQuestion(state.question);
                    setQuestionStartTime(Date.now());
                }
            } catch (e) {
                console.error("Failed to fetch initial game state", e);
            }
        };
        initSync();

        socketRef.current = io(`${SOCKET_URL}/games`, {
            auth: { token: localStorage.getItem('accessToken') }
        });

        socketRef.current.on('connect', () => {
            socketRef.current?.emit('joinGame', {
                pin,
                nickname: parsedPlayer.nickname,
                playerId: parsedPlayer.playerId
            });
        });

        socketRef.current.on('gameStarted', (data) => {
            setGameState('answering');
            setCurrentQuestion(data);
            setQuestionStartTime(Date.now());
            setAnsweredCurrent(false);
            setCurrentAnswer(null);
            toast.success("Game is starting!");
        });

        socketRef.current.on('newQuestion', (data) => {
            setGameState('answering');
            setCurrentQuestion(data);
            setQuestionStartTime(Date.now());
            setAnsweredCurrent(false);
            setCurrentAnswer(null);
        });

        socketRef.current.on('questionResult', ({ isCorrect, pointsEarned, score, streak: newStreak }) => {
            setGameState('result');
            setResult({ isCorrect, pointsEarned });
            setTotalScore(score);
            setStreak(newStreak);
        });

        socketRef.current.on('gameFinished', ({ score }) => {
            setGameState('finished');
            setTotalScore(score);
        });

        socketRef.current.on('disconnect', () => {
            toast.error("Lost connection to game");
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [pin, navigate]);

    const submitAnswer = (answerIndex: number) => {
        if (answeredCurrent || !currentQuestion) return;

        const selectedAnswer = currentQuestion.answers[answerIndex];
        if (!selectedAnswer) return;

        setAnsweredCurrent(true);
        setCurrentAnswer(answerIndex.toString());

        const responseTimeMs = Date.now() - questionStartTime;

        socketRef.current?.emit('submitAnswer', {
            pin,
            playerId: player.playerId,
            questionId: currentQuestion.questionId,
            answerId: selectedAnswer.id,
            responseTimeMs
        });
    };

    if (gameState === 'finished') {
        return (
            <div className="h-screen w-full bg-[#46178F] flex flex-col items-center justify-center p-8 text-white font-poppins">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                    <FaTrophy size={120} className="text-game-yellow mx-auto mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl font-black mb-2">Well Done!</h1>
                    <p className="text-2xl font-bold opacity-60 mb-8">{player?.nickname}</p>

                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <p className="text-sm font-bold uppercase tracking-widest mb-1">Final Score</p>
                        <p className="text-6xl font-black text-game-yellow">{totalScore}</p>
                    </div>

                    <button
                        onClick={() => navigate('/play')}
                        className="mt-12 bg-white text-[#46178F] px-10 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-transform"
                    >
                        PLAY AGAIN
                    </button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'result') {
        return (
            <div className={`h-screen w-full flex flex-col items-center justify-center p-8 text-white font-poppins transition-colors duration-500 ${result?.isCorrect ? 'bg-game-green' : 'bg-game-red'}`}>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
                    {result?.isCorrect ? (
                        <>
                            <FaCheckCircle size={100} className="mx-auto mb-6" />
                            <h2 className="text-6xl font-black mb-2">CORRECT!</h2>
                            <p className="text-2xl font-bold mb-8">+{result?.pointsEarned} points</p>
                        </>
                    ) : (
                        <>
                            <FaTimesCircle size={100} className="mx-auto mb-6" />
                            <h2 className="text-6xl font-black mb-2">INCORRECT</h2>
                            <p className="text-xl font-bold opacity-60 mb-8">Keep exploring Sri Lanka!</p>
                        </>
                    )}

                    <div className="bg-black/10 rounded-2xl p-6 mb-4 inline-block">
                        <div className="flex items-center gap-2">
                            <FaLightbulb className={streak > 0 ? 'text-game-yellow' : 'text-white/20'} />
                            <span className="font-bold">{streak} Answer Streak</span>
                        </div>
                    </div>

                    <p className="text-lg font-bold opacity-80 mt-12 animate-pulse">Wait for next question...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#F2F2F2] flex flex-col p-4 font-poppins overflow-hidden">
            {/* Player Info Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-game-blue text-white rounded-lg flex items-center justify-center font-bold">
                        {player?.nickname?.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-800">{player?.nickname}</span>
                </div>
                <div className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {totalScore}
                </div>
            </div>

            {/* Main Response Area */}
            <div className="flex-1 flex flex-col gap-3 relative">
                {gameState === 'answering' ? (
                    <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 h-full gap-3">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitAnswer(0)}
                            disabled={answeredCurrent}
                            className={`rounded-2xl flex items-center justify-center text-8xl text-white shadow-lg transition-all ${answeredCurrent && currentAnswer !== '0' ? 'opacity-20' : 'bg-game-red'}`}
                        >
                            ▲
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitAnswer(1)}
                            disabled={answeredCurrent}
                            className={`rounded-2xl flex items-center justify-center text-8xl text-white shadow-lg transition-all ${answeredCurrent && currentAnswer !== '1' ? 'opacity-20' : 'bg-game-blue'}`}
                        >
                            ◆
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitAnswer(2)}
                            disabled={answeredCurrent}
                            className={`rounded-2xl flex items-center justify-center text-8xl text-white shadow-lg transition-all ${answeredCurrent && currentAnswer !== '2' ? 'opacity-20' : 'bg-game-yellow'}`}
                        >
                            ●
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitAnswer(3)}
                            disabled={answeredCurrent}
                            className={`rounded-2xl flex items-center justify-center text-8xl text-white shadow-lg transition-all ${answeredCurrent && currentAnswer !== '3' ? 'opacity-20' : 'bg-game-green'}`}
                        >
                            ■
                        </motion.button>

                        {answeredCurrent && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-black/80 text-white px-8 py-4 rounded-2xl font-black text-2xl backdrop-blur-md"
                                >
                                    ANSWER SENT!
                                </motion.div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-24 h-24 border-8 border-slate-200 border-t-game-blue rounded-full animate-spin mb-6"></div>
                        <h2 className="text-2xl font-black italic tracking-tighter">GET READY...</h2>
                        <p className="font-bold opacity-60">Look at the big screen!</p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-between items-center opacity-40 px-4 py-2 border-t border-slate-200">
                <span className="font-black text-xs">LANKAVIBES</span>
                <span className="font-bold text-xs">PIN: {pin}</span>
            </div>

            <ToastContainer position="bottom-center" autoClose={1500} hideProgressBar />
        </div>
    );
};

export default PlayerScreen;
