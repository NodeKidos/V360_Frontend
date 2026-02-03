import { useState, useEffect } from "react";
import Sidebar from "../../components/AdminSidebar";
import TopBar from "../../components/Topbar"; // Import TopBar
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";

const PackagePricingSummary = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPrice, _setTotalPrice] = useState(2800);
  const [perPersonPrice, _setPerPersonPrice] = useState(700);
  const [remarks, _setRemarks] = useState("Includes accommodation, transport, entrance tickets, and taxes");

  // Modal visibility and modal type (for different titles)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");  // Title for the modal (Revisions/Decline)
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleActionClick = (action: string) => {
    if (action === "requestRevisions") {
      setModalTitle("Required/Expected Notes");
    } else if (action === "decline") {
      setModalTitle("Decline Notes");
    }
    setIsModalOpen(true);  // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);  // Close modal
    setNotes("");  // Reset notes input
  };

  const handleSubmitNotes = () => {
    // Handle submit of notes
    alert(`Submitted Notes: ${notes}`);
    setIsModalOpen(false);  // Close modal
    setNotes("");  // Clear notes
  };

  return (
    <div className="flex min-h-screen bg-white">
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

        {/* Main Heading for the Package Pricing */}
        <h1 className="text-3xl font-roboto-condensed font-semibold text-[#5B247A] mb-6">Package Pricing Summary</h1>

        {/* Costing Summary Box */}
        <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-4 min-h-[30vh] mb-6">
          <div className="space-y-6">
            {/* Costing Summary */}
            <h2 className="text-[20px] font-semibold mb-4">Costing Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pl-15 text-[18px]">
              <div className="mb-2">
                <span className="font-semibold">Total Package Price:</span> USD {totalPrice}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Per Person Price:</span> USD {perPersonPrice}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Remarks:</span> {remarks}
              </div>
            </div>

            {/* Action Buttons Section */}
            <div>
              <h3 className="text-[20px] font-semibold lg:ml-30 mb-4 text-[#B749DB]">Action</h3>
              <div className="flex flex-col sm:flex-row items-center lg:space-x-20 gap-6 justify-center">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="approve"
                    name="action"
                    className="mr-2"
                  />
                  <label htmlFor="approve" className="text-[20px] text-[#B749DB]">Approve Package</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="revision"
                    name="action"
                    className="mr-2"
                    onClick={() => handleActionClick("requestRevisions")}
                  />
                  <label htmlFor="revision" className="text-[20px] text-[#B749DB]">Request Revisions</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="decline"
                    name="action"
                    className="mr-2"
                    onClick={() => handleActionClick("decline")}
                  />
                  <label htmlFor="decline" className="text-[20px] text-[#B749DB]">Decline</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes Box */}
        <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-4 min-h-[30vh] mt-6">
          <h2 className="text-[20px] font-semibold mb-4">Important Notes</h2>
          <ul className="list-disc pl-10 text-[16px] font-roboto space-y-3">
            <li>“The above-mentioned price is valid for 48 hours from the time of confirmation. Due to high demand and dynamic hotel rates, availability and pricing may change after this period.”</li>
            <li>“All hotels and room categories are subject to availability at the time of final booking. If any selected hotels are unavailable, we will offer you the closest alternative of similar standard.”</li>
            <li>Please note that during peak travel seasons (e.g., Christmas, New Year, local holidays), prices may vary and room availability is limited. Early confirmation is highly recommended.</li>
            <li>“Prices are quoted in [currency] and are subject to exchange rate fluctuations if paying in a different currency at the time of booking.”</li>
            <li>“Any requested changes after the itinerary has been confirmed may result in additional charges.”</li>
          </ul>
          {/* Confirmation Checkbox */}
          <div className="flex items-center mt-5">
            <input type="checkbox" className="mr-2 w-5 h-5" />
            <span>I confirm that I have reviewed the itinerary and accept the above package price and terms.</span>
          </div>
        </div>

        {/* Submit Button - Right Aligned */}
        <div className="flex justify-end mt-5">
          <button className="px-6 py-2 cursor-pointer border border-[#B749DB] text-[16px] font-medium font-roboto-condensed text-[#401A4D] rounded-lg hover:bg-purple-100 transition-colors">
            Submit
          </button>
        </div>
      </div>

      {/* Modal for Notes (Required/Expected Notes and Decline Notes) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="bg-white p-8 rounded-lg w-[500px] max-w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-[#5B247A]">{modalTitle}</h2>
              <MdClose
                className="text-[#B749DB] cursor-pointer"
                size={24}
                onClick={handleModalClose}  // Close the modal
              />
            </div>
            <textarea
              className="w-full p-3 border border-[#B749DB] rounded-md mt-4"
              placeholder="Please describe your concern or the specific change you would like:"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleSubmitNotes}
                className="px-6 py-2 text-white bg-[#B749DB] rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagePricingSummary;
