import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import TopBar from "../../Topbar";
import Sidebar from "../../AdminSidebar";
import Pagination from "../../ui/Pagination";
import { LuListFilter } from "react-icons/lu";

const CustomerManagement = () => {
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isIPad, setIsIPad] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktopMain, setIsDesktopMain] = useState(window.innerWidth >= 1024);

  // AUTO SET ONLY ON SCREEN TYPE CHANGE
  useEffect(() => {
    if (isIPad) {
      setItemsPerPage((prev) => prev !== 6 ? 6 : prev);
    } else if (isMobile) {
      setItemsPerPage((prev) => prev !== 3 ? 3 : prev);
    } else {
      // Desktop
      setItemsPerPage((prev) => prev !== 3 ? 6 : prev);
    }
  }, [isMobile, isIPad, isDesktopMain]);

  return (
    <div className="min-h-screen bg-white flex flex-col sm:flex-row">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTAINER */}
      <div
        className={`flex-1 ${isIPad
            ? "px-6 py-4 h-[calc(100vh-70px)] overflow-hidden"
            : "p-4 md:p-8"
          }`}
      >
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        {/* TITLE */}
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2
            className="font-poppins font-bold text-black text-[30px] md:text-[40px] not-even:lg:text-[48px]"
          >
            Customer Management
          </h2>

          {isIPad ? (
            <button className="bg-[#B749DB] text-white px-6 py-2 rounded-xl text-[16px]">
              + Add Customer
            </button>
          ) : (
            <button className="bg-[#B749DB] text-white rounded-full h-[40px] flex items-center justify-center md:px-4 md:py-2 md:rounded-[10px]">
              <span className="hidden md:block">+ Add Customer</span>
            </button>
          )}
        </div>

        {/* SEARCH — Mobile Only */}
        {isMobile && (
          <div className="bg-[#f7e8ff] rounded-xl flex items-center gap-3 px-4 py-3 mb-6">
            <i className="fas fa-search text-[#B749DB]"></i>
            <input
              type="text"
              placeholder="Search here"
              className="w-full bg-transparent outline-none text-[#6b6b6b]"
            />
          </div>
        )}

        {/* FILTERS */}
        <div className="mb-4">

          {/* DESKTOP ROW (title + filters same line) */}
          {isDesktopMain && (
            <div className="hidden lg:flex items-center justify-between w-full">

              {/* LEFT: Title */}
              <h4 className="font-poppins font-bold text-black text-[20px]">
                View & manage Tour Details
              </h4>

              {/* RIGHT: Filters */}
              <div className="flex items-center gap-4 text-[#B749DB]">

                <select className="border border-[#B749DB] rounded-lg px-4 py-2">
                  <option>Country</option>
                </select>

                <select className="border border-[#B749DB] rounded-lg px-4 py-2">
                  <option>Gender</option>
                </select>

                <select className="border border-[#B749DB] rounded-lg px-4 py-2">
                  <option>Status</option>
                </select>

                <button className="border border-[#B749DB] text-[#B749DB] rounded-lg px-3 py-2">
                  <LuListFilter />
                </button>

              </div>
            </div>
          )}

          {/* MOBILE + IPAD VERSION (stacked layout) */}
          {!isDesktopMain && (
            <div>
              <div className="flex justify-between items-center">
                <h4 className="font-poppins font-bold text-black text-[16px] md:text-[18px]">
                  View & manage Tour Details
                </h4>

                {isMobile && (
                  <button className="border border-[#B749DB] text-[#B749DB] rounded-[15px] w-[40px] h-[40px] flex items-center justify-center text-2xl">
                    +
                  </button>
                )}
              </div>

              {/* Mobile + iPad filters */}
              {(isMobile || isIPad) && (
                <div className="flex items-center gap-2 mt-4 text-[#B749DB] w-full">

                  <select className="border border-[#B749DB] rounded-[10px] px-2 py-2 w-40">
                    <option>Country</option>
                  </select>

                  <select className="border border-[#B749DB] rounded-[10px] px-2 py-2 w-40">
                    <option>Gender</option>
                  </select>

                  <select className="border border-[#B749DB] rounded-[10px] px-2 py-2 w-40">
                    <option>Status</option>
                  </select>

                  {/* Filter icon pushed to far right */}
                  <button className="border border-[#B749DB] rounded-[10px] p-2 text-[#B749DB] text-[20px] ml-auto">
                    <LuListFilter />
                  </button>

                </div>
              )}
            </div>
          )}
        </div>
        {/* TABLE — iPad Scroll ONLY */}
        <div
          className={`mb-6 ${isIPad
              ? "overflow-y-auto overflow-x-auto h-[40vh]"
              : "overflow-x-scroll"
            }`}
        >
          <table
            className={`min-w-full bg-white shadow-md rounded-lg`}
          >
            <thead>
              <tr
                className="
                  bg-gray-100 text-[#382A59] font-semibold
                  text-[20px]
                  md:text-[24px]
                  lg:text-[26px]
                  text-left lg:text-center
                "
              >
                <th className="px-4 py-3 whitespace-nowrap">Customer Id</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-10 py-3">Email</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Passport</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="
                    border-b text-center
                    text-[18px]
                    md:text-[20px]
                    lg:text-[24px]
                  "
                >
                  <td className="py-3">{c.id}</td>

                  <td className="py-3 flex items-center gap-2 lg:justify-center">
                    <img src="https://i.pravatar.cc/40" className="w-8 h-8 rounded-full" />
                    {c.name}
                  </td>

                  <td className="px-5">{c.email}</td>
                  <td>{c.gender}</td>
                  <td className="whitespace-nowrap">{c.contact}</td>
                  <td>{c.country}</td>
                  <td>{c.passport}</td>
                  <td>{c.age}</td>

                  <td className={c.status === "Unblock" ? "text-green-600" : "text-red-600"}>
                    {c.status}
                  </td>

                  <td className="flex gap-2 justify-center py-3">
                    <FaEdit className="text-[#B749DB]" />
                    <FaTrashAlt className="text-[#B749DB]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className={`${isIPad ? "mt-2" : "mt-4"}`}>
          <Pagination
            currentPage={page}
            totalItems={customers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>

      </div>
    </div>
  );
};

export default CustomerManagement;
