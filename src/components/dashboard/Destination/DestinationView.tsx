import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci"; // Import the Edit icon
import { MdDeleteOutline } from "react-icons/md"; // Import the Delete icon
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useNavigate and useSearchParams
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import Pagination from "../../ui/Pagination";
import deleteicon from "../../../assets/delete.png"; // Import delete icon image
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuListFilter } from "react-icons/lu";
import { CiSearch } from "react-icons/ci"; // Import search icon
import { IoMdAdd } from "react-icons/io"; // Import add icon
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Hotel from "./HotelView";
import Excursion from "./ExcursionView";
import destinationService from "../../../services/destination.service";
import hotelService from "../../../services/hotel.service";
import excursionService from "../../../services/excursion.service";
import { useTranslation } from "react-i18next";
import { Loader } from "../../ui/Loader";

const DestinationHotelManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Initialize the navigation function
    const [searchParams] = useSearchParams();

    const [destinations, setDestination] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [hotels, setHotels] = useState<any[]>([]);

    const [excursions, setExcursions] = useState<any[]>([]);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");

    // Get initial tab from URL query parameter, default to "destination"
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "destination");

    // Filter destinations based on search query and filters
    const filteredDestinations = destinations.filter((destination) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            (destination.id || '').toLowerCase().includes(searchLower) ||
            (destination.name || '').toLowerCase().includes(searchLower) ||
            (destination.description || '').toLowerCase().includes(searchLower) ||
            (destination.category || '').toLowerCase().includes(searchLower)
        );

        const matchesDestination = destinationFilter === "" || destination.name === destinationFilter;

        return matchesSearch && matchesDestination;
    });

    const indexOfLastDesination = page * itemsPerPage;
    const indexOfFirstDesination = indexOfLastDesination - itemsPerPage;
    let currentDestinations = filteredDestinations.slice(indexOfFirstDesination, indexOfLastDesination);

    // If current page has no items but there are items available, reset to page 1
    if (currentDestinations.length === 0 && filteredDestinations.length > 0 && page > 1) {
        const firstPageStart = 0;
        const firstPageEnd = itemsPerPage;
        currentDestinations = filteredDestinations.slice(firstPageStart, firstPageEnd);
    }

    // Fetch all data on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [destinationsData, hotelsData, excursionsData] = await Promise.all([
                    destinationService.getAll(),
                    hotelService.getAll(),
                    excursionService.getAllAdmin() // Use getAllAdmin to see all excursions including inactive ones
                ]);
                console.log(destinationsData, hotelsData, excursionsData);

                setDestination(destinationsData);
                setHotels(hotelsData);
                setExcursions(excursionsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error(t('management.destination.messages.fetchFailed'), {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Reset to page 1 when search query, filters, or items per page change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, locationFilter, itemsPerPage]);

    // Navigate to EditCustomer page
    // const handleEditClick = (destinationId: string) => {
    //     navigate(`/destination/edit/${destinationId}`); // Navigate to the EditCustomer page with the customerId
    // };

    // Edit handlers for Destination, Hotel, Excursion
    const handleEditDestinationClick = (id: string) => navigate(`/destination/edit/${id}`);
    const handleEditHotelClick = (id: string) => navigate(`/hotel/edit/${id}`);
    const handleEditExcursionClick = (id: string) => navigate(`/excursion/edit/${id}`);

    // Handle delete action
    const handleDeleteClick = (destinationId: string) => {
        setSelectedDestinationId(destinationId); // Store the selected customer ID
        setDeleteConfirmationVisible(true); // Show confirmation overlay
    };

    const confirmDelete = async () => {
        if (!selectedDestinationId) return;

        try {
            setErrorMessage(null);
            await destinationService.delete(selectedDestinationId);
            setDestination(destinations.filter((destination) => destination.id !== selectedDestinationId));
            setDeleteConfirmationVisible(false);

            toast.success(t('management.destination.messages.deleteSuccess'), {
                position: "top-right",
                autoClose: 2000,
            });
        } catch (error: any) {
            console.error("Failed to delete destination:", error);
            const message = error.response?.data?.message || t('management.destination.messages.deleteFailed');
            setErrorMessage(message);
            toast.error(message);
        }
    };

    // Cancel delete action
    const cancelDelete = () => {
        setDeleteConfirmationVisible(false); // Hide the overlay
        setErrorMessage(null);
    };

    // Handle Add Buttons -------------------
    const handleAddDestinationClick = () => navigate("/destination/add");
    const handleAddHotelClick = () => navigate("/hotel/add");
    const handleAddExcursionClick = () => navigate("/excursion/add");



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

                    {/* TITLE - Desktop with Add button */}
                    <div className="mb-4 mt-4 hidden md:flex md:justify-between md:items-center">
                        <h2 className="font-poppins font-bold text-black text-[20px] sm:text-[24px] md:text-[32px] lg:text-[40px] xl:text-[48px]">
                            {t('management.destination.title')}
                        </h2>
                        <button
                            className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
                            onClick={() => {
                                if (activeTab === "destination") handleAddDestinationClick();
                                else if (activeTab === "hotel") handleAddHotelClick();
                                else if (activeTab === "excursion") handleAddExcursionClick();
                            }}>
                            {t('management.customer.buttons.add')}  <IoMdAdd className="text-[18px]" />
                        </button>
                    </div>

                    {/* TITLE - Mobile */}
                    <div className="mb-4 mt-4 md:hidden">
                        <h2 className="font-poppins font-bold text-black text-[20px] sm:text-[24px]">
                            {t('management.destination.title')}
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

                    {/* Tabs Component */}
                    {loading ? (
                        <Loader src="/loaders/travelloading.lottie" message={t('common.loading')} size={250} />
                    ) : (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                            <div className="flex justify-center">
                                <TabsList>
                                    <TabsTrigger value="destination">{t('management.destination.tabs.destination')}</TabsTrigger>
                                    <TabsTrigger value="hotel">{t('management.destination.tabs.hotel')}</TabsTrigger>
                                    <TabsTrigger value="excursion">{t('management.destination.tabs.excursion')}</TabsTrigger>
                                </TabsList>
                            </div>

                            {/* VIEW & MANAGE SECTION - Desktop */}
                            <TabsContent value="destination">
                                <div className="mb-6 hidden md:block">
                                    <div className="flex justify-between items-center p-2">
                                        {/* LEFT: Title */}
                                        <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px] lg:text-[18px]">
                                            {t('management.destination.subtitle')}
                                        </h4>

                                        {/* RIGHT: Filters */}
                                        <div className="flex items-center gap-3">
                                            <select
                                                className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                            >
                                                <option value="">{t('management.destination.filters.location')}</option>
                                                <option value="Matale">Matale</option>
                                                <option value="Matara">Matara</option>
                                                <option value="Galle">Galle</option>
                                                <option value="Negombo">Negombo</option>
                                                <option value="Nuwara Eliya">Nuwara Eliya</option>
                                                <option value="Trincomalee">Trincomalee</option>
                                            </select>
                                            <select
                                                className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                                value={destinationFilter}
                                                onChange={(e) => setDestinationFilter(e.target.value)}
                                            >
                                                <option value="">{t('management.destination.tabs.destination')}</option>
                                                <option value="Sigiriya Rock Fortress">Sigiriya Rock Fortress</option>
                                                <option value="Mirissa Beach">Mirissa Beach</option>
                                                <option value="Adam's Peak">Adam's Peak</option>
                                                <option value="Horton Plains & World's End">Horton Plains & World's End</option>
                                                <option value="Polonnaruwa Ancient City">Polonnaruwa Ancient City</option>
                                                <option value="Galle Dutch Fort Walk">Galle Dutch Fort Walk</option>
                                            </select>

                                            <button
                                                className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                                                onClick={() => {
                                                    setLocationFilter("");
                                                    setSearchQuery("");
                                                    setDestinationFilter("");
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
                                        <h4 className="font-poppins font-medium text-black text-[16px] sm:text-[16px]">
                                            {t('management.destination.subtitle')}
                                        </h4>

                                        {/* RIGHT: Add button */}
                                        <button
                                            className="w-8 h-8 rounded-full border-2 border-[#B749DB] text-[#B749DB] flex items-center justify-center hover:bg-purple-50 cursor-pointer"
                                            onClick={handleAddDestinationClick}
                                        >
                                            <IoMdAdd className="text-[20px]" />
                                        </button>
                                    </div>

                                    {/* FILTERS - Mobile */}
                                    <div className="flex flex-wrap items-center justify-between w-full gap-y-2">
                                        {/* LEFT SIDE DROPDOWNS */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <select
                                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 w-35 py-2 text-[16px] font-poppins bg-white cursor-pointer"
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                            >
                                                <option value="">{t('management.destination.filters.location')}</option>
                                                <option value="Colombo">Colombo</option>
                                                <option value="Kandy">Kandy</option>
                                                <option value="Galle">Galle</option>
                                                <option value="Negombo">Negombo</option>
                                                <option value="Nuwara Eliya">Nuwara Eliya</option>
                                                <option value="Trincomalee">Trincomalee</option>
                                            </select>
                                            <select
                                                className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 w-35 py-2 text-[16px] font-poppins bg-white cursor-pointer"
                                                value={destinationFilter}
                                                onChange={(e) => setDestinationFilter(e.target.value)}
                                            >
                                                <option value="">{t('management.destination.tabs.destination')}</option>
                                                <option value="Sigiriya Rock Fortress">Sigiriya Rock Fortress</option>
                                                <option value="Mirissa Beach">Mirissa Beach</option>
                                                <option value="Adam's Peak">Adam's Peak</option>
                                                <option value="Horton Plains & World's End">Horton Plains & World's End</option>
                                                <option value="Polonnaruwa Ancient City">Polonnaruwa Ancient City</option>
                                                <option value="Galle Dutch Fort Walk">Galle Dutch Fort Walk</option>
                                            </select>
                                        </div>
                                        {/* RIGHT SIDE FILTER ICON */}
                                        <button
                                            className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
                                            onClick={() => {
                                                setLocationFilter("");
                                                setSearchQuery("");
                                                setDestinationFilter("")
                                            }}
                                            title={t('management.itinerary.filters.clearFilters')}
                                        >
                                            <LuListFilter className="text-[18px]" />
                                        </button>
                                    </div>
                                </div>

                                {/* TABLE - Both Desktop and Mobile (Horizontally Scrollable) */}
                                <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr className="bg-gray-50 text-[#382A59] font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-center font-poppins">
                                                {/* <th className="px-3 py-4 whitespace-nowrap">ID</th> */}
                                                <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.destinationName')}</th>
                                                <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.image')}</th>
                                                <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.location')}</th>
                                                <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.category')}</th>
                                                <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.bestTime')}</th>
                                                <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.review')}</th>
                                                <th className="px-3 py-3 whitespace-nowrap"></th>
                                            </tr>
                                        </thead>

                                        <tbody className="font-poppins">
                                            {currentDestinations.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="py-10 text-center text-gray-500 font-poppins">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <CiSearch className="text-4xl mb-2 text-gray-300" />
                                                            <p>{t('dashboard.common.noData')}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentDestinations.map((d) => (
                                                    <tr key={d.id} className="border-b border-gray-100 text-center text-gray-600 text-[13px] sm:text-[14px] md:text-[15px] hover:bg-gray-50">
                                                        {/* <td className="py-1 px-3">{d.id}</td> */}
                                                        <td className="py-1 px-3">{d.name}</td>
                                                        <td className="px-5 py-1 text-center">
                                                            {d.images && d.images.length > 0 ? (
                                                                <img
                                                                    src={(() => {
                                                                        const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : 'http://localhost:3000/api/v1');
                                                                        const BASE_URL = API_URL.replace('/api/v1', '');
                                                                        return d.images[0].startsWith('/') ? `${BASE_URL}${d.images[0]}` : d.images[0];
                                                                    })()}
                                                                    alt={d.name}
                                                                    className="w-16 h-16 object-cover rounded-md mx-auto"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mx-auto text-gray-400 text-xs text-center px-1">
                                                                    {t('management.destination.table.noImage')}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-1 text-center">{d.location}</td>
                                                        <td className="px-3 py-1 text-center">{d.category}</td>
                                                        <td className="px-3 py-1 text-center">{d.bestTimeToVisit || t('common.noData')}</td>
                                                        <td className="px-5 py-1 whitespace-nowrap">
                                                            <div className="flex gap-2 justify-center">
                                                                <CiEdit
                                                                    className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                                                                    onClick={() => handleEditDestinationClick(d.id)}
                                                                />
                                                                <MdDeleteOutline
                                                                    className="text-[#B749DB] cursor-pointer text-[20px] hover:text-purple-700"
                                                                    onClick={() => handleDeleteClick(d.id)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* PAGINATION */}
                                <div className="mt-4">
                                    <Pagination
                                        currentPage={page}
                                        totalItems={filteredDestinations.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setPage}
                                        onItemsPerPageChange={setItemsPerPage}
                                    />
                                </div>
                            </TabsContent>
                            {/* Hotel Tab Panel */}
                            <TabsContent value="hotel">
                                <Hotel hotels={hotels} page={page} itemsPerPage={itemsPerPage} setPage={setPage} setItemsPerPage={setItemsPerPage} setHotels={setHotels} onAdd={handleAddHotelClick} onEdit={handleEditHotelClick} />
                            </TabsContent>
                            {/* Excursion Tab Panel */}
                            <TabsContent value="excursion">
                                <Excursion excursions={excursions} page={page} itemsPerPage={itemsPerPage} setPage={setPage} setItemsPerPage={setItemsPerPage} setExcursions={setExcursions} onAdd={handleAddExcursionClick} onEdit={handleEditExcursionClick} />
                            </TabsContent>
                        </Tabs>
                    )}

                    {/* Delete Confirmation Overlay */}
                    {deleteConfirmationVisible && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 z-50 p-4">
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-[450px] relative">
                                {/* Close icon at the top-right */}
                                <button
                                    className="absolute top-2 right-2 text-gray-500 text-2xl"
                                    onClick={cancelDelete}
                                >
                                    &times;
                                </button>

                                {/* Image above confirmation message */}
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src={deleteicon}
                                        alt="Delete Confirmation"
                                        className="w-full max-w-[300px] h-auto object-contain"
                                    />
                                </div>

                                <h3 className="text-[16px] md:text-[18px] lg:text-[20px] text-center font-semibold font-inter mb-4">
                                    {t('management.destination.modals.deleteConfirm')}
                                </h3>

                                {errorMessage && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-poppins text-center">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 md:gap-4 mt-4 md:mt-6 justify-center">
                                    <button
                                        className="bg-[#E5E5E5] font-medium font-inter text-black px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#D5D5D5] text-[14px] md:text-[16px]"
                                        onClick={cancelDelete}
                                    >
                                        {t('management.customer.modals.cancel')}
                                    </button>

                                    <button
                                        className="bg-[#B749DB] font-medium font-inter text-white px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#9f37c9] text-[14px] md:text-[16px]"
                                        onClick={confirmDelete}
                                    >
                                        {t('management.customer.modals.confirm')}
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default DestinationHotelManagement;