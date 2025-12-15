import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { notificationService, type Notification } from '../services/notification.service';
import { toast } from 'react-toastify';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    socket: Socket | null;

    // Actions
    fetchNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    connectWebSocket: (token: string) => void;
    disconnectWebSocket: () => void;
    addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    socket: null,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const notifications = await notificationService.getAll();
            set({ notifications, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            set({ isLoading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const count = await notificationService.getUnreadCount();
            set({ unreadCount: count });
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    },

    markAsRead: async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
        } catch (error) {
            console.error('Failed to mark as read:', error);
            toast.error('Failed to mark notification as read');
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                unreadCount: 0,
            }));
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            toast.error('Failed to mark all as read');
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await notificationService.delete(id);
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: state.notifications.find((n) => n.id === id && !n.isRead)
                    ? state.unreadCount - 1
                    : state.unreadCount,
            }));
        } catch (error) {
            console.error('Failed to delete notification:', error);
            toast.error('Failed to delete notification');
        }
    },

    connectWebSocket: (token: string) => {
        const { socket: existingSocket } = get();

        // Don't reconnect if already connected with same token
        if (existingSocket?.connected) {
            console.log('🔄 WebSocket already connected, skipping reconnect');
            return;
        }

        // Disconnect any existing socket first
        if (existingSocket) {
            existingSocket.disconnect();
        }

        // Get base URL from VITE_API_URL (remove /api/v1 suffix)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        const baseUrl = apiUrl.replace(/\/api\/v1$/, '');
        const socketUrl = `${baseUrl}/notifications`;

        const socket = io(socketUrl, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('✅ Connected to notification WebSocket');
        });

        socket.on('notification', (notification: Notification) => {
            console.log('📬 Received notification:', notification);
            set((state) => ({
                notifications: [notification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            }));
            toast.info(notification.title);
        });

        socket.on('disconnect', () => {
            console.log('👋 Disconnected from notification WebSocket');
        });

        socket.on('connect_error', (error: any) => {
            console.error('❌ WebSocket connection error:', error);
        });

        set({ socket });
    },

    disconnectWebSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },

    addNotification: (notification: Notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },
}));
