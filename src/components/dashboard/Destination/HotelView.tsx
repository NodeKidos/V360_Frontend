import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import Pagination from "../../ui/Pagination";
import { LuListFilter } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import deleteicon from "../../../assets/delete.png"; // Import delete icon image

// Function to render star ratings
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

const Hotel = ({ hotels, page, itemsPerPage, setPage, setHotels, onAdd,onEdit }: any) => {
  const [hotelFilter, setHotelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hotelTypeFilter, setHotelTypeFilter] = useState("");

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Filter hotels based on search query and selected filter
  const filteredHotels = hotels.filter((hotel: any) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      hotel.id.toLowerCase().includes(searchLower) ||
      hotel.name.toLowerCase().includes(searchLower) ||
      hotel.images.toLowerCase().includes(searchLower) ||
      hotel.location.toLowerCase().includes(searchLower) ||
      hotel.hotelType.toLowerCase().includes(searchLower) ||
      hotel.contactNo.toLowerCase().includes(searchLower) ||
      hotel.starRating.toLowerCase().includes(searchLower) ||
      hotel.reviews.toLowerCase().includes(searchLower)
    );

    const matchesHotelFilter = hotelFilter === "" || hotel.name === hotelFilter;
    const matchesHotelTypeFilter = hotelTypeFilter === "" || hotel.hotelType === hotelTypeFilter;

    return matchesSearch && matchesHotelFilter && matchesHotelTypeFilter;
  });

  const indexOfLastHotel = page * itemsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  // Navigate to EditHotel page
  // const handleEditHotelClick = (hotelId: string) => {
  //   navigate(`/hotel/edit/${hotelId}`); // Navigate to the EditHotel page with the hotelId
  // };

  // Handle delete action
  const handleDeleteClick = (hotelId: string) => {
    setSelectedHotelId(hotelId); // Store the selected hotel ID
    setDeleteConfirmationVisible(true); // Show confirmation overlay
  };

  // Confirm the delete action
  const confirmDelete = () => {
    setHotels(hotels.filter(() => hotels.id !== selectedHotelId));
    setDeleteConfirmationVisible(false);

    toast.success("Hotel deleted successfully!", {
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
            View & manage Hotel Details
          </h4>

          {/* RIGHT: Filters */}
          <div className="flex items-center gap-3">
            <select
              className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
              value={hotelFilter}
              onChange={(e) => setHotelFilter(e.target.value)}
            >
              <option value="">Hotel</option>
              <option value="Shangri-La Colombo">Shangri-La Colombo</option>
              <option value="Cinnamon Red Colombo">Cinnamon Red Colombo</option>
              <option value="The Kingsbury Colombo">The Kingsbury Colombo</option>
              <option value="Galle Face Hotel">Galle Face Hotel</option>
              <option value="Cinnamon Life Colombo">Cinnamon Life Colombo</option>
            </select>
            <select
              className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
              value={hotelTypeFilter}
              onChange={(e) => setHotelTypeFilter(e.target.value)}
            >
              <option value="">Hotel Type</option>
              <option value="Luxury">Luxury</option>
              <option value="Heritage">Heritage</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Eco-Friendly">Eco-Friendly</option>
              <option value="Adventure Resort"> "Adventure Resort"</option>
            </select>

            <button
              className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 hover:bg-purple-50 cursor-pointer"
              onClick={() => {
                setHotelFilter("");
                setSearchQuery("");
                setHotelTypeFilter("");
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
            View & manage Hotel Details
          </h4>

          {/* RIGHT: Add button */}
          <button
            className="w-8 h-8 rounded-full border-2 border-[#B749DB] text-[#B749DB] flex items-center justify-center hover:bg-purple-50 cursor-pointer"
            onClick={onAdd}
          >
            <IoMdAdd className="text-[20px]" />
          </button>
        </div>

        {/* FILTERS - Mobile */}
        <div className="flex items-center justify-between w-full">

          {/* LEFT SIDE DROPDOWNS */}
          <div className="flex items-center gap-2">
            <select
              className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 w-35 text-[16px] font-poppins bg-white cursor-pointer"
              value={hotelFilter}
              onChange={(e) => setHotelFilter(e.target.value)}
            >
              <option value="">Hotel</option>
              <option value="Shangri-La Colombo">Shangri-La Colombo</option>
              <option value="Cinnamon Red Colombo">Cinnamon Red Colombo</option>
              <option value="The Kingsbury Colombo">The Kingsbury Colombo</option>
              <option value="Galle Face Hotel">Galle Face Hotel</option>
              <option value="Cinnamon Life Colombo">Cinnamon Life Colombo</option>
            </select>
            <select
              className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 w-35 text-[16px] font-poppins bg-white cursor-pointer"
              value={hotelTypeFilter}
              onChange={(e) => setHotelTypeFilter(e.target.value)}
            >
              <option value="">Hotel Type</option>
              <option value="Luxury">Luxury</option>
              <option value="Heritage">Heritage</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Eco-Friendly">Eco-Friendly</option>
              <option value="Adventure Resort"> "Adventure Resort"</option>
            </select>
          </div>
          {/* RIGHT SIDE FILTER ICON */}
          <button
            className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50 cursor-pointer"
            onClick={() => {
              setHotelFilter("");
              setHotelTypeFilter("");
              setSearchQuery("");
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
            <tr className="bg-gray-50 text-[#382A59] font-semibold text-[16px] sm:text-[14px] md:text-[15px] text-center font-poppins">
              <th className="px-3 py-2 whitespace-nowrap">Hotel Id</th>
              <th className="px-3 py-1 whitespace-nowrap">Hotel Name</th>
              <th className="px-3 py-1 whitespace-nowrap">Hotel Type</th>
              <th className="px-3 py-1 whitespace-nowrap">Image</th>
              <th className="px-3 py-1 whitespace-nowrap">Star Rating</th>
              <th className="px-3 py-1 whitespace-nowrap">Contact No</th>
              <th className="px-3 py-1 whitespace-nowrap">Location</th>
              <th className="px-3 py-1 whitespace-nowrap">Review</th>
              <th className="px-3 py-1 text-center whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody className="font-poppins">
            {currentHotels.map((h: any) => (
              <tr key={h.id} className="border-b border-gray-100 text-center text-[15px] sm:text-[16px] md:text-[16px] hover:bg-gray-50">
                <td className="py-1 px-3">{h.id}</td>
                <td className="py-1 px-3 ">{h.name}</td>
                <td className="px-3 py-1 ">{h.hotelType}</td>
                <td className="px-5 py-1 text-center">
                  <img src={h.images} alt={h.name} className="w-15 h-15 object-cover " />
                </td>
                <td className="px-3 py-1 text-center">{renderStars(Number(h.starRating))}</td>
                <td className="px-3 py-1 text-center">{h.contactNo}</td>
                <td className="px-3 py-1 text-center">{h.location}</td>
                <td className="px-3 py-1 text-center">{h.reviews}</td>
                <td className="px-3 py-1 whitespace-nowrap">
                  <div className="flex gap-2 justify-center">
                    <CiEdit className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => onEdit(h.id)} />
                    <MdDeleteOutline className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => handleDeleteClick(h.id)} />
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
          totalItems={filteredHotels.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onItemsPerPageChange={setHotels}
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

export default Hotel;
