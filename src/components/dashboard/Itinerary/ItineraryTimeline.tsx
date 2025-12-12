import { useEffect, useState } from 'react';
import { activityLogService, type ActivityLog } from '../../../services/activity-log.service';
import { Loader } from '../../ui/Loader';
import { FiClock, FiUser, FiFileText } from 'react-icons/fi';
import { BsCheck2Circle, BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs';
import { IoMdRefresh } from 'react-icons/io';

interface ItineraryTimelineProps {
    itineraryId: string;
}

const ItineraryTimeline = ({ itineraryId }: ItineraryTimelineProps) => {
    const [timeline, setTimeline] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeline = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await activityLogService.getByItinerary(itineraryId);
            setTimeline(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to load timeline');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeline();
    }, [itineraryId]);

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE':
                return <BsPencilSquare className="text-blue-500" />;
            case 'UPDATE':
                return <BsPencilSquare className="text-orange-500" />;
            case 'DELETE':
                return <BsTrash className="text-red-500" />;
            case 'VIEW':
                return <BsEye className="text-gray-500" />;
            case 'STATUS_CHANGE':
                return <IoMdRefresh className="text-purple-500" />;
            case 'QUOTE_SENT':
            case 'QUOTE_UPDATED':
                return <FiFileText className="text-green-500" />;
            default:
                return <BsCheck2Circle className="text-gray-500" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE':
                return 'bg-blue-100 border-blue-300';
            case 'UPDATE':
                return 'bg-orange-100 border-orange-300';
            case 'DELETE':
                return 'bg-red-100 border-red-300';
            case 'STATUS_CHANGE':
                return 'bg-purple-100 border-purple-300';
            case 'QUOTE_SENT':
            case 'QUOTE_UPDATED':
                return 'bg-green-100 border-green-300';
            default:
                return 'bg-gray-100 border-gray-300';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader className="w-12 h-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchTimeline}
                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (timeline.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <FiClock className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600">No activity recorded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-poppins">Activity Timeline</h3>
                <button
                    onClick={fetchTimeline}
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                    <IoMdRefresh className="text-lg" />
                    Refresh
                </button>
            </div>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />

                {/* Timeline items */}
                <div className="space-y-4">
                    {timeline.map((log, index) => (
                        <div key={log.id} className="relative flex gap-4">
                            {/* Icon */}
                            <div
                                className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${getActionColor(
                                    log.action
                                )} flex items-center justify-center bg-white z-10`}
                            >
                                {getActionIcon(log.action)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 font-poppins">
                                            {log.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            {log.user && (
                                                <span className="flex items-center gap-1">
                                                    <FiUser className="text-xs" />
                                                    {log.user.name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <FiClock className="text-xs" />
                                                {formatDate(log.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${log.action === 'CREATE'
                                                ? 'bg-blue-100 text-blue-700'
                                                : log.action === 'UPDATE'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : log.action === 'DELETE'
                                                        ? 'bg-red-100 text-red-700'
                                                        : log.action === 'STATUS_CHANGE'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {log.action.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Details */}
                                {log.details && Object.keys(log.details).length > 0 && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-purple-600 cursor-pointer hover:text-purple-700">
                                            View details
                                        </summary>
                                        <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-xs font-mono overflow-x-auto">
                                            <pre className="whitespace-pre-wrap">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItineraryTimeline;
