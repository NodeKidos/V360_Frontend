import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import Pagination from "../../ui/Pagination";
import DeleteConfirmModal from "../../ui/DeleteConfirmModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuListFilter } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { FiEye, FiTrash2, FiEdit, FiChevronDown, FiFileText } from "react-icons/fi";
import { FaFilePdf, FaSlack } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { itineraryService } from "../../../services/itinerary.service";
import slackService from "../../../services/slack.service";
import pdfService from "../../../services/pdf.service";
import type { Itinerary } from "../../../types/itinerary.types";
import { ItineraryStatus } from "../../../types/itinerary.types";
import { Loader } from "../../ui/Loader";
import { useTranslation } from "react-i18next";
import { FiInfo } from "react-icons/fi"; // Import FiInfo

const ItineraryManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; itineraryId: string; itineraryNumber: string }>({
    isOpen: false,
    itineraryId: "",
    itineraryNumber: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch itineraries from API
  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        const response = await itineraryService.getAll({
          status: statusFilter || undefined,
          page,
          limit: itemsPerPage,
          search: debouncedSearch
        });

        setItineraries(response.data);
        setTotalItems(response.meta.total);
      } catch (error: any) {
        toast.error(error.response?.data?.message || t('management.itinerary.messages.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [statusFilter, page, itemsPerPage, debouncedSearch]);

  // Data is already filtered and paginated from server
  const currentItineraries = itineraries;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when status filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (statusDropdownOpen) {
        setStatusDropdownOpen(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [statusDropdownOpen]);

  // Handle status change
  const handleStatusChange = async (itineraryId: string, newStatus: ItineraryStatus) => {
    try {
      await itineraryService.updateStatus(itineraryId, newStatus);
      toast.success(t('management.itinerary.messages.statusUpdated'));
      // Update the itinerary in the list
      setItineraries(itineraries.map(it =>
        it.id === itineraryId ? { ...it, status: newStatus } : it
      ));
      setStatusDropdownOpen(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('management.itinerary.messages.statusFailed'));
    }
  };

  // Navigate to Itinerary Detail page
  const handleViewClick = (itineraryId: string) => {
    navigate(`/itinerary/${itineraryId}`);
  };

  // Delete itinerary
  const handleDeleteClick = (itineraryId: string, itineraryNumber: string) => {
    setDeleteModal({ isOpen: true, itineraryId, itineraryNumber });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await itineraryService.delete(deleteModal.itineraryId);
      toast.success(t('management.itinerary.messages.deleteSuccess'));
      // Refresh the list
      setItineraries(itineraries.filter(it => it.id !== deleteModal.itineraryId));
      setDeleteModal({ isOpen: false, itineraryId: "", itineraryNumber: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('management.itinerary.messages.deleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Create Slack channel
  const handleCreateSlackChannel = async (itineraryId: string) => {
    try {
      const response = await slackService.createChannel(itineraryId);
      toast.success(response.message || t('management.itinerary.messages.slackSuccess'));
      // Update the itinerary in the list
      setItineraries(itineraries.map(it =>
        it.id === itineraryId ? { ...it, slackChannelId: response.channelId } : it
      ));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('management.itinerary.messages.slackFailed'));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Check if itinerary has date-destination mismatch
  const checkDateMismatch = (itinerary: Itinerary): boolean => {
    if (!itinerary.startDate || !itinerary.endDate || !itinerary.days) {
      return false;
    }

    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const dateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Count unique destinations
    const uniqueDestinations = new Set(
      itinerary.days
        .map((day: any) => day.destination?.id)
        .filter(Boolean)
    );

    return uniqueDestinations.size > dateDays;
  };

  // Check if itinerary uses a flagged hotel during the unavailability period
  const checkHotelUnavailability = (itinerary: Itinerary): { isImpacted: boolean; hotelName?: string; reason?: string } => {
    // Skip if itinerary is completed, accepted, rejected, cancelled, or converted
    const excludedStatuses = [
      ItineraryStatus.COMPLETED,
      ItineraryStatus.ACCEPTED,
      ItineraryStatus.REJECTED,
      ItineraryStatus.CANCELLED,
      ItineraryStatus.CONVERTED
    ];

    if (excludedStatuses.includes(itinerary.status)) {
      return { isImpacted: false };
    }

    if (!itinerary.days) return { isImpacted: false };

    for (const day of itinerary.days) {
      // Check if day has a hotel and if that hotel is flagged
      const hotel = day.hotel;

      if (hotel && hotel.isFlagged && hotel.unavailabilityStart && hotel.unavailabilityEnd) {
        // Check if itinerary date overlaps with unavailability period
        const itineraryDate = new Date(day.date);
        const unavailableStart = new Date(hotel.unavailabilityStart);
        const unavailableEnd = new Date(hotel.unavailabilityEnd);

        // Reset times for accurate date comparison
        itineraryDate.setHours(0, 0, 0, 0);
        unavailableStart.setHours(0, 0, 0, 0);
        unavailableEnd.setHours(0, 0, 0, 0);

        if (itineraryDate >= unavailableStart && itineraryDate <= unavailableEnd) {
          return {
            isImpacted: true,
            hotelName: hotel.name,
            reason: hotel.flagReason
          };
        }
      }
    }

    return { isImpacted: false };
  };

  // Get status color
  const getStatusColor = (status: ItineraryStatus) => {
    switch (status) {
      case ItineraryStatus.DRAFT:
        return "text-gray-600";
      case ItineraryStatus.PENDING_QUOTE:
        return "text-yellow-600";
      case ItineraryStatus.QUOTED:
        return "text-blue-600";
      case ItineraryStatus.NEGOTIATING:
        return "text-orange-600";
      case ItineraryStatus.ACCEPTED:
        return "text-green-600";
      case ItineraryStatus.REJECTED:
        return "text-red-600";
      case ItineraryStatus.CANCELLED:
        return "text-red-400";
      case ItineraryStatus.CONVERTED:
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
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

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* TITLE - Desktop */}
          <div className="mb-4 mt-4 hidden md:flex md:justify-between md:items-center">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
              {t('management.itinerary.title')}
            </h2>
          </div>

          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              {t('management.itinerary.title')}
            </h2>
          </div>

          {/* SEARCH BAR - Mobile Only */}
          <div className="mb-6 relative md:hidden">
            <div className="relative">
              <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px]" />
              <input
                type="text"
                placeholder={t('dashboard.common.searchHere')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-[14px] md:text-[16px] font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
              />
            </div>
          </div>

          {/* VIEW & MANAGE SECTION - Desktop */}
          <div className="mb-6 hidden md:block">
            <div className="flex justify-between items-center p-2">
              {/* LEFT: Title */}
              <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px] lg:text-[18px]">
                {t('management.itinerary.subtitle')}
              </h4>

              {/* RIGHT: Filters */}
              <div className="flex items-center gap-3">
                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">{t('management.itinerary.filters.allStatus')}</option>
                  <option value={ItineraryStatus.DRAFT}>{t('management.itinerary.status.draft')}</option>
                  <option value={ItineraryStatus.PENDING_QUOTE}>{t('management.itinerary.status.pending_quote')}</option>
                  <option value={ItineraryStatus.QUOTED}>{t('management.itinerary.status.quoted')}</option>
                  <option value={ItineraryStatus.NEGOTIATING}>{t('management.itinerary.status.negotiating')}</option>
                  <option value={ItineraryStatus.ACCEPTED}>{t('management.itinerary.status.accepted')}</option>
                  <option value={ItineraryStatus.REJECTED}>{t('management.itinerary.status.rejected')}</option>
                  <option value={ItineraryStatus.CANCELLED}>{t('management.itinerary.status.cancelled')}</option>
                  <option value={ItineraryStatus.CONVERTED}>{t('management.itinerary.status.converted')}</option>
                </select>

                <button
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                  onClick={() => {
                    setStatusFilter("");
                    setSearchQuery("");
                  }}
                  title={t('management.itinerary.filters.clearFilters')}
                >
                  <LuListFilter className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* VIEW & MANAGE SECTION - Mobile */}
          <div className="mb-6 md:hidden">
            <div className="flex justify-between items-center mb-4">
              {/* LEFT: Title */}
              <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px]">
                {t('management.itinerary.subtitle')}
              </h4>
            </div>

            {/* FILTERS - Mobile */}
            <div className="flex items-center gap-2 justify-start">
              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">{t('management.itinerary.filters.allStatus')}</option>
                <option value={ItineraryStatus.DRAFT}>{t('management.itinerary.status.draft')}</option>
                <option value={ItineraryStatus.PENDING_QUOTE}>{t('management.itinerary.status.pending_quote')}</option>
                <option value={ItineraryStatus.QUOTED}>{t('management.itinerary.status.quoted')}</option>
                <option value={ItineraryStatus.NEGOTIATING}>{t('management.itinerary.status.negotiating')}</option>
                <option value={ItineraryStatus.ACCEPTED}>{t('management.itinerary.status.accepted')}</option>
                <option value={ItineraryStatus.REJECTED}>{t('management.itinerary.status.rejected')}</option>
                <option value={ItineraryStatus.CANCELLED}>{t('management.itinerary.status.cancelled')}</option>
                <option value={ItineraryStatus.CONVERTED}>{t('management.itinerary.status.converted')}</option>
              </select>

              <button
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
                onClick={() => {
                  setStatusFilter("");
                  setSearchQuery("");
                }}
                title={t('management.itinerary.filters.clearFilters')}
              >
                <LuListFilter className="text-[18px]" />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <Loader message={t('common.loading')} size={250} />
          )}

          {/* Empty State */}
          {!loading && itineraries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 text-lg font-poppins">{t('management.itinerary.emptyState')}</p>
            </div>
          )}

          {/* TABLE - Both Desktop and Mobile (Horizontally Scrollable) */}
          {!loading && itineraries.length > 0 && (
            <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 text-[#382A59] font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-left font-poppins">
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.itineraryNo')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.customerName')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.phone')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.email')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.startDate')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.endDate')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.participants')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.status')}</th>
                    <th className="px-4 py-4 whitespace-nowrap">{t('management.itinerary.table.createdAt')}</th>
                    <th className="px-4 py-4 text-center whitespace-nowrap">{t('management.itinerary.table.action')}</th>
                  </tr>
                </thead>

                <tbody className="font-poppins">
                  {currentItineraries.map((itinerary) => (
                    <tr
                      key={itinerary.id}
                      className="border-b border-gray-100 text-left text-[12px] sm:text-[13px] md:text-[14px] hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-gray-600 whitespace-nowrap font-medium">
                        {itinerary.itineraryNumber}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-medium text-gray-800">
                          {itinerary.lead?.user?.firstName} {itinerary.lead?.user?.lastName}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {itinerary.lead?.user?.phone || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {itinerary.lead?.user?.email || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(itinerary.startDate)}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(itinerary.endDate)}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap text-center">
                        {itinerary.numberOfParticipants}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap relative">
                        <div className="flex items-center gap-2">
                          <div className="relative inline-block">
                            <button
                              id={`status-btn-${itinerary.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusDropdownOpen(statusDropdownOpen === itinerary.id ? null : itinerary.id);
                              }}
                              className={`${getStatusColor(itinerary.status).replace("text-", "bg-").replace("-600", "-100").replace("-400", "-100")} ${getStatusColor(itinerary.status)} px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer`}
                            >
                              {t(`management.itinerary.status.${itinerary.status}`).toUpperCase()}
                              <FiChevronDown size={12} />
                            </button>
                          </div>

                          {/* Date-Destination Mismatch Warning Badge */}
                          {checkDateMismatch(itinerary) && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300" title={t('management.itinerary.tooltips.dateMismatch')}>
                              ⚠️
                            </span>
                          )}

                          {/* Hotel Unavailability Warning Badge */}
                          {(() => {
                            const { isImpacted, hotelName, reason } = checkHotelUnavailability(itinerary);
                            if (isImpacted) {
                              return (
                                <span
                                  className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1 animate-pulse"
                                  title={`${t('management.itinerary.tooltips.hotelUnavailable')}: ${hotelName} - ${reason}`}
                                >
                                  <MdFlag className="text-sm" />
                                  {t('management.itinerary.tooltips.actionRequired')}
                                </span>
                              );
                            }
                            return null;
                          })()}

                          {/* Driver Assignment Indicator */}
                          {(itinerary as any).driver && (itinerary as any).driver.name && (itinerary.status === 'accepted' || itinerary.status === 'in_progress' || itinerary.status === 'on_hold') && (
                            <span
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"
                              title={`Driver: ${(itinerary as any).driver.name}`}
                            >
                              🚗 {(itinerary as any).driver.name.split(' ')[0]}
                            </span>
                          )}


                          {/* Negotiation Info Icon */}
                          {itinerary.status === ItineraryStatus.NEGOTIATING && itinerary.negotiations && itinerary.negotiations.length > 0 && (
                            (() => {
                              // Find the latest negotiation from the user (lead)
                              const latestUserNegotiation = [...itinerary.negotiations]
                                .filter(n => !n.isFromAdmin)
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                              if (latestUserNegotiation) {
                                return (
                                  <div className="group relative">
                                    <FiInfo className="text-orange-500 cursor-help" size={16} />
                                    {/* Tooltip */}
                                    <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-xl text-xs z-[1000] invisible group-hover:visible">
                                      <div className="font-bold text-gray-800 mb-1">{t('management.itinerary.warnings.userNegotiation')}</div>
                                      {latestUserNegotiation.proposedPrice && (
                                        <div className="font-semibold text-green-600 mb-1">
                                          {t('management.itinerary.warnings.expected')}: {itinerary.quote?.currency || '$'} {latestUserNegotiation.proposedPrice.toLocaleString()}
                                        </div>
                                      )}
                                      <div className="text-gray-600 italic">"{latestUserNegotiation.message}"</div>
                                      <div className="text-gray-400 mt-1 pb-1 border-b border-gray-100">{formatDate(latestUserNegotiation.createdAt)}</div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()
                          )}
                        </div>

                        {/* Status Dropdown - Using fixed positioning to escape table overflow */}
                        {statusDropdownOpen === itinerary.id && (
                          <div
                            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] max-h-[300px] overflow-y-auto overflow-x-hidden z-[9999] flex flex-col"
                            style={{
                              top: `${(document.getElementById(`status-btn-${itinerary.id}`)?.getBoundingClientRect().bottom || 0) + 4}px`,
                              left: `${document.getElementById(`status-btn-${itinerary.id}`)?.getBoundingClientRect().left || 0}px`,
                              scrollbarWidth: 'thin'
                            }}
                          >
                            {Object.values(ItineraryStatus).map((status) => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(itinerary.id, status);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors block ${itinerary.status === status ? 'bg-purple-50 font-semibold' : ''
                                  }`}
                              >
                                {t(`management.itinerary.status.${status}`).toUpperCase()}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        <div>{formatDate(itinerary.createdAt)}</div>
                        <div className="text-xs text-gray-500">{formatTime(itinerary.createdAt)}</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-center items-center">
                          <FaFilePdf
                            className="text-green-600 cursor-pointer text-[18px] hover:text-green-700 transition-colors"
                            onClick={async () => {
                              try {
                                await pdfService.downloadPDF(itinerary.id, itinerary.itineraryNumber);
                              } catch (error) {
                                toast.error(t('management.itinerary.messages.pdfFailed'));
                              }
                            }}
                            title={t('management.itinerary.tooltips.downloadPdf')}
                          />
                          <button
                            onClick={async () => {
                              try {
                                await pdfService.previewPDF(itinerary.id);
                              } catch (error) {
                                toast.error(t('management.itinerary.messages.pdfViewFailed'));
                              }
                            }}
                            className="text-orange-500 cursor-pointer text-[18px] hover:text-orange-700 transition-colors bg-transparent border-none p-0 flex items-center"
                            title={t('management.itinerary.tooltips.viewPdf')}
                          >
                            <FiFileText />
                          </button>
                          <FiEye
                            className="text-[#B749DB] cursor-pointer text-[18px] hover:text-purple-700 transition-colors"
                            onClick={() => handleViewClick(itinerary.id)}
                            title={t('management.itinerary.tooltips.viewDetails')}
                          />
                          <FiEdit
                            className="text-blue-600 cursor-pointer text-[18px] hover:text-blue-800 transition-colors"
                            onClick={() => navigate(`/itinerary/${itinerary.id}/edit`)}
                            title={t('management.itinerary.tooltips.editItinerary')}
                          />
                          {(itinerary.status === ItineraryStatus.DRAFT || itinerary.status === ItineraryStatus.REJECTED) && (
                            <FiTrash2
                              className="text-red-500 cursor-pointer text-[18px] hover:text-red-700 transition-colors"
                              onClick={() => handleDeleteClick(itinerary.id, itinerary.itineraryNumber)}
                              title={t('management.itinerary.tooltips.deleteItinerary')}
                            />
                          )}
                          <FaSlack
                            className={`${itinerary.slackChannelId ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'} cursor-pointer text-[18px] transition-colors`}
                            onClick={() => {
                              if (!itinerary.slackChannelId) {
                                handleCreateSlackChannel(itinerary.id);
                              } else {
                                toast.info(`Slack Channel ID: ${itinerary.slackChannelId}`);
                              }
                            }}
                            title={itinerary.slackChannelId ? t('management.itinerary.tooltips.slackLinked') : t('management.itinerary.tooltips.createSlack')}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && itineraries.length > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}

          <ToastContainer />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itineraryId: "", itineraryNumber: "" })}
        onConfirm={handleConfirmDelete}
        title={t('management.itinerary.modals.deleteTitle')}
        description={t('management.itinerary.modals.deleteDescription', { itineraryNumber: deleteModal.itineraryNumber })}
        confirmText={t('management.itinerary.modals.confirm')}
        cancelText={t('management.itinerary.modals.cancel')}
        isDeleting={isDeleting}
      />
    </div >
  );
};

export default ItineraryManagement;
