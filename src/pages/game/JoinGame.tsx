import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGamepad } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import gameService from '../../services/game.service';

const JoinGame = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!pin || pin.length < 6) {
            toast.error("Please enter a valid 6-digit PIN");
            return;
        }
        if (!nickname) {
            toast.error("Please enter a nickname");
            return;
        }

        try {
            setLoading(true);
            const data = await gameService.joinSession(pin, nickname);
            // Save player data in session storage
            sessionStorage.setItem('game_player', JSON.stringify({
                playerId: data.id,
                nickname: data.nickname,
                pin: pin,
                userId: data.userId
            }));
            navigate(`/play/lobby/${pin}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid PIN or game already started");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#46178F] flex flex-col items-center justify-center p-6 font-poppins">
            {/* Sri Lankan Themed Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                <FaGamepad size={300} className="absolute -top-20 -left-20 rotate-12 text-white" />
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-game-green rounded-full blur-3xl"></div>
                <div className="absolute top-40 left-1/2 w-48 h-48 bg-game-blue rounded-full blur-2xl"></div>
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <img src="https://itineraries.lankavibes.lk/logo.png" className="h-12 mx-auto mb-4" alt="VibesLanka" />
                    <h1 className="text-3xl font-black text-slate-800">Adventure Quiz</h1>
                    <p className="text-slate-500 font-medium">Enter your code for rewards!</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Game PIN"
                            maxLength={6}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-100 border-2 border-transparent focus:border-game-blue focus:bg-white rounded-2xl px-6 py-4 text-center text-2xl font-black tracking-widest text-slate-800 outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full bg-slate-100 border-2 border-transparent focus:border-game-green focus:bg-white rounded-2xl px-6 py-4 text-center text-xl font-bold text-slate-800 outline-none transition-all"
                        />
                    </div>

                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="w-full bg-game-green text-white py-5 rounded-2xl font-black text-xl shadow-lg shadow-game-green/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "ENTER ROOM"
                        )}
                    </button>
                </div>

                <div className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Powered by VibesLanka
                </div>
            </motion.div>

            <ToastContainer autoClose={2000} theme="colored" hideProgressBar />
        </div>
    );
};

export default JoinGame;
