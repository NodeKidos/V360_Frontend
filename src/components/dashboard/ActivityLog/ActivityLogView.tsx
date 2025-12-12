import { useState, useEffect } from 'react';
import { activityLogService, type ActivityLogResponse, type ActivityLogFilters } from '../../../services/activity-log.service';
import { Loader } from '../../ui/Loader';
import Sidebar from '../../AdminSidebar';
import TopBar from '../../Topbar';
import Pagination from '../../ui/Pagination';
import { FiClock, FiUser, FiFilter } from 'react-icons/fi';
import { BsCheck2Circle, BsPencilSquare, BsTrash, BsEye, BsX } from 'react-icons/bs';
import { IoMdRefresh } from 'react-icons/io';
import { toast } from 'react-toastify';

const ActivityLogView = () => {
    const [logs, setLogs] = useState<ActivityLogResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);

    // Filters 
    const [filters, setFilters] = useState<ActivityLogFilters>({});
    const [tempFilters, setTempFilters] = useState<ActivityLogFilters>({});

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await activityLogService.getAll(page, itemsPerPage, filters);
            setLogs(data);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [page, itemsPerPage, filters]);

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
            default:
                return <BsCheck2Circle className="text-gray-500" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE':
                return 'text-blue-600 bg-blue-50';
            case 'UPDATE':
                return 'text-orange-600 bg-orange-50';
            case 'DELETE':
                return 'text-red-600 bg-red-50';
            case 'STATUS_CHANGE':
                return 'text-purple-600 bg-purple-50';
            default:
                return 'text-gray-600 bg-gray-50';
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

    const applyFilters = () => {
        setFilters(tempFilters);
        setPage(1);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setTempFilters({});
        setFilters({});
        setPage(1);
        setShowFilters(false);
    };

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    {/* Header */}
                    <div className="mb-4 mt-4 flex justify-between items-center">
                        <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
                            Activity Log
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showFilters ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-gray-300 text-gray-700'
                                    } hover:bg-purple-50`}
                            >
                                <FiFilter />
                                Filters
                            </button>
                            <button
                                onClick={fetchLogs}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                <IoMdRefresh />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6 font-poppins">
                        Complete audit trail of all admin and staff actions
                    </p>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={tempFilters.entityType || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, entityType: e.target.value || undefined })}
                                    >
                                        <option value="">All</option>
                                        <option value="USER">User</option>
                                        <option value="STAFF">Staff</option>
                                        <option value="DRIVER">Driver</option>
                                        <option value="VEHICLE">Vehicle</option>
                                        <option value="ITINERARY">Itinerary</option>
                                        <option value="BOOKING">Booking</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={tempFilters.action || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, action: e.target.value || undefined })}
                                    >
                                        <option value="">All</option>
                                        <option value="CREATE">Create</option>
                                        <option value="UPDATE">Update</option>
                                        <option value="DELETE">Delete</option>
                                        <option value="STATUS_CHANGE">Status Change</option>
                                        <option value="QUOTE_SENT">Quote Sent</option>
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        <BsX className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Log Table */}
                    {loading ? (
                        <Loader src="/loaders/travelloading.lottie" message="Loading activity logs..." size={250} />
                    ) : (
                        <>
                            <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-700 font-semibold text-sm text-left font-poppins">
                                            <th className="px-4 py-4 whitespace-nowrap">Timestamp</th>
                                            <th className="px-4 py-4 whitespace-nowrap">Action</th>
                                            <th className="px-4 py-4 whitespace-nowrap">Entity</th>
                                            <th className="px-4 py-4 whitespace-nowrap">User</th>
                                            <th className="px-4 py-4">Description</th>
                                            <th className="px-4 py-4 text-center">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-poppins">
                                        {logs && logs.logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                                    No activity logs found
                                                </td>
                                            </tr>
                                        ) : (
                                            logs?.logs.map((log) => (
                                                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <FiClock className="text-gray-400" />
                                                            {formatDate(log.timestamp)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                            {getActionIcon(log.action)}
                                                            {log.action.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                        Entity Type Here
                                                    </td>
                                                    <td className="px-4 py-4 text-sm">
                                                        {log.user ? (
                                                            <div>
                                                                <div className="flex items-center gap-1 font-medium text-gray-900">
                                                                    <FiUser className="text-xs" />
                                                                    {log.user.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">{log.user.email}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">System</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{log.description}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        {log.details && Object.keys(log.details).length > 0 && (
                                                            <details className="inline-block">
                                                                <summary className="cursor-pointer text-purple-600 hover:text-purple-700 text-sm">
                                                                    View
                                                                </summary>
                                                                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-left text-xs font-mono max-w-md">
                                                                    <pre className="whitespace-pre-wrap overflow-x-auto">
                                                                        {JSON.stringify(log.details, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            </details>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {logs && logs.total > 0 && (
                                <Pagination
                                    currentPage={page}
                                    totalItems={logs.total}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogView;
