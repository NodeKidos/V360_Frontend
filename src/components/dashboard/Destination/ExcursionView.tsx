import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import Pagination from "../../ui/Pagination";
import { LuListFilter } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import deleteicon from "../../../assets/delete.png"; // Import delete icon image
import { ToastContainer,toast } from "react-toastify";

// Function to render stars based on rating
const renderStars = (rating: number) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars.push('⭐');
        } else {
            stars.push('☆');
        }
    }
    return stars.join(" ");
};

const Excursion = ({ excursions, page, itemsPerPage, setPage, setExcursions, onAdd ,onEdit }: any) => {
    const [excursionFilter, setExcursionFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

     const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [selectedExcursionId, setSelectedExcursionId] = useState<string | null>(null);

    // Filter excursions based on search query and selected filter
    const filteredExcursions = excursions.filter((excursion: any) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            excursion.id.toLowerCase().includes(searchLower) ||
            excursion.name.toLowerCase().includes(searchLower) ||
            excursion.location.toLowerCase().includes(searchLower) ||
            excursion.catogory.toLowerCase().includes(searchLower) ||
            excursion.images.toLowerCase().includes(searchLower) ||
            excursion.reviews.toLowerCase().includes(searchLower)
        );

        const matchesExcursionFilter = excursionFilter === "" || excursion.name === excursionFilter;
        const matchesCategoryFilter = categoryFilter === "" || excursion.category === categoryFilter;

        return matchesSearch && matchesExcursionFilter && matchesCategoryFilter;
    });

    const indexOfLastExcursion = page * itemsPerPage;
    const indexOfFirstExcursion = indexOfLastExcursion - itemsPerPage;
    const currentExcursions = filteredExcursions.slice(indexOfFirstExcursion, indexOfLastExcursion);

 // Navigate to EditCustomer page
    // const handleEditClick = (excursionId: string) => {
    //     navigate(`/excursion/edit/${excursionId}`); // Navigate to the EditCustomer page with the customerId
    // };

    // Handle delete action
    const handleDeleteClick = (excursionId: string) => {
        setSelectedExcursionId(excursionId); // Store the selected customer ID
        setDeleteConfirmationVisible(true); // Show confirmation overlay
    };

    // Confirm the delete action
    const confirmDelete = () => {
        setExcursions(excursions.filter(() => excursions.id !== selectedExcursionId));
        setDeleteConfirmationVisible(false);

        toast.success("Excursion deleted successfully!", {
            position: "top-right",
            autoClose: 2000,
        });
    };
    // Cancel delete action
    const cancelDelete = () => {
        setDeleteConfirmationVisible(false); // Hide the overlay
    };

    return (
        <div>
            {/* VIEW & MANAGE SECTION - Desktop */}
            <div className="mb-6 hidden md:block">
                <div className="flex justify-between items-center p-2">
                    {/* LEFT: Title */}
                    <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px] lg:text-[18px]">
                        View & manage Excursion Details
                    </h4>

                    {/* RIGHT: Filters */}
                    <div className="flex items-center gap-3">
                        <select
                            className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[10px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                            value={excursionFilter}
                            onChange={(e) => setExcursionFilter(e.target.value)}
                        >
                            <option value="">Excursion </option>
                            <option value="Sigiriya Guided Climb">Sigiriya Guided Climb</option>
                            <option value="Mirissa Whale Watching Tour">Mirissa Whale Watching Tour</option>
                            <option value="Adam's Peak Sunrise Hike">Adam's Peak Sunrise Hike</option>
                            {/* Add more options as necessary */}
                        </select>
                        <select
                            className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">Catogory</option>
                            <option value="Wildlife & Nature" >Wildlife & Nature</option>
                            <option value=" Adventure & Cultural"> Adventure & Cultural</option>
                            <option value="Wildlife & Nature">Wildlife & Nature</option>
                            <option value="Nature & Adventure">Nature & Adventure</option>
                            <option value="Adventure & Pilgrimage">Adventure & Pilgrimage</option>

                        </select>
                        <button
                            className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
                            onClick={() => {
                                setExcursionFilter("");
                                setSearchQuery("");
                                setCategoryFilter("")
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
                        View & manage Excursion Details
                    </h4>

                    {/* RIGHT: Add button */}
                    <button
                        className="w-8 h-8 rounded-full border-2 border-[#B749DB] text-[#B749DB] flex items-center justify-center"
                        onClick={onAdd}
                    >
                        <IoMdAdd />
                    </button>
                </div>

                {/* FILTERS - Mobile */}
                <div className="flex items-center justify-between w-full">

                    {/* LEFT SIDE DROPDOWNS */}
                    <div className="flex items-center gap-2">
                        <select
                            className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 w-35 py-2 text-[16px] font-poppins bg-white cursor-pointer"
                            value={excursionFilter}
                            onChange={(e) => setExcursionFilter(e.target.value)}
                        >
                            <option value="">Excursion</option>
                            <option value="Sigiriya Guided Climb">Sigiriya Guided Climb</option>
                            <option value="Mirissa Whale Watching Tour">Mirissa Whale Watching Tour</option>
                            <option value="Adam's Peak Sunrise Hike">Adam's Peak Sunrise Hike</option>
                        </select>

                        <select
                            className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 w-35 text-[16px] font-poppins bg-white cursor-pointer"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">Category</option>
                            <option value="Wildlife & Nature">Wildlife & Nature</option>
                            <option value="Adventure & Cultural">Adventure & Cultural</option>
                            <option value="Nature & Adventure">Nature & Adventure</option>
                            <option value="Adventure & Pilgrimage">Adventure & Pilgrimage</option>
                        </select>
                    </div>

                    {/* RIGHT SIDE FILTER ICON */}
                    <button
                        className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
                        onClick={() => {
                            setExcursionFilter("");
                            setSearchQuery("");
                            setCategoryFilter("")
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
                        <tr className="bg-gray-50 text-[#382A59] text-center font-semibold text-[16px] sm:text-[16px] md:text-[16px] font-poppins">
                            <th className="px-3 py-4 whitespace-nowrap">Excursion Id</th>
                            <th className="px-3 py-3 whitespace-nowrap ">Excursion Points</th>
                            <th className="px-3 py-3">Image</th>
                            <th className="px-3 py-3">Location</th>
                            <th className="px-3 py-3">Category</th>
                            <th className="px-3 py-3 whitespace-nowrap">Best Time</th>
                            <th className="px-3 py-3 ">Duration</th>
                            <th className="px-3 py-3 ">Rating</th>
                            <th className="px-3 py-3 text-center whitespace-nowrap">Destination ID</th>
                            <th className="px-3 py-3 text-center whitespace-nowrap"></th>
                        </tr>
                    </thead>
                    <tbody className="font-poppins">
                        {currentExcursions.map((e: any) => (
                            <tr key={e.id} className="border-b border-gray-100 text-center text-[15px] sm:text-[13px] md:text-[14px] hover:bg-gray-50">
                                <td className="py-3 px-2">{e.id}</td>
                                <td className="py-3 px-2 ">{e.name}</td>
                                <td className="px-2 py-3">
                                    <img src={e.images} alt={e.name} className="w-12 h-12 object-cover"
                                    />
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap">{e.location}</td>
                                <td className="px-2 py-3 whitespace-nowrap">{e.category}</td>
                                <td className="px-2 py-3">{e.bestTime}</td>
                                <td className="px-2 py-3">{e.duration}</td>
                                <td className="px-2 py-3 whitespace-nowrap">{renderStars(e.rating)}</td>
                                <td className="px-2 py-3 r">{e.destinationId}</td>
                                <td className="px-3 py-1">
                                    <div className="flex gap-2 justify-center">
                                        <CiEdit className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => onEdit(e.id)}/>
                                        <MdDeleteOutline className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => handleDeleteClick(e.id)} />
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
                    totalItems={filteredExcursions.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={setExcursions}
                />
            </div>
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

    );
};

export default Excursion;
