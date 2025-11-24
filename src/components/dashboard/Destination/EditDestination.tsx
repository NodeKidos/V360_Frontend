import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";

export default function EditDestination() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { id } = useParams();
    const [destinationData, setDestinationData] = useState({
        name: "",
        image: "",
        reviews: "",
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Fetch the destination data based on the `id` (replace with actual API call)
        setDestinationData({
            name: "Sigiriya Rock Fortress",
            image: "https://example.com/images/sigiriya.jpg",
            reviews: "Great landmark with breathtaking views!",
        });
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Logic for updating the destination (replace with actual logic)
        toast.success("Destination updated successfully!", {
            position: "top-right",
            autoClose: 2000,
        });

        setTimeout(() => {
          navigate("destination-hotel"); // Redirect to the destination list page
        }, 2000);
    };

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                        <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/destination-hotel")}>
                            Destination
                        </span>
                        <span className="text-gray-500">›</span>
                        <span className="font-semibold text-black">Edit Destination</span>
                    </div>

                    {/* Form Container */}
                    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
                        {/* Title */}
                        <div>
                            <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                                Edit Destination
                            </h2>
                            <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                                Update the destination details
                            </p>
                        </div>
                        {/* FORM START */}
                        <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {/* Destination Name */}
                            <div>
                                <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Destination Name</label>
                                <input
                                    type="text"
                                    value={destinationData.name}
                                    onChange={(e) => setDestinationData({ ...destinationData, name: e.target.value })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>

                            {/* Destination Image */}
                            <div>
                                <label className="text-gray-700">Destination Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => setDestinationData({ ...destinationData, image: e.target.files![0].name })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>

                            {/* Reviews */}
                            <div>
                                <label className="text-gray-700">Reviews</label>
                                <textarea
                                    value={destinationData.reviews}
                                    onChange={(e) => setDestinationData({ ...destinationData, reviews: e.target.value })}
                                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 py-2"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/destination-hotel")}
                                    className="px-8 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}