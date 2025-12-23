import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItineraryStore } from "../../store/useItineraryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ItineraryStatus } from "../../types/itinerary.types";
import Sidebar from "../../components/AdminSidebar";
import TopBar from "../../components/Topbar";
import { FaPlus, FaEye, FaEdit, FaTrash, FaPaperPlane, FaCheck, FaTimes } from "react-icons/fa";
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
  const { itineraries, getMyItineraries, deleteItinerary, submitForQuote, acceptQuote, rejectQuote, isLoading } = useItineraryStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [dialogItineraryId, setDialogItineraryId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    console.log("🔍 Fetching itineraries...");
    getMyItineraries().then(() => {
      console.log("✅ Itineraries fetched");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, navigate]);



  const handleDelete = async (id: string) => {
    setDialogItineraryId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (dialogItineraryId) {
      await deleteItinerary(dialogItineraryId);
      setDeleteDialogOpen(false);
      setDialogItineraryId(null);
    }
  };

  const handleSubmitForQuote = async (id: string) => {
    setDialogItineraryId(id);
    setSubmitDialogOpen(true);
  };

  const confirmSubmit = async () => {
    if (dialogItineraryId) {
      const success = await submitForQuote(dialogItineraryId);
      if (success) {
        getMyItineraries(); // Refresh list
      }
      setSubmitDialogOpen(false);
      setDialogItineraryId(null);
    }
  };



  const handleAcceptQuote = async (id: string) => {
    setDialogItineraryId(id);
    setAcceptDialogOpen(true);
  };

  const confirmAccept = async () => {
    if (dialogItineraryId) {
      setActionLoading(dialogItineraryId);
      try {
        const success = await acceptQuote(dialogItineraryId);
        if (success) {
          await getMyItineraries(); // Refresh list
        }
      } finally {
        setActionLoading(null);
        setAcceptDialogOpen(false);
        setDialogItineraryId(null);
      }
    }
  };

  const handleRejectQuote = (id: string) => {
    setSelectedItineraryId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const confirmRejectQuote = async () => {
    if (!selectedItineraryId) return;

    setActionLoading(selectedItineraryId);
    try {
      const success = await rejectQuote(selectedItineraryId, rejectReason);
      if (success) {
        setRejectModalOpen(false);
        setSelectedItineraryId(null);
        setRejectReason("");
        await getMyItineraries(); // Refresh list
      }
    } finally {
      setActionLoading(null);
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
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Section */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Top Bar */}
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          {/* Header */}
          <div className="flex justify-between items-center mb-8 mt-6">
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
                        {/* Static status badge - display only, no dropdown */}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[itinerary.status]}`}
                        >
                          {statusLabels[itinerary.status]}
                        </div>
                      </div>

                      {/* Removed status dropdown - customers cannot change status */}
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
                          onClick={() => navigate(`/edit-my-itinerary/${itinerary.id}`)}
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
                          onClick={() => navigate(`/itinerary-summary?id=${itinerary.id}`)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={actionLoading === itinerary.id}
                          title="View Quote Details"
                        >
                          <FaEye size={14} /> View
                        </button>
                        <button
                          onClick={() => handleAcceptQuote(itinerary.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={actionLoading === itinerary.id}
                          title="Accept Quote"
                        >
                          {actionLoading === itinerary.id ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaCheck size={14} /> Accept
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectQuote(itinerary.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={actionLoading === itinerary.id}
                          title="Reject Quote"
                        >
                          <FaTimes size={14} /> Reject
                        </button>
                      </>
                    )}

                    {![ItineraryStatus.DRAFT, ItineraryStatus.PENDING_QUOTE, ItineraryStatus.QUOTED].includes(itinerary.status) && (
                      <button
                        onClick={() => navigate(`/itinerary-summary?id=${itinerary.id}`)}
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

        {/* Reject Quote Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reject Quote</h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to reject this quote? Please provide a reason (optional).
                </p>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection (optional)"
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setRejectModalOpen(false);
                      setSelectedItineraryId(null);
                      setRejectReason("");
                    }}
                    disabled={actionLoading !== null}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRejectQuote}
                    disabled={actionLoading !== null}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Rejecting...
                      </>
                    ) : (
                      "Reject Quote"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setDeleteDialogOpen(false)}
            ></div>

            {/* Dialog */}
            <div className="relative z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <FaTrash className="text-red-600 text-2xl" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Itinerary?</h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this itinerary? This action cannot be undone.
                </p>

                {/* Actions */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit for Quote Dialog */}
        {submitDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setSubmitDialogOpen(false)}
            ></div>

            {/* Dialog */}
            <div className="relative z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <FaPaperPlane className="text-purple-600 text-2xl" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit for Quote?</h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  Submit this itinerary to receive an official quote. Our team will review and provide pricing details.
                </p>

                {/* Actions */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setSubmitDialogOpen(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSubmit}
                    className="flex-1 px-4 py-3 bg-[#B749DB] text-white rounded-lg font-semibold hover:bg-[#8B2BB9] transition-colors shadow-lg"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accept Quote Dialog */}
        {acceptDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setAcceptDialogOpen(false)}
            ></div>

            {/* Dialog */}
            <div className="relative z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <FaCheck className="text-green-600 text-2xl" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Accept Quote?</h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  By accepting this quote, you agree to the proposed pricing and terms. Your booking will be confirmed.
                </p>

                {/* Actions */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setAcceptDialogOpen(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAccept}
                    disabled={actionLoading !== null}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Accepting..." : "Accept Quote"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />

      </main>
    </div>
  );
}
