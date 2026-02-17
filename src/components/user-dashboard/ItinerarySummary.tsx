import { useEffect, useState } from "react";
import Sidebar from "../AdminSidebar";
import TopBar from "../Topbar"; // Import TopBar
import DeleteConfirmModal from "../ui/DeleteConfirmModal";
import { Loader } from "../ui/Loader";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; // Import useNavigate, useParams, and useSearchParams
import hotelImg from "../../assets/hotels/cityof dream.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { itineraryService } from "../../services/itinerary.service";
import type { Itinerary } from "../../types/itinerary.types";
import { ItineraryStatus } from "../../types/itinerary.types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../../store/useAuthStore";
import { UserRole } from "../../types/auth.types";
import { MemorySelectionGrid } from "../dashboard/Itinerary/MemorySelectionGrid";
import { TripTimeline } from "./TripTimeline";
import memoriesService from "../../services/memories.service";
import type { ItineraryMemoryBook } from "../../services/memories.service";
import { MemorySlideshow } from "../dashboard/Itinerary/MemorySlideshow";
import { FiDownload, FiPlay } from "react-icons/fi";

const ItinerarySummary = () => {
  const { itineraryId: paramId } = useParams<{ itineraryId: string }>(); // Get itinerary ID from URL params
  const [searchParams] = useSearchParams(); // Get query parameters
  const queryId = searchParams.get('id'); // Get id from query string
  const itineraryId = paramId || queryId; // Use either URL param or query param
  const navigate = useNavigate(); // Initialize navigate function
  const user = useAuthStore((state) => state.user); // Get current user

  const [step, setStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedDestinations, setExpandedDestinations] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    specialRequests: "",
    notes: "",
    numberOfParticipants: 0,
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [locationProgress, setLocationProgress] = useState<any[]>([]);
  const [memoryBook, setMemoryBook] = useState<ItineraryMemoryBook | null>(null);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [showMemorySlideshow, setShowMemorySlideshow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch itinerary data
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itineraryId) {
        toast.error("No itinerary ID provided");
        navigate("/my-itineraries");
        return;
      }

      setLoading(true);
      try {
        const data = await itineraryService.getById(itineraryId);
        setItinerary(data);

        // Fetch progress if itinerary is active
        if (['in_progress', 'completed', 'accepted'].includes(data.status)) {
          try {
            const progress = await itineraryService.getProgress(data.id);
            setLocationProgress(progress);
          } catch (err) {
            console.error("Failed to load progress", err);
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch itinerary");
        navigate("/my-itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId, navigate]);

  // Fetch Memory Book
  useEffect(() => {
    const fetchMemoryBook = async () => {
      if (!itineraryId) return;
      setMemoryLoading(true);
      setMemoryError(null);
      try {
        console.log("Fetching memory book for:", itineraryId);
        const book = await memoriesService.getMemoryBook(itineraryId);
        console.log("Memory book fetched:", book);
        setMemoryBook(book);
      } catch (error: any) {
        console.error("Failed to load memory book:", error);
        setMemoryError(error.message || "Failed to load");
        // setMemoryBook(null); // Keep null
      } finally {
        setMemoryLoading(false);
      }
    };
    fetchMemoryBook();
  }, [itineraryId]);

  // Debug Logging
  useEffect(() => {
    console.log("Memory Debug State Updated:", { memoryLoading, hasBook: !!memoryBook, bookId: memoryBook?.id, error: memoryError });
  }, [memoryLoading, memoryBook, memoryError]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleNextClick = () => {
    if (step === 1) {
      setStep(2);
      setShowDetails(true);
      const element = document.getElementById("destination-section");
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: "smooth"
        });
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowDetails(step - 1 >= 2);
    }
  };

  const goToMemoryBook = () => {
    setStep(3);
    setShowDetails(true);
  };

  const toggleDestination = (destination: string) => {
    setExpandedDestinations((prevState) =>
      prevState.includes(destination)
        ? prevState.filter((item) => item !== destination)
        : [...prevState, destination]
    );
  };

  const handleEditClick = () => {
    if (!itinerary) return;

    // Initialize edit data with current values
    setEditData({
      specialRequests: itinerary.specialRequests || "",
      notes: itinerary.notes || "",
      numberOfParticipants: itinerary.numberOfParticipants || 0,
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditData({
      specialRequests: "",
      notes: "",
      numberOfParticipants: 0,
    });
  };

  const handleSaveEdit = async () => {
    if (!itinerary) return;

    setSaving(true);
    try {
      const updated = await itineraryService.update(itinerary.id, editData);
      setItinerary(updated);
      setIsEditMode(false);
      toast.success("Itinerary updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update itinerary");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itinerary) return;

    setIsDeleting(true);
    try {
      await itineraryService.delete(itinerary.id);
      toast.success("Itinerary deleted successfully!");
      setShowDeleteModal(false);
      setTimeout(() => navigate("/my-itineraries"), 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete itinerary");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content Area */}
      <div className={`flex-1 p-4 transition-all duration-300 ${collapsed ? "ml-2" : "ml-6"}`}>
        {/* TopBar */}
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

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
        {/* Main Content */}
        <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-4 min-h-[80vh]">
          {/* Loading State */}
          {loading && (
            <Loader message="Loading itinerary details..." size={250} />
          )}

          {/* Content */}
          {!loading && itinerary && (
            <motion.div className="space-y-6">
              {/* Main Heading for the Itinerary Summary */}
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-roboto-condensed font-semibold text-[#5B247A] mb-6">
                  Itinerary Summary - {itinerary.itineraryNumber}
                </h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${step === 1 ? 'bg-purple-600 text-white shadow-md' : 'text-purple-600 hover:bg-purple-50'}`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => { setStep(2); setShowDetails(true); }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${step === 2 ? 'bg-purple-600 text-white shadow-md' : 'text-purple-600 hover:bg-purple-50'}`}
                  >
                    Planner
                  </button>
                  {(user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) && (
                    <button
                      onClick={goToMemoryBook}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${step === 3 ? 'bg-purple-600 text-white shadow-md' : 'text-purple-600 hover:bg-purple-50'}`}
                    >
                      Memory Book
                    </button>
                  )}
                  {/* Action Buttons */}
                  <div className="h-8 w-px bg-gray-200 mx-2" />
                  <button
                    onClick={() => navigate(`/itinerary/${itineraryId}/edit`)}
                    className="text-[#B749DB] hover:text-[#9f37c9] font-poppins flex items-center gap-2"
                    title="Edit Itinerary"
                  >
                    <MdOutlineModeEdit /> Edit
                  </button>
                  {(itinerary.status === ItineraryStatus.DRAFT || itinerary.status === ItineraryStatus.REJECTED) && (
                    <button
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-700 font-poppins flex items-center gap-2"
                      title="Delete Itinerary"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Route based on user role
                      if (user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) {
                        navigate("/itineraries");
                      } else {
                        navigate("/my-itineraries");
                      }
                    }}
                    className="text-[#B749DB] hover:text-[#9f37c9] font-poppins flex items-center gap-2"
                  >
                    <FaArrowLeft /> Back to List
                  </button>
                </div>
              </div>

              {/* Step 1 – Personal Details */}
              {step === 1 && (
                <>
                  <div className="mt-6 lg:ml-5 lg:mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-[25px] font-poppins">
                    <h2 className="text-[20px] font-semibold mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-[16px]">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Name:</span>{" "}
                        <span className="text-gray-900">
                          {itinerary.lead?.user?.firstName} {itinerary.lead?.user?.lastName}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Email:</span>{" "}
                        <span className="text-gray-900">{itinerary.lead?.user?.email || "N/A"}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Phone:</span>{" "}
                        <span className="text-gray-900">{itinerary.lead?.user?.phone || "N/A"}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Country:</span>{" "}
                        <span className="text-gray-900">{itinerary.lead?.country || "N/A"}</span>
                      </div>
                      {itinerary.lead?.dateOfBirth && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Date of Birth:</span>{" "}
                          <span className="text-gray-900">{formatDate(itinerary.lead.dateOfBirth)}</span>
                        </div>
                      )}
                      {itinerary.lead?.gender && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Gender:</span>{" "}
                          <span className="text-gray-900">{itinerary.lead.gender.charAt(0).toUpperCase() + itinerary.lead.gender.slice(1)}</span>
                        </div>
                      )}
                      {itinerary.lead?.user?.status && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Status:</span>{" "}
                          <span className="text-gray-900">{itinerary.lead.user.status.charAt(0).toUpperCase() + itinerary.lead.user.status.slice(1)}</span>
                        </div>
                      )}
                      {itinerary.lead?.loyaltyPoints !== undefined && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Loyalty Points:</span>{" "}
                          <span className="text-gray-900">{itinerary.lead.loyaltyPoints}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 lg:ml-5 lg:mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-[25px] font-poppins">
                    <h2 className="text-[20px] font-semibold mb-4">Trip Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-[16px]">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Itinerary Number:</span>{" "}
                        <span className="text-gray-900">{itinerary.itineraryNumber}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Type:</span>{" "}
                        <span className="text-gray-900">{itinerary.type.toUpperCase()}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Status:</span>{" "}
                        <span className="text-gray-900 uppercase">{itinerary.status.replace(/_/g, " ")}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Participants:</span>{" "}
                        <span className="text-gray-900">{itinerary.numberOfParticipants}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Start Date:</span>{" "}
                        <span className="text-gray-900">{formatDate(itinerary.startDate)}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">End Date:</span>{" "}
                        <span className="text-gray-900">{formatDate(itinerary.endDate)}</span>
                      </div>
                      {itinerary.metadata?.duration && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Duration:</span>{" "}
                          <span className="text-gray-900">{itinerary.metadata.duration}</span>
                        </div>
                      )}
                      {itinerary.metadata?.groupComposition && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Group:</span>{" "}
                          <span className="text-gray-900">{itinerary.metadata.groupComposition}</span>
                        </div>
                      )}
                      {itinerary.submittedAt && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Submitted:</span>{" "}
                          <span className="text-gray-900">{formatDate(itinerary.submittedAt)}</span>
                        </div>
                      )}
                      {itinerary.quotedAt && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Quoted:</span>{" "}
                          <span className="text-gray-900">{formatDate(itinerary.quotedAt)}</span>
                        </div>
                      )}
                      {itinerary.acceptedAt && (
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Accepted:</span>{" "}
                          <span className="text-gray-900">{formatDate(itinerary.acceptedAt)}</span>
                        </div>
                      )}
                      {itinerary.rejectedAt && (
                        <div className="mb-2 col-span-2">
                          <span className="font-semibold text-gray-700">Rejected:</span>{" "}
                          <span className="text-gray-900">{formatDate(itinerary.rejectedAt)}</span>
                          {itinerary.rejectionReason && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <span className="font-semibold text-red-700">Reason:</span>{" "}
                              <span className="text-red-900">{itinerary.rejectionReason}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trip Memories Section (Always Visible for debugging/verification) */}
                  <div className="mt-6 lg:ml-5 lg:mr-5">

                    {memoryLoading && <div className="p-4 bg-gray-100 rounded-xl text-center">Loading Memory Book...</div>}
                    {memoryError && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">Error loading memories: {memoryError}</div>}

                    {!memoryLoading && !memoryBook && !memoryError && (
                      <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl text-center">
                        No Memory Book found for this itinerary (ID: {itineraryId}).
                        <br />
                        <small>This section is hidden when no book exists.</small>
                      </div>
                    )}

                    {memoryBook && (
                      <div className="bg-gradient-to-r from-[#d027f2] to-[#e8abf5] text-white p-6 rounded-[25px] font-poppins shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Trip Memories</h2>
                            <p className="text-white/80 max-w-md">
                              Relive your beautiful journey through Sri Lanka with our curated memory collection.
                            </p>
                          </div>
                          <div className="flex flex-wrap justify-center gap-4">
                            <button
                              onClick={() => setShowMemorySlideshow(true)}
                              className="bg-white text-[#d027f2] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
                            >
                              <FiPlay className="text-xl" /> Watch Slideshow
                            </button>
                            {memoryBook.pdfUrl && (
                              <a
                                href={memoryBook.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/30 transition-colors"
                              >
                                <FiDownload className="text-xl" /> Download Book
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Assigned Driver Info */}
                  {(itinerary as any).driver && (itinerary.status === 'accepted' || itinerary.status === 'in_progress' || itinerary.status === 'on_hold') && (
                    <div className="mt-6 lg:ml-5 lg:mr-5 bg-blue-50 border-2 border-blue-400 p-4 rounded-[25px] font-poppins">
                      <h2 className="text-[20px] font-semibold mb-4 text-blue-900 flex items-center gap-2">
                        🚗 Your Assigned Driver
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-[16px]">
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Name:</span>{" "}
                          <span className="text-gray-900">
                            {(itinerary as any).driver.user?.firstName} {(itinerary as any).driver.user?.lastName}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Contact:</span>{" "}
                          <span className="text-gray-900">{(itinerary as any).driver.user?.phone || 'N/A'}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Email:</span>{" "}
                          <span className="text-gray-900">{(itinerary as any).driver.user?.email || 'N/A'}</span>
                        </div>
                        {(itinerary as any).driver.languages && (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700">Languages:</span>{" "}
                            <span className="text-gray-900">
                              {Array.isArray((itinerary as any).driver.languages)
                                ? (itinerary as any).driver.languages.join(', ')
                                : (itinerary as any).driver.languages}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Trip Preferences */}
                  {itinerary.metadata && (
                    <div className="mt-6 lg:ml-5 lg:mr-5 bg-indigo-50 border border-indigo-300 p-4 rounded-[25px] font-poppins">
                      <h2 className="text-[20px] font-semibold mb-4 text-indigo-900">Trip Preferences</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-[16px]">
                        {itinerary.metadata.hotelCategory && (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700">Hotel Category:</span>{" "}
                            <span className="text-gray-900">{itinerary.metadata.hotelCategory} Star</span>
                          </div>
                        )}
                        {itinerary.metadata.roomCategory && itinerary.metadata.roomCategory.length > 0 && (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700">Room Category:</span>{" "}
                            <span className="text-gray-900">{itinerary.metadata.roomCategory.join(", ")}</span>
                          </div>
                        )}
                        {itinerary.metadata.vehicleType && itinerary.metadata.vehicleType.length > 0 && (
                          <div className="mb-2 col-span-2">
                            <span className="font-semibold text-gray-700">Vehicle Type:</span>{" "}
                            <span className="text-gray-900">{itinerary.metadata.vehicleType.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {itinerary.specialRequests && (
                    <div className="mt-6 lg:ml-5 lg:mr-5 bg-yellow-50 border border-yellow-300 p-4 rounded-[25px] font-poppins">
                      <h2 className="text-[20px] font-semibold mb-3 text-yellow-900">Special Requests</h2>
                      <div className="text-[16px] text-gray-800 whitespace-pre-wrap">
                        {itinerary.specialRequests}
                      </div>
                    </div>
                  )}

                  {itinerary.notes && (
                    <div className="mt-6 lg:ml-5 lg:mr-5 bg-blue-50 border border-blue-300 p-4 rounded-[25px] font-poppins">
                      <h2 className="text-[20px] font-semibold mb-3 text-blue-900">Admin Notes</h2>
                      <div className="text-[16px] text-gray-800 whitespace-pre-wrap">
                        {itinerary.notes}
                      </div>
                    </div>
                  )}

                  {/* Pricing Summary */}
                  {itinerary.quote && (
                    <div className="mt-6 lg:ml-5 lg:mr-5 bg-emerald-50 border-2 border-emerald-400 p-6 rounded-[25px] font-poppins">
                      <h2 className="text-[22px] font-bold mb-4 text-emerald-900 flex items-center gap-2">
                        <span>💰</span> Pricing Summary
                      </h2>

                      {/* Cost Breakdown */}
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h3 className="text-[18px] font-semibold mb-3 text-gray-800">Cost Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700">Accommodation</span>
                            <span className="font-medium text-gray-900">${itinerary.quote.breakdown?.accommodationCost?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700">Excursions</span>
                            <span className="font-medium text-gray-900">${itinerary.quote.breakdown?.excursionsCost?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700">Transport</span>
                            <span className="font-medium text-gray-900">${itinerary.quote.breakdown?.transportCost?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700">Guide Services</span>
                            <span className="font-medium text-gray-900">${itinerary.quote.breakdown?.guideCost?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700">Other Costs</span>
                            <span className="font-medium text-gray-900">${itinerary.quote.breakdown?.otherCosts?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700">Taxes</span>
                            <span className="font-medium text-gray-900">${itinerary.quote.breakdown?.taxes?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-200 md:col-span-2">
                            <span className="text-gray-700">Service Charge</span>
                            <span className="font-medium text-gray-900">${itinerary.quote.breakdown?.serviceCharge?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between py-2 mt-3 border-t-2 border-gray-300">
                          <span className="font-semibold text-gray-800">Subtotal</span>
                          <span className="font-semibold text-gray-900 text-[17px]">${itinerary.quote.totalCost?.toFixed(2) || '0.00'}</span>
                        </div>

                        {/* Discount (if applicable) */}
                        {itinerary.quote.discount > 0 && (
                          <div className="flex justify-between py-2 text-green-700 border-t border-gray-200">
                            <span>Discount {itinerary.quote.discountReason && `(${itinerary.quote.discountReason})`}</span>
                            <span className="font-medium">-${itinerary.quote.discount?.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Final Price */}
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-[20px] font-bold">Total Price</span>
                          <span className="text-[28px] font-bold">${itinerary.quote.finalPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        {itinerary.quote.validUntil && (
                          <div className="text-sm mt-2 text-emerald-100">
                            Valid until: {new Date(itinerary.quote.validUntil).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Terms and Conditions */}
                      {itinerary.quote.termsAndConditions && (
                        <div className="mt-4 bg-white p-4 rounded-lg">
                          <h3 className="text-[16px] font-semibold mb-2 text-gray-800">Terms & Conditions</h3>
                          <div className="text-[14px] text-gray-700 whitespace-pre-wrap">
                            {itinerary.quote.termsAndConditions}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Medical & Dietary Information */}
                  {(itinerary.lead?.medicalNotes || itinerary.lead?.dietaryRequirements || itinerary.lead?.allergies || itinerary.lead?.specialConditions) && (
                    <div className="mt-6 lg:ml-5 lg:mr-5 bg-rose-50 border border-rose-300 p-4 rounded-[25px] font-poppins">
                      <h2 className="text-[20px] font-semibold mb-3 text-rose-900">Medical & Dietary Information</h2>
                      <div className="grid grid-cols-1 gap-3 text-[16px]">
                        {itinerary.lead.dietaryRequirements && (
                          <div>
                            <span className="font-semibold text-gray-700">Dietary Requirements:</span>{" "}
                            <span className="text-gray-800">{itinerary.lead.dietaryRequirements}</span>
                          </div>
                        )}
                        {itinerary.lead.allergies && (
                          <div>
                            <span className="font-semibold text-gray-700">Allergies:</span>{" "}
                            <span className="text-gray-800">{itinerary.lead.allergies}</span>
                          </div>
                        )}
                        {itinerary.lead.medicalNotes && (
                          <div>
                            <span className="font-semibold text-gray-700">Medical Notes:</span>{" "}
                            <span className="text-gray-800">{itinerary.lead.medicalNotes}</span>
                          </div>
                        )}
                        {itinerary.lead.specialConditions && (
                          <div>
                            <span className="font-semibold text-gray-700">Special Conditions:</span>{" "}
                            <span className="text-gray-800">{itinerary.lead.specialConditions}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step 3 – Memory Book (Admin/Staff Only) */}
              {step === 3 && (user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) && (
                <div className="mt-6 lg:ml-5 lg:mr-5">
                  <h2 className="text-2xl font-bold text-[#5B247A] mb-6 flex items-center gap-3">
                    📸 Memory Book Curation
                  </h2>
                  <MemorySelectionGrid
                    itineraryId={itinerary.id}
                    itineraryNumber={itinerary.itineraryNumber}
                  />
                </div>
              )}

              {/* Step 2 – Destinations */}
              {step === 2 && showDetails && (
                <section id="destination-section" className="container mx-auto">
                  {/* Trip Timeline */}
                  <div className="mb-8 px-5">
                    <TripTimeline itinerary={itinerary} locationProgress={locationProgress} />
                  </div>

                  <div className="p-5 font-poppins">
                    <h2 className="text-xl font-semibold mb-2">Detailed Itinerary</h2>
                    {itinerary.days && itinerary.days.length > 0 ? (
                      <div className="space-y-4">
                        {itinerary.days
                          .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
                          .map((day) => (
                            <div key={day.id}>
                              <div className="flex items-center justify-between bg-[#B723F2]/5 border border-[#B723F2] rounded-[25px] p-2 mb-2">
                                <button
                                  className="w-full text-left font-semibold ml-4 text-[18px]"
                                  onClick={() => toggleDestination(day.id!)}
                                >
                                  Day {day.dayNumber}: {day.destination?.name || "No destination"} - {formatDate(day.date)}
                                </button>
                                {expandedDestinations.includes(day.id!) ? (
                                  <IoIosArrowDropupCircle className="text-[#B749DB] w-10 h-6" />
                                ) : (
                                  <IoIosArrowDropdownCircle className="text-[#B749DB] w-10 h-6" />
                                )}
                              </div>

                              {expandedDestinations.includes(day.id!) && (
                                <div className="bg-[#F8EDFC] border border-[#D9B7F2] p-4 sm:p-5 rounded-[25px] shadow-sm">
                                  {/* Check if day has any content */}
                                  {!day.hotel && (!day.excursions || day.excursions.length === 0) && !day.description && !day.notes && !day.title ? (
                                    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 text-center">
                                      <p className="text-gray-500 text-sm mb-1">This day is not yet planned</p>
                                      <p className="text-gray-400 text-xs">No accommodation or activities have been added</p>
                                    </div>
                                  ) : (
                                    <>
                                      {/* Day Details */}
                                      {day.title && (
                                        <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#7A1CAC] mb-2">{day.title}</h3>
                                      )}
                                      {day.description && (
                                        <p className="text-gray-700 mb-4 text-sm sm:text-base">{day.description}</p>
                                      )}

                                      {/* Hotel Information */}
                                      <div className="mb-6">
                                        <h4 className="font-semibold mb-3 text-[16px] sm:text-[18px] text-[#7A1CAC]">🏨 Accommodation</h4>
                                        {day.hotel ? (
                                          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 bg-white p-4 rounded-xl">
                                            {day.hotel.images && day.hotel.images.length > 0 ? (
                                              <img
                                                src={day.hotel.images[0]}
                                                className="w-full sm:w-56 lg:w-60 h-40 object-cover rounded-xl"
                                                alt={day.hotel.name}
                                                onError={(e) => {
                                                  e.currentTarget.src = hotelImg;
                                                }}
                                              />
                                            ) : (
                                              <img
                                                src={hotelImg}
                                                className="w-full sm:w-56 lg:w-60 h-40 object-cover rounded-xl"
                                                alt="Hotel"
                                              />
                                            )}

                                            <div className="flex-1 space-y-3">
                                              {/* Hotel Name and Rating */}
                                              <div>
                                                <h4 className="text-[16px] sm:text-[18px] font-semibold text-[#5B247A] mb-1">{day.hotel.name}</h4>
                                                {day.hotel.rating && (
                                                  <div className="flex items-center gap-1 text-sm">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span>{day.hotel.rating} Stars</span>
                                                  </div>
                                                )}
                                              </div>

                                              {/* Hotel Description */}
                                              <p className="text-sm text-gray-600 line-clamp-2">{day.hotel.description}</p>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-gray-500 italic">No accommodation selected for this day.</p>
                                        )}
                                      </div>

                                      {/* Activities/Excursions */}
                                      <div>
                                        <h4 className="font-semibold mb-3 text-[16px] sm:text-[18px] text-[#7A1CAC]">activity Activities</h4>
                                        {day.excursions && day.excursions.length > 0 ? (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {day.excursions.map((excursion) => (
                                              <div key={excursion.id} className="bg-white p-3 rounded-xl border border-purple-100 flex gap-3">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                  {excursion.images && excursion.images.length > 0 ? (
                                                    <img
                                                      src={excursion.images[0]}
                                                      alt={excursion.name}
                                                      className="w-full h-full object-cover"
                                                    />
                                                  ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                      <span className="text-xs">No Img</span>
                                                    </div>
                                                  )}
                                                </div>
                                                <div>
                                                  <h5 className="font-semibold text-gray-800 text-sm">{excursion.name}</h5>
                                                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{excursion.description}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-gray-500 italic">No activities planned for this day.</p>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-10">No itinerary days available</p>
                    )}
                  </div>
                </section>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6 px-5 pb-5">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 border cursor-pointer border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <FaArrowLeft className="text-[#B749DB]" /> Previous
                  </button>
                )}

                {step < 2 ? (
                  <button
                    onClick={handleNextClick}
                    className="flex items-center cursor-pointer gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg ml-auto hover:bg-purple-50 transition-colors"
                  >
                    Next <FaArrowRight className="text-[#B749DB]" />
                  </button>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center cursor-pointer gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg ml-auto hover:bg-purple-50 transition-colors"
                  >
                    <MdOutlineModeEdit className="text-[#B749DB]" /> Edit
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditMode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-[#5B247A] mb-6">Edit Itinerary</h2>

                {/* Number of Participants */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editData.numberOfParticipants}
                    onChange={(e) => setEditData({ ...editData, numberOfParticipants: parseInt(e.target.value) || 0 })}
                    className="w-full border border-[#E5D4EF] rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition outline-none"
                  />
                </div>

                {/* Special Requests */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={editData.specialRequests}
                    onChange={(e) => setEditData({ ...editData, specialRequests: e.target.value })}
                    rows={4}
                    className="w-full border border-[#E5D4EF] rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition outline-none resize-none"
                    placeholder="Enter special requests..."
                  />
                </div>

                {/* Admin Notes */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Admin Notes (Internal)
                  </label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={4}
                    className="w-full border border-[#E5D4EF] rounded-lg px-4 py-2 focus:border-[#B749DB] focus:ring-2 focus:ring-[#B749DB]/30 transition outline-none resize-none"
                    placeholder="Enter internal notes..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="px-6 py-2 bg-[#B749DB] text-white rounded-lg hover:bg-[#9f37c9] disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memory Slideshow Modal */}
        {showMemorySlideshow && memoryBook && (
          <div className="fixed inset-0 z-50 bg-black">
            <MemorySlideshow
              memoryBook={memoryBook}
              onClose={() => setShowMemorySlideshow(false)}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Itinerary"
          description={itinerary ? `Are you sure you want to delete itinerary ${itinerary.itineraryNumber}? This action cannot be undone.` : ""}
          confirmText="Delete"
          cancelText="Cancel"
          isDeleting={isDeleting}
        />

        <ToastContainer />
      </div>
    </div>
  );
};

export default ItinerarySummary;
