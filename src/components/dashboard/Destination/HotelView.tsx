import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { MdFlag, MdOutlineFlag } from "react-icons/md";
import { useState } from "react";
import Pagination from "../../ui/Pagination";
import { LuListFilter } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import deleteicon from "../../../assets/delete.png"; // Import delete icon image
import hotelService from "../../../services/hotel.service";
import { useTranslation } from "react-i18next";

// Function to render star ratings
const renderStars = (rating: number) => {
  let stars = [];
  const fullStars = Math.floor(rating); // Get full stars (e.g., 4 from 4.6)
  const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('⭐');
    } else if (i === fullStars && hasHalfStar) {
      stars.push('⭐'); // You can use a half-star emoji if available
    } else {
      stars.push('☆');
    }
  }
  return stars.join(" ");
};

const Hotel = ({ hotels, page, itemsPerPage, setPage, setItemsPerPage, setHotels, onAdd, onEdit }: any) => {
  const { t } = useTranslation();
  const [hotelFilter, setHotelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hotelTypeFilter, setHotelTypeFilter] = useState("");

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [flagModalVisible, setFlagModalVisible] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagStartDate, setFlagStartDate] = useState("");
  const [flagEndDate, setFlagEndDate] = useState("");
  const [selectedHotelForFlag, setSelectedHotelForFlag] = useState<any>(null);

  // Ensure hotels is always an array
  const hotelsArray = Array.isArray(hotels) ? hotels : [];

  // Filter hotels based on search query and selected filter
  const filteredHotels = hotelsArray.filter((hotel: any) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      (hotel.id || '').toLowerCase().includes(searchLower) ||
      (hotel.name || '').toLowerCase().includes(searchLower) ||
      (hotel.description || '').toLowerCase().includes(searchLower) ||
      (hotel.address || '').toLowerCase().includes(searchLower) ||
      (hotel.type || '').toLowerCase().includes(searchLower) ||
      (hotel.contactNumber || '').toLowerCase().includes(searchLower) ||
      String(hotel.starRating || '').toLowerCase().includes(searchLower)
    );

    const matchesHotelFilter = hotelFilter === "" || hotel.name === hotelFilter;
    const matchesHotelTypeFilter = hotelTypeFilter === "" || (hotel.type || '').includes(hotelTypeFilter);

    return matchesSearch && matchesHotelFilter && matchesHotelTypeFilter;
  });

  const indexOfLastHotel = page * itemsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;
  let currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  // If current page has no items but there are items available, show first page
  if (currentHotels.length === 0 && filteredHotels.length > 0 && page > 1) {
    currentHotels = filteredHotels.slice(0, itemsPerPage);
  }

  // Navigate to EditHotel page
  // const handleEditHotelClick = (hotelId: string) => {
  //   navigate(`/hotel/edit/${hotelId}`); // Navigate to the EditHotel page with the hotelId
  // };

  // Handle delete action
  const handleDeleteClick = (hotelId: string) => {
    setSelectedHotelId(hotelId); // Store the selected hotel ID
    setDeleteConfirmationVisible(true); // Show confirmation overlay
  };

  const confirmDelete = async () => {
    if (!selectedHotelId) return;

    try {
      setErrorMessage(null);
      await hotelService.delete(selectedHotelId);
      setHotels(hotelsArray.filter((h: any) => h.id !== selectedHotelId));
      setDeleteConfirmationVisible(false);

      toast.success(t('management.destination.messages.hotelDeleteSuccess'), {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error: any) {
      console.error("Failed to delete hotel:", error);
      const message = error.response?.data?.message || t('management.destination.messages.hotelDeleteFailed');
      setErrorMessage(message);
      toast.error(message);
    }
  };
  // Cancel delete action
  const cancelDelete = () => {
    setDeleteConfirmationVisible(false); // Hide the overlay
    setErrorMessage(null);
  };

  // Handle flag hotel
  const handleFlagClick = (hotel: any) => {
    setSelectedHotelForFlag(hotel);
    setFlagReason("");
    setFlagStartDate("");
    setFlagEndDate("");
    setFlagModalVisible(true);
  };

  // Confirm flag hotel
  const confirmFlag = async () => {
    if (!selectedHotelForFlag) return;

    if (!flagReason.trim()) {
      toast.error(t('management.destination.modals.flagRequirement'), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!flagStartDate || !flagEndDate) {
      toast.error(t('management.destination.modals.dateRequirement'), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await hotelService.flagHotel(selectedHotelForFlag.id, flagReason, flagStartDate, flagEndDate);

      // Update local state
      setHotels(hotelsArray.map((h: any) =>
        h.id === selectedHotelForFlag.id
          ? {
            ...h,
            isFlagged: true,
            flagReason: flagReason,
            unavailabilityStart: flagStartDate,
            unavailabilityEnd: flagEndDate
          }
          : h
      ));

      setFlagModalVisible(false);
      toast.success(t('management.destination.messages.flagSuccess'), {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Failed to flag hotel:", error);
      toast.error(error.response?.data?.message || t('management.destination.messages.flagFailed'), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle unflag hotel
  const handleUnflagClick = async (hotel: any) => {
    try {
      await hotelService.unflagHotel(hotel.id);

      // Update local state
      setHotels(hotelsArray.map((h: any) =>
        h.id === hotel.id
          ? { ...h, isFlagged: false, flagReason: null }
          : h
      ));

      toast.success(t('management.destination.messages.unflagSuccess'), {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error: any) {
      console.error("Failed to unflag hotel:", error);
      toast.error(error.response?.data?.message || t('management.destination.messages.unflagFailed'), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      {/* VIEW & MANAGE SECTION - Desktop */}
      <div className="mb-6 hidden md:block">
        <div className="flex justify-between items-center p-2">
          {/* LEFT: Title */}
          <h4 className="font-poppins font-medium text-black text-[14px] sm:text-[16px] lg:text-[18px]">
            {t('management.destination.subtitle') /* Reusing subtitle as it fits the context */}
          </h4>

          {/* RIGHT: Filters */}
          <div className="flex items-center gap-3">
            <select
              className="border border-[#B749DB] text-[#B749DB] rounded-md px-3 py-1 text-[12px] sm:text-[14px] font-poppins bg-white cursor-pointer"
              value={hotelFilter}
              onChange={(e) => setHotelFilter(e.target.value)}
            >
              <option value="">{t('management.destination.filters.hotel')}</option>
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
              <option value="">{t('management.destination.filters.hotelType')}</option>
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
              <option value="">{t('management.destination.filters.hotel')}</option>
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
              <option value="">{t('management.destination.filters.hotelType')}</option>
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
              {/* <th className="px-3 py-4 whitespace-nowrap">Hotel Id</th> */}
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.hotelName')}</th>
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.hotelType')}</th>
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.image')}</th>
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.starRating')}</th>
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.contactNo')}</th>
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.location')}</th>
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.review')}</th>
              <th className="px-3 py-3 whitespace-nowrap">{t('management.destination.table.status')}</th>
              <th className="px-3 py-3 text-center whitespace-nowrap">{t('management.destination.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="font-poppins">
            {currentHotels.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-gray-500 font-poppins">
                  <div className="flex flex-col items-center justify-center">
                    <LuListFilter className="text-4xl mb-2 text-gray-300" />
                    <p>{t('dashboard.common.noData')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentHotels.map((h: any) => (
                <tr key={h.id} className="border-b border-gray-100 text-center text-gray-600 text-[13px] sm:text-[14px] md:text-[15px] hover:bg-gray-50">
                  {/* <td className="py-1 px-3">{h.id}</td> */}
                  <td className="py-1 px-3 ">{h.name}</td>
                  <td className="px-3 py-1 ">{h.type || t('common.noData')}</td>
                  <td className="px-5 py-1 text-center">
                    <img src={h.images?.[0] || h.images} alt={h.name} className="w-16 h-16 object-cover " />
                  </td>
                  <td className="px-3 py-1 text-center">{renderStars(Number(h.starRating || 0))}</td>
                  <td className="px-3 py-1 text-center">{h.contactNumber || t('common.noData')}</td>
                  <td className="px-3 py-1 text-center">{h.address || h.destination?.location || t('common.noData')}</td>
                  <td className="px-3 py-1 text-center">{h.reviewCount ? `${h.reviewCount} ${t('management.destination.table.review').toLowerCase()}` : t('management.itinerary.table.noReviews')}</td>
                  <td className="px-3 py-1 text-center">
                    {h.isFlagged ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium" title={h.flagReason}>
                        <MdFlag className="text-sm" />
                        {t('management.destination.status.unavailable')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {t('management.destination.status.available')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap">
                    <div className="flex gap-2 justify-center items-center">
                      <CiEdit className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => onEdit(h.id)} title={t('dashboard.common.edit')} />
                      {h.isFlagged ? (
                        <MdOutlineFlag className="text-green-600 cursor-pointer text-[20px]" onClick={() => handleUnflagClick(h)} title={t('management.destination.modals.flagButton')} />
                      ) : (
                        <MdFlag className="text-orange-500 cursor-pointer text-[20px]" onClick={() => handleFlagClick(h)} title={t('management.destination.modals.flagTitle')} />
                      )}
                      <MdDeleteOutline className="text-[#B749DB] cursor-pointer text-[20px]" onClick={() => handleDeleteClick(h.id)} title={t('dashboard.common.delete')} />
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
          totalItems={filteredHotels.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onItemsPerPageChange={setItemsPerPage}
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

      {/* Flag Hotel Modal */}
      {flagModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-[500px] relative">
            {/* Close icon at the top-right */}
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={() => setFlagModalVisible(false)}
            >
              &times;
            </button>

            <div className="mb-4 flex items-center justify-center gap-2">
              <MdFlag className="text-orange-500 text-3xl" />
              <h3 className="text-[18px] md:text-[20px] font-semibold font-inter">
                {t('management.destination.modals.flagTitle')}
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {t('dashboard.common.hotel')}: <span className="font-semibold">{selectedHotelForFlag?.name}</span>
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('management.destination.modals.flagStartDate')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={flagStartDate}
                  onChange={(e) => setFlagStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B749DB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('management.destination.modals.flagEndDate')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={flagEndDate}
                  onChange={(e) => setFlagEndDate(e.target.value)}
                  min={flagStartDate || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B749DB]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('management.destination.modals.flagReason')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="E.g., Renovation ongoing until June 2024, Temporary closure due to maintenance..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B749DB] min-h-[100px]"
              />
            </div>

            <p className="text-xs text-gray-500 mb-4">
              {t('management.destination.modals.flagWarning')}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 justify-end">
              <button
                className="bg-gray-200 font-medium font-inter text-black px-6 py-2 rounded-lg hover:bg-gray-300 text-[14px] md:text-[16px]"
                onClick={() => setFlagModalVisible(false)}
              >
                {t('management.customer.modals.cancel')}
              </button>

              <button
                className="bg-orange-500 font-medium font-inter text-white px-6 py-2 rounded-lg hover:bg-orange-600 text-[14px] md:text-[16px]"
                onClick={confirmFlag}
              >
                {t('management.destination.modals.flagButton')}
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
