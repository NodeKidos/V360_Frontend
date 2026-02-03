import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Notification } from '../services/notification.service';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
    const navigate = useNavigate();
    const {
        notifications,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotificationStore();

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.id);
        }

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            onClose();
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'error':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'warning':
                return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'success':
                return 'bg-green-100 text-green-700 border-green-300';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-300';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'success':
                return ' ';
            default:
                return 'ℹ️';
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/20"
                onClick={onClose}
            ></div>

            {/* Popup */}
            <div className="fixed top-16 right-4 z-50 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <FaBell className="text-[#B749DB] text-xl" />
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                    <div className="px-4 py-2 border-b border-gray-100">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-[#B749DB] hover:text-[#9f37c9] font-medium flex items-center gap-1"
                        >
                            <FaCheck size={12} />
                            Mark all as read
                        </button>
                    </div>
                )}

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B749DB]"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FaBell className="text-gray-300 text-4xl mb-3" />
                            <p className="text-gray-500 text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-blue-50/50' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#B749DB] rounded-full"></div>
                                    )}

                                    <div className="flex gap-3 ml-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getSeverityColor(notification.severity)} border flex items-center justify-center text-lg`}>
                                            {getSeverityIcon(notification.severity)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                                {notification.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                                {notification.entityType && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                        {notification.entityType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
