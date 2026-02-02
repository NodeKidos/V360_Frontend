import axios from './api';

export interface QuizAnswer {
    id?: string;
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    id?: string;
    text: string;
    image?: string;
    timeLimit: number;
    order: number;
    answers: QuizAnswer[];
}

export interface Quiz {
    id?: string;
    title: string;
    description?: string;
    destinationId?: string;
    destination?: any;
    rewardPoints: number;
    isActive: boolean;
    questions: QuizQuestion[];
}

export interface GameSession {
    id: string;
    quizId: string;
    pin: string;
    status: 'lobby' | 'in_progress' | 'finished';
    currentQuestionIndex: number;
}

const gameService = {
    // --- Quiz Management ---
    getAllQuizzes: async () => {
        const response = await axios.get('/games/quiz');
        return response.data;
    },

    getAllQuizzesAdmin: async () => {
        const response = await axios.get('/v360/games/quiz');
        return response.data;
    },

    getQuizById: async (id: string) => {
        const response = await axios.get(`/games/quiz/${id}`);
        return response.data;
    },

    createQuiz: async (data: Partial<Quiz>) => {
        const response = await axios.post('/v360/games/quiz', data);
        return response.data;
    },

    updateQuiz: async (id: string, data: Partial<Quiz>) => {
        const response = await axios.put(`/v360/games/quiz/${id}`, data);
        return response.data;
    },

    deleteQuiz: async (id: string) => {
        const response = await axios.delete(`/v360/games/quiz/${id}`);
        return response.data;
    },

    // --- Session Management ---
    createSession: async (quizId: string) => {
        const response = await axios.post('/v360/games/session', { quizId });
        return response.data;
    },

    startSession: async (sessionId: string) => {
        const response = await axios.post(`/v360/games/session/${sessionId}/start`);
        return response.data;
    },

    nextQuestion: async (sessionId: string) => {
        const response = await axios.post(`/v360/games/session/${sessionId}/next`);
        return response.data;
    },

    joinSession: async (pin: string, nickname: string) => {
        const response = await axios.post('/v360/games/session/join', { pin, nickname });
        return response.data;
    },

    findSessionByPin: async (pin: string) => {
        const response = await axios.get(`/v360/games/session/${pin}`);
        return response.data;
    },

    getSessionState: async (pin: string) => {
        const response = await axios.get(`/v360/games/session/${pin}`);
        return response.data;
    },
};

export default gameService;
