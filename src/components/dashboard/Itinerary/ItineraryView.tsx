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
import { FiEye, FiTrash2, FiEdit } from "react-icons/fi";
import { itineraryService } from "../../../services/itinerary.service";
import type { Itinerary } from "../../../types/itinerary.types";
import { ItineraryStatus } from "../../../types/itinerary.types";

const ItineraryManagement = () => {
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

  // Fetch itineraries from API
  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        const data = await itineraryService.getAll(statusFilter as ItineraryStatus | undefined);
        setItineraries(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [statusFilter]);

  // Filter itineraries based on search query and status
  const filteredItineraries = itineraries.filter((itinerary) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      itinerary.itineraryNumber.toLowerCase().includes(searchLower) ||
      itinerary.lead?.firstName?.toLowerCase().includes(searchLower) ||
      itinerary.lead?.lastName?.toLowerCase().includes(searchLower) ||
      itinerary.lead?.email?.toLowerCase().includes(searchLower) ||
      itinerary.lead?.phone?.toLowerCase().includes(searchLower) ||
      itinerary.status.toLowerCase().includes(searchLower);

    return matchesSearch;
  });

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItineraries = filteredItineraries.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

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
      toast.success("Itinerary deleted successfully!");
      // Refresh the list
      setItineraries(itineraries.filter(it => it.id !== deleteModal.itineraryId));
      setDeleteModal({ isOpen: false, itineraryId: "", itineraryNumber: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete itinerary");
    } finally {
      setIsDeleting(false);
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

  // Get status badge
  const getStatusBadge = (status: ItineraryStatus) => {
    const color = getStatusColor(status);
    const bgColor = color.replace("text-", "bg-").replace("-600", "-100").replace("-400", "-100");
    return (
      <span className={`${bgColor} ${color} px-3 py-1 rounded-full text-xs font-medium`}>
        {status.replace(/_/g, " ").toUpperCase()}
      </span>
    );
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
              Itinerary Management
            </h2>
          </div>

          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              Itinerary Management
            </h2>
          </div>

          {/* SEARCH BAR - Mobile Only */}
          <div className="mb-6 relative md:hidden">
            <div className="relative">
              <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px]" />
              <input
                type="text"
                placeholder="Search here"
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
                View & manage itinerary details
              </h4>

              {/* RIGHT: Filters */}
              <div className="flex items-center gap-3">
                <select
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value={ItineraryStatus.DRAFT}>Draft</option>
                  <option value={ItineraryStatus.PENDING_QUOTE}>Pending Quote</option>
                  <option value={ItineraryStatus.QUOTED}>Quoted</option>
                  <option value={ItineraryStatus.NEGOTIATING}>Negotiating</option>
                  <option value={ItineraryStatus.ACCEPTED}>Accepted</option>
                  <option value={ItineraryStatus.REJECTED}>Rejected</option>
                  <option value={ItineraryStatus.CANCELLED}>Cancelled</option>
                  <option value={ItineraryStatus.CONVERTED}>Converted</option>
                </select>

                <button
                  className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                  onClick={() => {
                    setStatusFilter("");
                    setSearchQuery("");
                  }}
                  title="Clear all filters"
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
                View & manage itinerary details
              </h4>
            </div>

            {/* FILTERS - Mobile */}
            <div className="flex items-center gap-2 justify-start">
              <select
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 text-[12px] font-poppins bg-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value={ItineraryStatus.DRAFT}>Draft</option>
                <option value={ItineraryStatus.PENDING_QUOTE}>Pending Quote</option>
                <option value={ItineraryStatus.QUOTED}>Quoted</option>
                <option value={ItineraryStatus.NEGOTIATING}>Negotiating</option>
                <option value={ItineraryStatus.ACCEPTED}>Accepted</option>
                <option value={ItineraryStatus.REJECTED}>Rejected</option>
                <option value={ItineraryStatus.CANCELLED}>Cancelled</option>
                <option value={ItineraryStatus.CONVERTED}>Converted</option>
              </select>

              <button
                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
                onClick={() => {
                  setStatusFilter("");
                  setSearchQuery("");
                }}
                title="Clear all filters"
              >
                <LuListFilter className="text-[18px]" />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B749DB]"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredItineraries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 text-lg font-poppins">No itineraries found</p>
            </div>
          )}

          {/* TABLE - Both Desktop and Mobile (Horizontally Scrollable) */}
          {!loading && filteredItineraries.length > 0 && (
            <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 text-[#382A59] font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-left font-poppins">
                    <th className="px-4 py-4 whitespace-nowrap">Itinerary No</th>
                    <th className="px-4 py-4 whitespace-nowrap">Customer Name</th>
                    <th className="px-4 py-4 whitespace-nowrap">Phone</th>
                    <th className="px-4 py-4 whitespace-nowrap">Email</th>
                    <th className="px-4 py-4 whitespace-nowrap">Start Date</th>
                    <th className="px-4 py-4 whitespace-nowrap">End Date</th>
                    <th className="px-4 py-4 whitespace-nowrap">Participants</th>
                    <th className="px-4 py-4 whitespace-nowrap">Status</th>
                    <th className="px-4 py-4 whitespace-nowrap">Created At</th>
                    <th className="px-4 py-4 text-center whitespace-nowrap">Action</th>
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
                          {itinerary.lead?.firstName} {itinerary.lead?.lastName}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {itinerary.lead?.phone || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {itinerary.lead?.email || "N/A"}
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

                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(itinerary.status)}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        <div>{formatDate(itinerary.createdAt)}</div>
                        <div className="text-xs text-gray-500">{formatTime(itinerary.createdAt)}</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-3 justify-center">
                          <FiEye
                            className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                            onClick={() => handleViewClick(itinerary.id)}
                            title="View Details"
                          />
                          <FiEdit
                            className="text-blue-600 cursor-pointer text-[20px] hover:text-blue-800"
                            onClick={() => navigate(`/itinerary/${itinerary.id}/edit`)}
                            title="Edit Itinerary"
                          />
                          {(itinerary.status === ItineraryStatus.DRAFT || itinerary.status === ItineraryStatus.REJECTED) && (
                            <FiTrash2
                              className="text-red-500 cursor-pointer text-[20px] hover:text-red-700"
                              onClick={() => handleDeleteClick(itinerary.id, itinerary.itineraryNumber)}
                              title="Delete Itinerary"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && filteredItineraries.length > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalItems={filteredItineraries.length}
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
        title="Delete Itinerary"
        description={`Are you sure you want to delete itinerary ${deleteModal.itineraryNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ItineraryManagement;
