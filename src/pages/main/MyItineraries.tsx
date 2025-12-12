import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItineraryStore } from "../../store/useItineraryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ItineraryStatus } from "../../types/itinerary.types";
import Navbar from "../../components/home/Navbar";
import { FaPlus, FaEye, FaEdit, FaTrash, FaPaperPlane, FaCheck, FaTimes, FaChevronDown } from "react-icons/fa";
import { itineraryService } from "../../services/itinerary.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  [ItineraryStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [ItineraryStatus.PENDING_QUOTE]: "bg-yellow-100 text-yellow-800",
  [ItineraryStatus.QUOTED]: "bg-blue-100 text-blue-800",
  [ItineraryStatus.NEGOTIATING]: "bg-purple-100 text-purple-800",
  [ItineraryStatus.ACCEPTED]: "bg-green-100 text-green-800",
  [ItineraryStatus.REJECTED]: "bg-red-100 text-red-800",
  [ItineraryStatus.IN_PROGRESS]: "bg-indigo-100 text-indigo-800",
  [ItineraryStatus.ON_HOLD]: "bg-orange-100 text-orange-800",
  [ItineraryStatus.COMPLETED]: "bg-emerald-100 text-emerald-800",
  [ItineraryStatus.CANCELLED]: "bg-gray-100 text-gray-800",
  [ItineraryStatus.CONVERTED]: "bg-teal-100 text-teal-800",
};

const statusLabels = {
  [ItineraryStatus.DRAFT]: "Draft",
  [ItineraryStatus.PENDING_QUOTE]: "Pending Quote",
  [ItineraryStatus.QUOTED]: "Quoted",
  [ItineraryStatus.NEGOTIATING]: "Negotiating",
  [ItineraryStatus.ACCEPTED]: "Accepted",
  [ItineraryStatus.REJECTED]: "Rejected",
  [ItineraryStatus.IN_PROGRESS]: "In Progress",
  [ItineraryStatus.ON_HOLD]: "On Hold",
  [ItineraryStatus.COMPLETED]: "Completed",
  [ItineraryStatus.CANCELLED]: "Cancelled",
  [ItineraryStatus.CONVERTED]: "Converted to Booking",
};

export default function MyItineraries() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { itineraries, getMyItineraries, deleteItinerary, submitForQuote, isLoading } = useItineraryStore();
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    getMyItineraries();
  }, [isLoggedIn, navigate]);

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      await deleteItinerary(id);
    }
  };

  const handleSubmitForQuote = async (id: string) => {
    if (window.confirm("Submit this itinerary for quote?")) {
      const success = await submitForQuote(id);
      if (success) {
        getMyItineraries(); // Refresh list
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: ItineraryStatus) => {
    try {
      await itineraryService.updateStatus(id, newStatus);
      toast.success("Status updated successfully!");
      getMyItineraries(); // Refresh list
      setStatusDropdownOpen(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Itineraries</h1>
            <p className="text-gray-600 mt-1">Manage your travel plans and quotes</p>
          </div>
          <button
            onClick={() => navigate("/itinerary")}
            className="flex items-center gap-2 bg-[#B749DB] text-white px-6 py-3 rounded-lg hover:bg-[#8B2BB9] transition-colors font-medium"
          >
            <FaPlus /> Create New Itinerary
          </button>
        </div>

        {/* Loading State */}
        {isLoading && itineraries.length === 0 && (
          <div className="text-center py-12">
            <svg className="animate-spin h-12 w-12 mx-auto text-[#B749DB]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600 mt-4">Loading itineraries...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && itineraries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Itineraries Yet</h2>
            <p className="text-gray-600 mb-6">Start planning your dream vacation!</p>
            <button
              onClick={() => navigate("/itinerary")}
              className="bg-[#B749DB] text-white px-6 py-3 rounded-lg hover:bg-[#8B2BB9] transition-colors font-medium"
            >
              Create Your First Itinerary
            </button>
          </div>
        )}

        {/* Itineraries Grid */}
        {itineraries.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#B749DB] to-[#8B2BB9] p-4">
                  <div className="flex justify-between items-start">
                    <div className="text-white">
                      <p className="text-sm opacity-90">Itinerary</p>
                      <h3 className="text-lg font-bold">{itinerary.itineraryNumber}</h3>
                    </div>
                    <div className="relative">
                      <button
                        id={`status-btn-${itinerary.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusDropdownOpen(statusDropdownOpen === itinerary.id ? null : itinerary.id);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[itinerary.status]} hover:opacity-80 transition-opacity`}
                      >
                        {statusLabels[itinerary.status]}
                        <FaChevronDown size={10} />
                      </button>
                    </div>

                    {/* Status Dropdown - Using fixed positioning */}
                    {statusDropdownOpen === itinerary.id && (
                      <div
                        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] max-h-[300px] overflow-y-auto overflow-x-hidden z-[9999] flex flex-col"
                        style={{
                          top: `${document.getElementById(`status-btn-${itinerary.id}`)?.getBoundingClientRect().bottom + 4}px`,
                          left: `${document.getElementById(`status-btn-${itinerary.id}`)?.getBoundingClientRect().left}px`,
                          scrollbarWidth: 'thin'
                        }}
                      >
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <button
                            key={status}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(itinerary.id, status as ItineraryStatus);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors block ${
                              itinerary.status === status ? 'bg-purple-50 font-semibold' : ''
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(itinerary.startDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formatDate(itinerary.endDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{itinerary.numberOfParticipants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{itinerary.type}</span>
                  </div>

                  {itinerary.specialRequests && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-1">Special Requests:</p>
                      <p className="text-sm text-gray-800 line-clamp-2">{itinerary.specialRequests}</p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-50 border-t flex gap-2">
                  {itinerary.status === ItineraryStatus.DRAFT && (
                    <>
                      <button
                        onClick={() => navigate(`/itinerary`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        title="Edit"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleSubmitForQuote(itinerary.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        title="Submit for Quote"
                      >
                        <FaPaperPlane size={14} /> Submit
                      </button>
                      <button
                        onClick={() => handleDelete(itinerary.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </>
                  )}

                  {itinerary.status === ItineraryStatus.PENDING_QUOTE && (
                    <div className="flex-1 text-center text-sm text-gray-600 py-2">
                      Waiting for admin quote...
                    </div>
                  )}

                  {itinerary.status === ItineraryStatus.QUOTED && (
                    <>
                      <button
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        title="Accept Quote"
                      >
                        <FaCheck size={14} /> Accept
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        title="Reject Quote"
                      >
                        <FaTimes size={14} /> Reject
                      </button>
                    </>
                  )}

                  {![ItineraryStatus.DRAFT, ItineraryStatus.PENDING_QUOTE, ItineraryStatus.QUOTED].includes(itinerary.status) && (
                    <button
                      onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#B749DB] text-white rounded-lg hover:bg-[#8B2BB9] text-sm"
                    >
                      <FaEye size={14} /> View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
