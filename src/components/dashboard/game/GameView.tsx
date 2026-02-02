import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../AdminSidebar';
import TopBar from '../../Topbar';
import { IoMdAdd, IoMdPlay } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';
import gameService from '../../../services/game.service';
import type { Quiz } from '../../../services/game.service';
import { FaGamepad, FaTrophy, FaQuestionCircle } from 'react-icons/fa';
import { useAuthStore } from '../../../store/useAuthStore';
import { UserRole } from '../../../types/auth.types';

const GameManagement = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const isDriver = user?.role === UserRole.DRIVER;

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const data = await gameService.getAllQuizzesAdmin();
            setQuizzes(data);
        } catch (error) {
            console.error("Failed to fetch quizzes", error);
            toast.error("Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateQuiz = () => {
        navigate("/v360/game/create");
    };

    const handleHostGame = async (quizId: string) => {
        try {
            const session = await gameService.createSession(quizId);
            navigate(`/v360/game/host/${session.pin}`);
        } catch (error) {
            toast.error("Failed to start game session");
        }
    };

    const filteredQuizzes = quizzes.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.destination?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen bg-[#F8FAFC] flex overflow-hidden">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={false}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-6">
                    <TopBar
                        isMobile={false}
                        setSidebarOpen={setSidebarOpen}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    <div className="mb-8 mt-6 flex justify-between items-center">
                        <div>
                            <h2 className="font-poppins font-bold text-[#1e293b] text-[32px] flex items-center gap-3">
                                <FaGamepad className="text-game-green" />
                                Destination Quizzes
                            </h2>
                            <p className="text-slate-500 font-poppins">Manage real-time Kahoot-style games for Sri Lankan destinations</p>
                        </div>
                        {!isDriver && (
                            <button
                                className="bg-game-green text-white rounded-xl px-6 py-3 font-semibold font-poppins flex items-center gap-2 hover:opacity-90 transition-all shadow-lg hover:shadow-game-green/20"
                                onClick={handleCreateQuiz}
                            >
                                <IoMdAdd size={24} />
                                Create Quiz
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <div key={quiz.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
                                {/* Decorative Tropical Pattern Placeholder */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-game-green/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-game-blue/10 text-game-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {quiz.destination?.name || 'General'}
                                        </div>
                                        <div className="flex items-center gap-1 text-game-yellow font-bold">
                                            <FaTrophy />
                                            {quiz.rewardPoints}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mb-2 truncate group-hover:text-game-green transition-colors">
                                        {quiz.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">
                                        {quiz.description || 'No description provided.'}
                                    </p>

                                    <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
                                        <span className="flex items-center gap-1.5">
                                            <FaQuestionCircle className="text-game-red" />
                                            {quiz.questions?.length || 0} Questions
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleHostGame(quiz.id!)}
                                            className="flex-1 bg-game-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-game-blue/90 transition-colors shadow-md shadow-game-blue/20"
                                        >
                                            <IoMdPlay />
                                            Host Live
                                        </button>
                                        {!isDriver && (
                                            <button
                                                onClick={() => navigate(`/v360/game/edit/${quiz.id}`)}
                                                className="px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-game-green border-t-transparent"></div>
                                <p className="mt-4 font-poppins font-medium">Loading Quizzes...</p>
                            </div>
                        )}

                        {!loading && filteredQuizzes.length === 0 && (
                            <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center justify-center text-slate-400">
                                <FaGamepad size={64} className="mb-4 opacity-20" />
                                <p className="font-poppins font-medium">No quizzes found.</p>
                                {!isDriver && <button onClick={handleCreateQuiz} className="mt-4 text-game-green font-bold hover:underline">Create your first quiz</button>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default GameManagement;
