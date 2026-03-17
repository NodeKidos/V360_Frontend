import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserAstronaut, FaQuoteLeft } from 'react-icons/fa';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

const GameLobby = () => {
    const { pin } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState<any>(null);

    const tourismQuotes = [
        "Sigiriya: The Eighth Wonder of the World.",
        "Did you know? Sri Lanka is the world's fourth largest producer of tea.",
        "Galle Fort was built first by the Portuguese, then the Dutch.",
        "Kandy is home to the Temple of the Sacred Tooth Relic.",
        "The blue whale is often spotted off the coast of Mirissa."
    ];
    const [quoteIdx, setQuoteIdx] = useState(0);

    useEffect(() => {
        const pData = sessionStorage.getItem('game_player');
        if (!pData) {
            navigate('/play');
            return;
        }
        setPlayer(JSON.parse(pData));

        const socket = io(`${SOCKET_URL}/games`, {
            auth: { token: localStorage.getItem('accessToken') }
        });

        socket.on('connect', () => {
            socket.emit('joinGame', { pin, nickname: JSON.parse(pData).nickname });
        });

        socket.on('gameStarted', () => {
            navigate(`/play/game/${pin}`);
        });

        socket.on('newQuestion', () => {
            navigate(`/play/game/${pin}`);
        });

        const interval = setInterval(() => {
            setQuoteIdx(prev => (prev + 1) % tourismQuotes.length);
        }, 5000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [pin, navigate]);

    return (
        <div className="h-screen w-full bg-[#46178F] flex flex-col items-center justify-between p-8 text-white font-poppins">
            <div className="flex flex-col items-center mt-10">
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-6 shadow-2xl"
                >
                    <FaUserAstronaut size={48} className="text-game-blue" />
                </motion.div>
                <h1 className="text-4xl font-black mb-2">You're in!</h1>
                <p className="text-xl font-bold opacity-60">See your name on screen?</p>
            </div>

            <div className="w-full max-w-sm text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={quoteIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white/10 backdrop-blur-md rounded-[32px] p-8 min-h-[160px] flex flex-col justify-center border border-white/10"
                    >
                        <FaQuoteLeft className="text-game-green mb-4" />
                        <p className="text-lg font-medium leading-relaxed italic">"{tourismQuotes[quoteIdx]}"</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full bg-black/20 p-6 rounded-3xl flex justify-between items-center mb-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Your Nickname</span>
                    <span className="text-xl font-black">{player?.nickname}</span>
                </div>
                <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>

        </div>
    );
};

export default GameLobby;
