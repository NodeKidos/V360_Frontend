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

const CustomerManagement = () => {
  const navigate = useNavigate(); // Initialize the navigation function

  const [customers, setCustomers] = useState([
    { id: "CI001", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Australia", passport: "P4366918", age: 35, status: "Unblock" },
    { id: "CI002", name: "Jessy", email: "jes@gmail.com", gender: "Female", contact: "+94 762347830", country: "Singapore", passport: "E5787905H", age: 23, status: "Unblock" },
    { id: "CI003", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Canada", passport: "LA123456", age: 35, status: "Block" },
    { id: "CI004", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Australia", passport: "P4366918", age: 35, status: "Unblock" },
    { id: "CI005", name: "Jessy", email: "jes@gmail.com", gender: "Female", contact: "+94 762347830", country: "Singapore", passport: "E5787905H", age: 23, status: "Block" },
    { id: "CI006", name: "Alice", email: "alice@gmail.com", gender: "Male", contact: "+94 762347830", country: "Canada", passport: "LA123456", age: 35, status: "Block" }
  ]);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const indexOfLastCustomer = page * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigate to EditCustomer page
  const handleEditClick = (customerId: string) => {
    navigate(`/user/edit/${customerId}`); // Navigate to the EditCustomer page with the customerId
  };

  // Handle delete action
  const handleDeleteClick = (customerId: string) => {
    setSelectedCustomerId(customerId); // Store the selected customer ID
    setDeleteConfirmationVisible(true); // Show confirmation overlay
  };

  // Confirm the delete action
  const confirmDelete = () => {
    setCustomers(customers.filter((customer) => customer.id !== selectedCustomerId));
    setDeleteConfirmationVisible(false);

    toast.success("Customer deleted successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Cancel delete action
  const cancelDelete = () => {
    setDeleteConfirmationVisible(false); // Hide the overlay
  };

  // Navigate to AddCustomer page
  const handleAddCustomerClick = () => {
    navigate("/user/add"); // Navigate to AddCustomer page
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
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        {/* TITLE */}
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
            Customer Management
          </h2>

          <button
            className="bg-[#B749DB] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[14px] md:text-[16px] cursor-pointer whitespace-nowrap"
            onClick={handleAddCustomerClick}
          >
            + Add Customer
          </button>
        </div>


        {/* FILTERS */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* LEFT: Title */}
            <h4 className="font-poppins font-semibold text-black text-[16px] sm:text-[18px] lg:text-[20px]">
              View & manage Customer Details
            </h4>

            {/* RIGHT: Filters */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
              <select className="border border-[#B749DB] text-[#B749DB] rounded-lg px-2 sm:px-3 py-2 text-[12px] sm:text-[14px] font-poppins flex-1 sm:flex-none">
                <option>Country</option>
                <option>Australia</option>
                <option>Singapore</option>
                <option>Canada</option>
              </select>

              <select className="border border-[#B749DB] text-[#B749DB] rounded-lg px-2 sm:px-3 py-2 text-[12px] sm:text-[14px] font-poppins flex-1 sm:flex-none">
                <option>Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <select className="border border-[#B749DB] text-[#B749DB] rounded-lg px-2 sm:px-3 py-2 text-[12px] sm:text-[14px] font-poppins flex-1 sm:flex-none">
                <option>Status</option>
                <option>Unblock</option>
                <option>Block</option>
              </select>

              <button className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2 hover:bg-purple-50">
                <LuListFilter className="text-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200" style={{scrollbarWidth: "thin"}}>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-[#382A59] font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-center font-poppins">
                <th className="px-3 py-3 whitespace-nowrap">Customer Id</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Gender</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Country</th>
                <th className="px-3 py-3">Passport</th>
                <th className="px-3 py-3">Age</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="font-poppins">
              {currentCustomers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 text-center text-[12px] sm:text-[13px] md:text-[14px] hover:bg-gray-50">
                  <td className="py-3 px-2">{c.id}</td>

                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2 justify-center">
                      <img src="https://i.pravatar.cc/40" className="w-7 h-7 md:w-8 md:h-8 rounded-full" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>

                  <td className="px-2 py-3">{c.email}</td>
                  <td className="px-2 py-3">{c.gender}</td>
                  <td className="px-2 py-3 whitespace-nowrap">{c.contact}</td>
                  <td className="px-2 py-3">{c.country}</td>
                  <td className="px-2 py-3">{c.passport}</td>
                  <td className="px-2 py-3">{c.age}</td>

                  <td className={`px-2 py-3 font-medium ${c.status === "Unblock" ? "text-green-600" : "text-red-600"}`}>
                    {c.status}
                  </td>

                  <td className="px-2 py-3">
                    <div className="flex gap-2 justify-center">
                      <CiEdit
                        className="text-[#B749DB] cursor-pointer text-[18px] md:text-[20px] hover:text-purple-700"
                        onClick={() => handleEditClick(c.id)}
                      />
                      <MdDeleteOutline
                        className="text-[#B749DB] cursor-pointer text-[18px] md:text-[20px] hover:text-purple-700"
                        onClick={() => handleDeleteClick(c.id)}
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
            totalItems={customers.length}
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

export default CustomerManagement;