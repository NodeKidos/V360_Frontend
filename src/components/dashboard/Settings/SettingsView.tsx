import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../../AdminSidebar";
import TopBar from "../../Topbar";
import { packageService } from "../../../services/package.service";
import type { Package } from "../../../services/package.service";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SettingsView = () => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState("general");
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Package management state
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Partial<Package> | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const languages = [
        { code: "en", name: "English" },
        { code: "si", name: "Sinhala (සිංහල)" },
        { code: "ta", name: "Tamil (தமிழ்)" },
        { code: "zh", name: "Chinese (中文)" },
        { code: "nl", name: "Dutch (Nederlands)" },
        { code: "hi", name: "Hindi (හිन्दी)" },
        { code: "fr", name: "French (Français)" },
    ];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (activeTab === "packages") {
            fetchPackages();
        }
    }, [activeTab]);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const data = await packageService.getAll();
            setPackages(data);
        } catch (error) {
            toast.error("Failed to load packages");
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        toast.success(`${t('settings.language')} updated to ${languages.find(l => l.code === lng)?.name}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateOrUpdate = async () => {
        if (!editingPackage?.title || !editingPackage?.description) {
            toast.warning("Title and Description are required");
            return;
        }

        const formData = new FormData();
        formData.append("title", editingPackage.title);
        formData.append("description", editingPackage.description);
        formData.append("order", String(editingPackage.order || 0));
        formData.append("isActive", String(editingPackage.isActive));
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            if (editingPackage.id) {
                await packageService.update(editingPackage.id, formData);
                toast.success("Package updated successfully");
            } else {
                await packageService.create(formData);
                toast.success("Package created successfully");
            }
            setShowModal(false);
            setSelectedFile(null);
            setImagePreview(null);
            fetchPackages();
        } catch (error) {
            toast.error("Failed to save package");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            try {
                await packageService.delete(id);
                toast.success("Package deleted");
                fetchPackages();
            } catch (error) {
                toast.error("Failed to delete package");
            }
        }
    };

    const openEditModal = (pkg: Partial<Package>) => {
        setEditingPackage(pkg);
        setImagePreview(pkg.image || null);
        setSelectedFile(null);
        setShowModal(true);
    };

    return (
        <div className="flex w-full min-h-screen bg-white">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className={`flex-1 p-4 transition-all duration-300 ${collapsed ? "ml-2" : "ml-6"}`}>
                <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

                <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-6 min-h-[80vh]">
                    <h1 className="text-2xl sm:text-3xl font-roboto-condensed font-semibold text-[#5B247A] mb-8">
                        {t('settings.title')}
                    </h1>

                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-gray-100 mb-8">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`pb-4 px-4 font-medium transition-all ${activeTab === "general"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500 hover:text-purple-400"
                                }`}
                        >
                            {t('settings.general')}
                        </button>
                        <button
                            onClick={() => setActiveTab("packages")}
                            className={`pb-4 px-4 font-medium transition-all ${activeTab === "packages"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500 hover:text-purple-400"
                                }`}
                        >
                            {t('settings.packages')}
                        </button>
                    </div>

                    <div className="max-w-4xl">
                        {activeTab === "general" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('settings.selectLanguage')}
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {languages.map((lng) => (
                                            <button
                                                key={lng.code}
                                                onClick={() => changeLanguage(lng.code)}
                                                className={`p-4 rounded-xl border text-left transition-all ${i18n.language === lng.code
                                                    ? "border-purple-600 bg-purple-50 text-purple-700 font-bold"
                                                    : "border-gray-200 hover:border-purple-300 text-gray-600"
                                                    }`}
                                            >
                                                {lng.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "packages" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">{t('settings.packages')}</h3>
                                    <button
                                        onClick={() => {
                                            openEditModal({ isActive: true, order: 0 });
                                        }}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-all font-medium"
                                    >
                                        <FiPlus /> {t('settings.addPackage')}
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="py-20 text-center text-gray-500">Loading packages...</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                                    <th className="p-4 border-b">{t('settings.packageTitle')}</th>
                                                    <th className="p-4 border-b">{t('settings.packageOrder')}</th>
                                                    <th className="p-4 border-b">{t('settings.packageActive')}</th>
                                                    <th className="p-4 border-b text-right">{t('settings.actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {packages.map((pkg) => (
                                                    <tr key={pkg.id} className="hover:bg-gray-50 transition-all">
                                                        <td className="p-4 border-b">
                                                            <div className="flex items-center gap-3">
                                                                {pkg.image && (
                                                                    <img src={pkg.image} alt={pkg.title} className="w-10 h-10 rounded-lg object-cover" />
                                                                )}
                                                                <div>
                                                                    <div className="font-medium text-gray-800">{pkg.title}</div>
                                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{pkg.description}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 border-b">{pkg.order}</td>
                                                        <td className="p-4 border-b">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                                                }`}>
                                                                {pkg.isActive ? "Yes" : "No"}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 border-b text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => openEditModal(pkg)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                >
                                                                    <FiEdit2 />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(pkg.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <FiTrash2 />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {packages.length === 0 && (
                                            <div className="py-20 text-center text-gray-400 border-b italic">
                                                No packages found. Add your first package to show it on the homepage!
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Package Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowModal(false);
                                setSelectedFile(null);
                                setImagePreview(null);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white rounded-[30px] shadow-2xl w-full max-w-xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#5B247A]">
                                        {editingPackage?.id ? t('settings.editPackage') : t('settings.addPackage')}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setSelectedFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.packageTitle')}</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-600 outline-none transition-all"
                                            value={editingPackage?.title || ""}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.packageDescription')}</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-600 outline-none transition-all resize-none"
                                            value={editingPackage?.description || ""}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.packageImage')}</label>
                                        <div className="flex flex-col gap-3">
                                            {imagePreview && (
                                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setSelectedFile(null);
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full p-2 rounded-xl border border-gray-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.packageOrder')}</label>
                                            <input
                                                type="number"
                                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-600 outline-none transition-all"
                                                value={editingPackage?.order || 0}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, order: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="flex items-end pb-3 gap-2">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                                                checked={editingPackage?.isActive || false}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, isActive: e.target.checked })}
                                            />
                                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                {t('settings.packageActive')}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setSelectedFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-medium text-gray-600"
                                    >
                                        {t('settings.cancel')}
                                    </button>
                                    <button
                                        onClick={handleCreateOrUpdate}
                                        className="px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all font-bold flex items-center gap-2"
                                    >
                                        <FiSave /> {t('settings.save')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsView;
