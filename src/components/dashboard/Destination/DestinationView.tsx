import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci"; // Import the Edit icon
import { MdDeleteOutline } from "react-icons/md"; // Import the Delete icon
import { useNavigate } from "react-router-dom"; // Import useNavigate
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

const DestinationHotelManagement = () => {
    const navigate = useNavigate(); // Initialize the navigation function

    const [destinations, setDestination] = useState([
        {
            id: "D001",
            name: "Sigiriya Rock Fortress",
            location: "Matale",
            category: "Historical / Cultural",
            image: "https://example.com/images/sigiriya.jpg",
            reviews: "One of Sri Lanka’s most iconic landmarks. Stunning views after the climb!"

        },
        {
            id: "D002",
            name: "Mirissa Beach",
            location: "Matara",
            category: "Beach / Nature",
            image: "https://example.com/images/mirissa.jpg",
            reviews: "High chance of spotting whales! A top experience in southern Sri Lanka."

        },
        {
            id: "D003",
            name: "Adam's Peak",
            location: "Central Province",
            category: "Hiking / Spiritual",
            image: "https://example.com/images/adams_peak.jpg",
            reviews: "A sacred mountain with breathtaking sunrise views. A challenging but rewarding hike."

        },
        {
            id: "D004",
            name: "Polonnaruwa Ancient City",
            location: "North Central Province",
            category: "Historical / Heritage",
            image: "https://example.com/images/polonnaruwa.jpg",
            reviews: "Well-preserved ruins of an ancient kingdom. Great for history lovers and photography."

        },
        {
            id: "D005",
            name: "Horton Plains & World's End",
            location: "Nuwara Eliya",
            category: "Nature / Hiking",
            image: "https://example.com/images/horton_plains.jpg",
            reviews: "Amazing plateau with panoramic views. Don’t miss the dramatic drop at World's End."
        },
        {
            id: "DI006",
            name: "Galle Dutch Fort Walk",
            image: "https://example.com/images/galle_fort.jpg",
            location: "Galle",
            category: "Heritage / City Tour",
            reviews: "Beautiful colonial fort with relaxing seaside views. Great for photography."
        },
    ]);

    const [hotels, setHotels] = useState([
        {
            id: "HI001",
            name: "Cinnamon Life Colombo",
            hotelType: "Luxury",
            images: "https://example.com/images/hotel_a.jpg",
            starRating: 5,
            contactNo: "011 5678530",
            location: "Colombo",
            reviews: "Excellent"
        },
        {
            id: "HI002",
            name: "Galle Face Hotel",
            hotelType: "Heritage",
            images: "https://example.com/images/hotel_b.jpg",
            starRating: 4,
            contactNo: "011 5678531",
            location: "Colombo",
            reviews: "Good"
        },
        {
            id: "HI003",
            name: "Shangri-La Colombo",
            hotelType: "Luxury",
            images: "https://example.com/images/hotel_c.jpg",
            starRating: 5,
            contactNo: "011 5678532",
            location: "Colombo",
            reviews: "Fair"
        },
        {
            id: "HI004",
            name: "Cinnamon Red Colombo",
            hotelType: "Mid-Range",
            images: "https://example.com/images/hotel_a.jpg",
            starRating: 4,
            contactNo: "011 5678533",
            location: "Colombo",
            reviews: "Excellent"
        },
        {
            id: "HI005",
            name: "The Kingsbury Colombo",
            hotelType: "Luxury",
            images: "https://example.com/images/hotel_b.jpg",
            starRating: 5,
            contactNo: "011 5678534",
            location: "Colombo",
            reviews: "Good"
        },
        {
            id: "HI006",
            name: "Mövenpick Hotel Colombo",
            hotelType: "Luxury",
            images: "https://example.com/images/hotel_c.jpg",
            starRating: 4,
            contactNo: "011 5678535",
            location: "Colombo",
            reviews: "Fair"
        }
    ]);

    const [excursions, setExcursions] = useState([
        {
            id: "E001",
            destinationId: "D001", // links to Sigiriya
            name: "Sigiriya Guided Climb",
            bestTime: "Jan – Apr",
            duration: "4 hrs",
            rating: 4.8,
            location: "Sigiriya, Central Province",
            category: "Adventure & Cultural",
            images: "https://example.com/images/sigiriya.jpg"
        },
        {
            id: "E002",
            destinationId: "D002", // links to Mirissa Beach
            name: "Mirissa Whale Watching Tour",
            bestTime: "Nov – Apr (Morning)",
            duration: "6 hrs",
            rating: 4.7,
            location: "Mirissa, Southern Province",
            category: "Wildlife & Nature",
            images: "https://example.com/images/mirissa.jpg"
        },
        {
            id: "E003",
            destinationId: "D003", // links to Adam's Peak
            name: "Adam's Peak Sunrise Hike",
            bestTime: "Dec – Apr (Night Climb)",
            duration: "8 hrs",
            rating: 4.9,
            location: "Nallathanniya, Sabaragamuwa",
            category: "Adventure & Pilgrimage",
            images: "https://example.com/images/adamspeak.jpg"
        },
        {
            id: "E004",
            destinationId: "D005", // links to Horton Plains
            name: "Horton Plains & World's End Trek",
            bestTime: "Dec – Mar (Morning)",
            duration: "5 hrs",
            rating: 4.9,
            location: "Horton Plains National Park, Nuwara Eliya",
            category: "Nature & Adventure",
            images: "https://example.com/images/hortonplains.jpg"
        },
    ]);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");

    const [activeTab, setActiveTab] = useState("destination");

    // Filter customers based on search query, gender, and status
    const filteredDestinations = destinations.filter((destination) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            destination.id.toLowerCase().includes(searchLower) ||
            destination.name.toLowerCase().includes(searchLower) ||
            destination.location.toLowerCase().includes(searchLower) ||
            destination.category.toLowerCase().includes(searchLower) ||
            destination.image.toLowerCase().includes(searchLower) ||
            destination.reviews.toLowerCase().includes(searchLower)
        );

        const matchesLocation = locationFilter === "" || destination.location === locationFilter;
        const matchesDestination = destinationFilter === "" || destination.name === destinationFilter;

        return matchesSearch && matchesDestination && matchesLocation;
    });

    const indexOfLastDesination = page * itemsPerPage;
    const indexOfFirstDesination = indexOfLastDesination - itemsPerPage;
    const currentDestinations = filteredDestinations.slice(indexOfFirstDesination, indexOfLastDesination);

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
    }, [searchQuery, locationFilter]);

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

    // Confirm the delete action
    const confirmDelete = () => {
        setDestination(destinations.filter((destination) => destination.id !== selectedDestinationId));
        setDeleteConfirmationVisible(false);

        toast.success("Destination deleted successfully!", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    // Cancel delete action
    const cancelDelete = () => {
        setDeleteConfirmationVisible(false); // Hide the overlay
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
                        <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
                            Destination & Hotel Management
                        </h2>
                        <button
                            className="bg-[#B749DB] text-white rounded-lg px-4 py-2 text-[14px] font-poppins flex items-center gap-2 hover:bg-[#9f37c9] cursor-pointer"
                            onClick={() => {
                                if (activeTab === "destination") handleAddDestinationClick();
                                else if (activeTab === "hotel") handleAddHotelClick();
                                else if (activeTab === "excursion") handleAddExcursionClick();
                            }}>
                            Add  <IoMdAdd className="text-[18px]" />
                        </button>
                    </div>

                    {/* TITLE - Mobile */}
                    <div className="mb-4 mt-4 md:hidden">
                        <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
                            Destination & Hotel Management
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

                    {/* Tabs Component */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <div className="flex justify-center">
                            <TabsList>
                                <TabsTrigger value="destination">Destination</TabsTrigger>
                                <TabsTrigger value="hotel">Hotel</TabsTrigger>
                                <TabsTrigger value="excursion">Excursion</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* VIEW & MANAGE SECTION - Desktop */}
                        <TabsContent value="destination">
                            <div className="mb-6 hidden md:block">
                                <div className="flex justify-between items-center p-2">
                                    {/* LEFT: Title */}
                                    <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px] lg:text-[18px]">
                                        View & manage Destination Details
                                    </h4>

                                    {/* RIGHT: Filters */}
                                    <div className="flex items-center gap-3">
                                        <select
                                            className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                        >
                                            <option value="">Location</option>
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
                                            <option value="">Destination</option>
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
                                    <h4 className="font-poppins font-medium text-black text-[16px] sm:text-[16px]">
                                        View & manage Destination Details
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
                                <div className="flex items-center justify-between w-full">
                                    {/* LEFT SIDE DROPDOWNS */}
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 w-35 py-2 text-[16px] font-poppins bg-white cursor-pointer"
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                        >
                                            <option value="">Location</option>
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
                                            <option value="">Destination</option>
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
                                        title="Clear all filters"
                                    >
                                        <LuListFilter className="text-[18px]" />
                                    </button>
                                </div>
                            </div>

                            {/* TABLE - Both Desktop and Mobile (Horizontally Scrollable) */}
                            <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{ scrollbarWidth: "thin" }}>
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-50 text-[#382A59] font-semibold text-[16px] sm:text-[16px] md:text-[16px] text-center font-poppins">
                                            <th className="px-3 py-4 whitespace-nowrap">ID</th>
                                            <th className="px-3 py-3 whitespace-nowrap">Destination Name</th>
                                            <th className="px-3 py-3 whitespace-nowrap">Image</th>
                                            <th className="px-3 py-3 whitespace-nowrap">Location</th>
                                            <th className="px-3 py-3 whitespace-nowrap">Category</th>
                                            <th className="px-3 py-3 whitespace-nowrap">Review</th>
                                            <th className="px-3 py-3 whitespace-nowrap"></th>
                                        </tr>
                                    </thead>

                                    <tbody className="font-poppins">
                                        {currentDestinations.map((d) => (
                                            <tr key={d.id} className="border-b border-gray-100 text-center text-gray-600 text-[15px] sm:text-[16px] md:text-[16px] hover:bg-gray-50">
                                                <td className="py-1 px-3">{d.id}</td>
                                                <td className="py-1 px-3">{d.name}</td>
                                                <td className="px-5 py-1 text-center">
                                                    <img src={d.image} alt={d.name} className="w-16 h-16 object-cover rounded-md" />
                                                </td>
                                                <td className="px-3 py-1 text-center">{d.location}</td>
                                                <td className="px-3 py-1 text-center">{d.category}</td>
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
                                        ))}
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
                            <Hotel hotels={hotels} page={page} itemsPerPage={itemsPerPage} setPage={setPage} setHotel={setHotels} onAdd={handleAddHotelClick} onEdit={handleEditHotelClick} />
                        </TabsContent>
                        {/* Excursion Tab Panel */}
                        <TabsContent value="excursion">
                            <Excursion excursions={excursions} page={page} itemsPerPage={itemsPerPage} setPage={setPage} setExcursions={setExcursions} onAdd={handleAddExcursionClick} onEdit={handleEditExcursionClick} />
                        </TabsContent>
                    </Tabs>

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
                                    Are you sure you want to delete this?
                                </h3>

                                {/* Buttons */}
                                <div className="flex gap-3 md:gap-4 mt-4 md:mt-6 justify-center">
                                    <button
                                        className="bg-[#E5E5E5] font-medium font-inter text-black px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#D5D5D5] text-[14px] md:text-[16px]"
                                        onClick={cancelDelete}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="bg-[#B749DB] font-medium font-inter text-white px-4 md:px-6 py-2 rounded-lg flex-1 md:flex-none md:w-[120px] hover:bg-[#9f37c9] text-[14px] md:text-[16px]"
                                        onClick={confirmDelete}
                                    >
                                        Delete
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