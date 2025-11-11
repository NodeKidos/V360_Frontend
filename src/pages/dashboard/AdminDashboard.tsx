// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import { FiUsers, FiTruck, FiMapPin, FiSettings, FiLogOut } from "react-icons/fi";
// import { MdTour } from "react-icons/md";
// import { FaHotel, FaUserTie } from "react-icons/fa";
// import { BsCalendar3 } from "react-icons/bs";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const { logout } = useAuthStore();

//   // Logout function
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-[#fafafa] text-gray-800 font-inter">
//       {/* ---------------- Sidebar ---------------- */}
//       <aside className="w-[270px] bg-white shadow-lg flex flex-col justify-between border-r">
//         <div>
//           <div className="flex items-center gap-2 px-6 py-5 border-b">
//             <img src="/vite.svg" alt="Logo" className="w-10 h-10" />
//             <h1 className="text-xl font-bold text-purple-600">Vibes Lanka</h1>
//           </div>

//           {/* Sidebar Menu */}
//           <nav className="flex flex-col gap-3 mt-6 px-6">
//             <SidebarItem icon={<FiUsers />} label="Dashboard" active />
//             <SidebarItem icon={<FaUserTie />} label="User" />
//             <SidebarItem icon={<MdTour />} label="Tour" />
//             <SidebarItem icon={<FaHotel />} label="Hotel & Destination" />
//             <SidebarItem icon={<FiTruck />} label="Vehicle" />
//             <SidebarItem icon={<FaUserTie />} label="Driver" />
//             <SidebarItem icon={<FaUserTie />} label="Staff" />
//             <SidebarItem icon={<FiMapPin />} label="Trip" />
//             <SidebarItem icon={<BsCalendar3 />} label="Reward" />
//           </nav>
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t">
//           <SidebarItem icon={<FiSettings />} label="Settings" />
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 text-gray-700 hover:text-purple-600 mt-3"
//           >
//             <FiLogOut size={20} />
//             Log Out
//           </button>
//           <div className="flex items-center gap-3 mt-6">
//             <img
//               src="https://i.pravatar.cc/40"
//               alt="profile"
//               className="rounded-full w-10 h-10"
//             />
//             <div>
//               <p className="text-sm font-semibold">Jacqueline Fernando</p>
//               <p className="text-xs text-gray-500">jack@gmail.com</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* ---------------- Main Content ---------------- */}
//       <main className="flex-1 p-8 overflow-auto">
//         {/* Top Bar */}
//         <div className="flex justify-between items-center mb-8">
//           <input
//             type="text"
//             placeholder="Search here"
//             className="w-96 p-3 rounded-xl bg-white shadow text-gray-700 focus:outline-none"
//           />
//           <div className="flex items-center gap-3">
//             <img
//               src="https://i.pravatar.cc/40"
//               alt="Admin"
//               className="rounded-full w-10 h-10"
//             />
//             <div>
//               <p className="font-semibold">Admin</p>
//               <p className="text-sm text-gray-500">Mac</p>
//             </div>
//           </div>
//         </div>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatCard title="Total Customer" value="50" />
//           <StatCard title="Total Vehicle" value="28" />
//           <StatCard title="Total Driver" value="40" />
//           <StatCard title="Driving Hours" value="16 hr 12 m" />
//         </div>

//         {/* Middle Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Calendar */}
//           <div className="bg-white p-6 rounded-xl shadow col-span-1">
//             <h3 className="font-semibold mb-3">Calendar</h3>
//             <div className="grid grid-cols-7 gap-2 text-center text-sm">
//               {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
//                 <div key={d} className="font-semibold text-gray-500">
//                   {d}
//                 </div>
//               ))}
//               {Array.from({ length: 30 }, (_, i) => (
//                 <div
//                   key={i}
//                   className={`p-2 rounded-md ${
//                     [4, 8, 15].includes(i) ? "bg-purple-300" : "bg-gray-100"
//                   }`}
//                 ></div>
//               ))}
//             </div>
//           </div>

//           {/* Reward Details */}
//           <div className="bg-white p-6 rounded-xl shadow col-span-2">
//             <h3 className="font-semibold mb-3">Reward Details</h3>
//             <table className="min-w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b text-gray-600">
//                   <th className="p-2">Reward Id</th>
//                   <th className="p-2">Reward Type</th>
//                   <th className="p-2">Date</th>
//                   <th className="p-2">Customer Id</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   ["RI001", "Referring a Friend", "03.04.2025", "CI001"],
//                   ["RI002", "Birthday", "03.04.2025", "CI002"],
//                   ["RI003", "Review", "03.04.2025", "CI003"],
//                   ["RI004", "Active Participation", "03.04.2025", "CI004"],
//                 ].map((r, i) => (
//                   <tr key={i} className="border-b hover:bg-gray-50">
//                     {r.map((col, idx) => (
//                       <td key={idx} className="p-2 text-sm text-gray-700">
//                         {col}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//           {/* Itinerary Details */}
//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="font-semibold mb-3">Itinerary Details</h3>
//             <table className="min-w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b text-gray-600">
//                   <th className="p-2">Itinerary</th>
//                   <th className="p-2">Name</th>
//                   <th className="p-2">Phone</th>
//                   <th className="p-2">Date</th>
//                   <th className="p-2">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <tr key={i} className="border-b hover:bg-gray-50">
//                     <td className="p-2">ID00{i + 1}</td>
//                     <td className="p-2">Alice</td>
//                     <td className="p-2">+94 74 455 2676</td>
//                     <td className="p-2">07-Sep-2025 14:30</td>
//                     <td className="p-2 text-purple-600 font-semibold">Started</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Best Destination */}
//           <div className="bg-white p-6 rounded-xl shadow">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-semibold">Best Destination 🌈</h3>
//               <button className="border rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-purple-100">
//                 Filters
//               </button>
//             </div>
//             <ul className="space-y-3">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <li key={i} className="flex items-center gap-3">
//                   <img
//                     src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=100"
//                     alt="Destination"
//                     className="rounded-lg w-14 h-14 object-cover"
//                   />
//                   <div>
//                     <p className="font-semibold">Lotus Tower</p>
//                     <p className="text-sm text-gray-500">📍 Colombo • ⭐ 4.8</p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ---------- Sidebar Item Component ---------- */
// const SidebarItem = ({ icon, label, active = false }: any) => (
//   <button
//     className={`flex items-center gap-3 py-2 px-3 rounded-md text-sm font-medium transition-all ${
//       active
//         ? "bg-purple-100 text-purple-600"
//         : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
//     }`}
//   >
//     <span className="text-lg">{icon}</span>
//     {label}
//   </button>
// );

// /* ---------- Stat Card Component ---------- */
// const StatCard = ({ title, value }: any) => (
//   <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
//     <h4 className="text-gray-500 text-sm mb-2">{title}</h4>
//     <p className="text-3xl font-bold text-purple-600">{value}</p>
//   </div>
// );
