import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../AdminSidebar';
import TopBar from '../../Topbar';
import { IoMdArrowBack, IoMdAdd, IoMdTrash, IoMdSave } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';
import gameService from '../../../services/game.service';
import type { Quiz, QuizQuestion } from '../../../services/game.service';
import destinationService from '../../../services/destination.service';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestionCircle, FaImage, FaClock, FaCheckCircle } from 'react-icons/fa';

const QuizCreator = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [destinations, setDestinations] = useState<any[]>([]);

    const [quiz, setQuiz] = useState<Partial<Quiz>>({
        title: '',
        description: '',
        destinationId: '',
        rewardPoints: 100,
        isActive: true,
        questions: []
    });

    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const dests = await destinationService.getAll();
            setDestinations(dests);

            if (isEdit) {
                const data = await gameService.getQuizById(id);
                setQuiz(data);
                if (data.questions.length > 0) setActiveQuestionIndex(0);
            } else {
                // Pre-add one question
                addQuestion();
            }
        } catch (error) {
            toast.error("Failed to load quiz data");
        }
    };

    const addQuestion = () => {
        const newQuestion: QuizQuestion = {
            text: '',
            timeLimit: 20,
            order: quiz.questions?.length || 0,
            answers: [
                { text: '', isCorrect: true },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
            ]
        };
        const updatedQuestions = [...(quiz.questions || []), newQuestion];
        setQuiz({ ...quiz, questions: updatedQuestions });
        setActiveQuestionIndex(updatedQuestions.length - 1);
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = quiz.questions?.filter((_, i) => i !== index);
        setQuiz({ ...quiz, questions: updatedQuestions });
        if (activeQuestionIndex === index) {
            setActiveQuestionIndex(updatedQuestions!.length > 0 ? 0 : null);
        } else if (activeQuestionIndex !== null && activeQuestionIndex > index) {
            setActiveQuestionIndex(activeQuestionIndex - 1);
        }
    };

    const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
        const updatedQuestions = [...(quiz.questions || [])];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleAnswerChange = (qIndex: number, aIndex: number, field: string, value: any) => {
        const updatedQuestions = [...(quiz.questions || [])];
        const updatedAnswers = [...updatedQuestions[qIndex].answers];

        if (field === 'isCorrect' && value === true) {
            // Uncheck others
            updatedAnswers.forEach((a, i) => a.isCorrect = i === aIndex);
        } else {
            (updatedAnswers[aIndex] as any)[field] = value;
        }

        updatedQuestions[qIndex].answers = updatedAnswers;
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleSave = async () => {
        try {
            if (!quiz.title) {
                toast.error("Please enter a quiz title");
                return;
            }

            if (!quiz.questions || quiz.questions.length === 0) {
                toast.error("Please add at least one question");
                return;
            }

            // Simple validation for questions
            for (const q of quiz.questions) {
                if (!q.text) {
                    toast.error("All questions must have text");
                    return;
                }
                const hasCorrect = q.answers.some(a => a.isCorrect);
                const allAnswered = q.answers.every(a => a.text);
                if (!hasCorrect || !allAnswered) {
                    toast.error("Each question needs 4 answers and one marked as correct");
                    return;
                }
            }

            if (isEdit) {
                await gameService.updateQuiz(id!, quiz);
                toast.success("Quiz updated successfully");
            } else {
                await gameService.createQuiz(quiz);
                toast.success("Quiz created successfully");
            }
            navigate("/v360/game");
        } catch (error) {
            toast.error("Failed to save quiz");
        }
    };

    return (
        <div className="h-screen bg-[#F1F5F9] flex overflow-hidden">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={false}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-6">
                    <TopBar isMobile={false} setSidebarOpen={setSidebarOpen} />

                    <div className="mt-6 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/v360/game")}
                                className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                <IoMdArrowBack size={24} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold font-poppins text-slate-800">
                                    {isEdit ? "Edit Quiz" : "Create New Quiz"}
                                </h2>
                                <p className="text-slate-500 text-sm">Design an interactive Sri Lankan tourism quiz</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-game-green text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-game-green/20"
                        >
                            <IoMdSave size={20} />
                            Save Quiz
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
                        {/* Quiz Settings Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-game-green rounded-full"></div>
                                    General Settings
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Wonders of Sigiriya"
                                            value={quiz.title}
                                            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-game-green/20 outline-none font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</label>
                                        <select
                                            value={quiz.destinationId}
                                            onChange={(e) => setQuiz({ ...quiz, destinationId: e.target.value })}
                                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-game-green/20 outline-none font-medium"
                                        >
                                            <option value="">Select a Destination</option>
                                            {destinations.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reward Pts</label>
                                            <input
                                                type="number"
                                                value={quiz.rewardPoints}
                                                onChange={(e) => setQuiz({ ...quiz, rewardPoints: parseInt(e.target.value) })}
                                                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-game-green/20 outline-none font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                            <div className="mt-1 flex-1 flex items-center">
                                                <button
                                                    onClick={() => setQuiz({ ...quiz, isActive: !quiz.isActive })}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${quiz.isActive ? 'bg-game-green/10 text-game-green' : 'bg-slate-100 text-slate-400'}`}
                                                >
                                                    {quiz.isActive ? 'ACTIVE' : 'DRAFT'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                        <textarea
                                            rows={3}
                                            placeholder="What is this quiz about?"
                                            value={quiz.description}
                                            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-game-green/20 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-game-blue"></div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        Questions
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-500">{quiz.questions?.length || 0}</span>
                                    </h3>
                                    <button
                                        onClick={addQuestion}
                                        className="text-game-blue hover:bg-game-blue/5 p-2 rounded-lg transition-colors"
                                    >
                                        <IoMdAdd size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                    {quiz.questions?.map((q, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveQuestionIndex(idx)}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeQuestionIndex === idx ? 'bg-game-blue/5 border-game-blue/30 shadow-md' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${activeQuestionIndex === idx ? 'bg-game-blue text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className={`text-sm font-semibold truncate max-w-[150px] ${activeQuestionIndex === idx ? 'text-game-blue' : 'text-slate-600'}`}>
                                                        {q.text || "Empty Question"}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeQuestion(idx); }}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-game-red hover:bg-game-red/5 rounded-lg transition-all"
                                                >
                                                    <IoMdTrash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Editor Panel */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {activeQuestionIndex !== null ? (
                                    <motion.div
                                        key={activeQuestionIndex}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-200 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-game-green/2 rounded-full -mr-32 -mt-32"></div>

                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-game-green text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-game-green/20">
                                                    {activeQuestionIndex + 1}
                                                </div>
                                                <h4 className="text-xl font-bold text-slate-800">Edit Question</h4>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col items-end">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Limit</label>
                                                    <div className="flex items-center gap-2">
                                                        <FaClock className="text-game-yellow" />
                                                        <select
                                                            value={quiz.questions![activeQuestionIndex].timeLimit}
                                                            onChange={(e) => handleQuestionChange(activeQuestionIndex, 'timeLimit', parseInt(e.target.value))}
                                                            className="bg-transparent font-bold text-slate-700 outline-none"
                                                        >
                                                            <option value={10}>10s</option>
                                                            <option value={20}>20s</option>
                                                            <option value={30}>30s</option>
                                                            <option value={60}>60s</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="h-8 w-px bg-slate-100"></div>
                                                <button
                                                    onClick={() => removeQuestion(activeQuestionIndex)}
                                                    className="p-3 text-slate-400 hover:text-game-red hover:bg-game-red/5 rounded-2xl transition-all"
                                                >
                                                    <IoMdTrash size={24} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-8 relative z-10">
                                            {/* Question Text */}
                                            <div className="bg-slate-50 p-1 rounded-[32px] border border-slate-100">
                                                <textarea
                                                    rows={3}
                                                    placeholder="Start typing your question here..."
                                                    value={quiz.questions![activeQuestionIndex].text}
                                                    onChange={(e) => handleQuestionChange(activeQuestionIndex, 'text', e.target.value)}
                                                    className="w-full bg-transparent p-6 text-2xl font-bold text-center text-slate-800 placeholder:text-slate-300 outline-none resize-none"
                                                />
                                            </div>

                                            {/* Media Upload Placeholder */}
                                            <div className="aspect-video bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer group">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                    <FaImage size={24} className="text-game-blue" />
                                                </div>
                                                <p className="font-bold text-sm">Add Beach/Temple Image</p>
                                                <p className="text-xs opacity-60">High energy visual for the lobby</p>
                                            </div>

                                            {/* Answers Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {quiz.questions![activeQuestionIndex].answers.map((answer, aIdx) => {
                                                    const colors = [
                                                        'border-game-red/20 focus-within:ring-game-red/10',
                                                        'border-game-blue/20 focus-within:ring-game-blue/10',
                                                        'border-game-yellow/20 focus-within:ring-game-yellow/10',
                                                        'border-game-green/20 focus-within:ring-game-green/10'
                                                    ];
                                                    const bgColors = [
                                                        'bg-game-red', 'bg-game-blue', 'bg-game-yellow', 'bg-game-green'
                                                    ];

                                                    return (
                                                        <div
                                                            key={aIdx}
                                                            className={`relative min-h-[80px] rounded-2xl bg-white border-2 flex items-center p-1 transition-all group ${colors[aIdx]} ${answer.isCorrect ? 'border-game-green ring-4 ring-game-green/5' : ''}`}
                                                        >
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ml-2 ${bgColors[aIdx]} shadow-sm`}>
                                                                {aIdx === 0 && '▲'}
                                                                {aIdx === 1 && '◆'}
                                                                {aIdx === 2 && '●'}
                                                                {aIdx === 3 && '■'}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder={`Answer ${aIdx + 1}...`}
                                                                value={answer.text}
                                                                onChange={(e) => handleAnswerChange(activeQuestionIndex, aIdx, 'text', e.target.value)}
                                                                className="flex-1 bg-transparent px-4 py-2 font-bold text-slate-700 outline-none"
                                                            />
                                                            <button
                                                                onClick={() => handleAnswerChange(activeQuestionIndex, aIdx, 'isCorrect', true)}
                                                                className={`p-3 mr-2 rounded-xl transition-all ${answer.isCorrect ? 'bg-game-green text-white scale-110' : 'bg-slate-100 text-slate-300 hover:bg-game-green/10'}`}
                                                            >
                                                                <FaCheckCircle size={20} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-[600px] bg-white rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                        <FaQuestionCircle size={80} className="mb-6 opacity-10" />
                                        <h4 className="text-xl font-bold text-slate-500">Pick a Question to Edit</h4>
                                        <p className="text-slate-400 max-w-sm text-center mt-2">Create engaging questions about Sri Lankan culture, tea, and beaches.</p>
                                        <button
                                            onClick={addQuestion}
                                            className="mt-8 bg-game-blue text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2"
                                        >
                                            <IoMdAdd />
                                            Start with Question 1
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default QuizCreator;
