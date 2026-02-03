import { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaEdit, FaLock, FaCamera, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import Sidebar from '../AdminSidebar';
import TopBar from '../Topbar';
import { Card, CardContent } from '../ui/card';
import userService from '../../services/user.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '../../store/useAuthStore';
import { adminDriverService } from '../../services/admin.service';
import ImageModal from '../ui/ImageModal';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: string;
  status: string;
  customer?: {
    address?: string;
    city?: string;
    country?: string;
    nationality?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    loyaltyPoints?: number;
  };
  driver?: {
    id: string;
    licenseNumber: string;
    licenseExpiry: string;
    licenseImage?: string[]; // Updated to supports array
    experienceYears?: number;
    languages?: string[];
    bloodGroup?: string;
    nationalId?: string;
    joinDate?: string;
    address?: string;
    city?: string;
    country?: string;
    nationality?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  admin?: {
    id: string;
    address?: string;
    city?: string;
    country?: string;
    nationality?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  };
}

const UserProfile = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const updateUserStore = useAuthStore(state => state.updateUser);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    gender: '',
    // Driver fields
    licenseNumber: '',
    licenseExpiry: '',
    licenseImage: [] as string[], // Updated to array
    experienceYears: '',
    languages: '',
    bloodGroup: '',
    nationalId: '',
    joinDate: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; url: string }>({
    isOpen: false,
    url: ""
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const data = await userService.getCurrentUser() as any; // Cast to bypass strict type mismatch for now
      setUserData(data);

      const profileData = data.customer || data.admin || data.driver;

      const licenseImages = Array.isArray(data.driver?.licenseImage) ?
        data.driver.licenseImage :
        (data.driver?.licenseImage ? [data.driver.licenseImage] : []);

      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        address: profileData?.address || '',
        city: profileData?.city || '',
        country: profileData?.country || '',
        nationality: profileData?.nationality || '',
        passportNumber: profileData?.passportNumber || '',
        dateOfBirth: profileData?.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profileData?.gender || '',
        // Populate driver fields if applicable
        licenseNumber: data.driver?.licenseNumber || '',
        licenseExpiry: data.driver?.licenseExpiry ? new Date(data.driver.licenseExpiry).toISOString().split('T')[0] : '',
        licenseImage: licenseImages,
        experienceYears: data.driver?.experienceYears?.toString() || '',
        languages: data.driver?.languages ? (Array.isArray(data.driver.languages) ? data.driver.languages.join(', ') : data.driver.languages) : '',
        bloodGroup: data.driver?.bloodGroup || '',
        nationalId: data.driver?.nationalId || '',
        joinDate: data.driver?.joinDate ? new Date(data.driver.joinDate).toISOString().split('T')[0] : '',
      });
    } catch (error: any) {
      toast.error('Failed to load profile data');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateCurrentUser(formData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
      await fetchUserData(); // Refresh data
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleCancel = () => {
    if (userData) {
      const profileData = userData.customer || userData.admin || userData.driver;
      const licenseImages = Array.isArray(userData.driver?.licenseImage) ?
        userData.driver.licenseImage :
        (userData.driver?.licenseImage ? [userData.driver.licenseImage] : []);

      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        address: profileData?.address || '',
        city: profileData?.city || '',
        country: profileData?.country || '',
        nationality: profileData?.nationality || '',
        passportNumber: profileData?.passportNumber || '',
        dateOfBirth: profileData?.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profileData?.gender || '',
        licenseNumber: userData.driver?.licenseNumber || '',
        licenseExpiry: userData.driver?.licenseExpiry ? new Date(userData.driver.licenseExpiry).toISOString().split('T')[0] : '',
        licenseImage: licenseImages,
        experienceYears: userData.driver?.experienceYears?.toString() || '',
        languages: userData.driver?.languages ? (Array.isArray(userData.driver.languages) ? userData.driver.languages.join(', ') : userData.driver.languages) : '',
        bloodGroup: userData.driver?.bloodGroup || '',
        nationalId: userData.driver?.nationalId || '',
        joinDate: userData.driver?.joinDate ? new Date(userData.driver.joinDate).toISOString().split('T')[0] : '',
      });
      setEditMode(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const result = await userService.uploadProfileImage(file);
      toast.success('Profile image updated successfully!');
      if (userData) {
        setUserData({ ...userData, profileImage: result.profileImage });
      }
      updateUserStore({ profileImage: result.profileImage });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLicenseImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    // Simple validation
    for (const file of fileList) {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error(`Invalid file type: ${file.name}. Please upload images or PDFs.`);
        return;
      }
    }

    setUploadingImage(true);
    try {
      if (userData?.driver?.id) {
        const result = await adminDriverService.uploadLicenseDocuments(userData.driver.id, fileList);
        toast.success(`${fileList.length} license document(s) uploaded successfully!`);

        // Backend returns the updated driver object
        const updatedLicenseImages = result.driver?.licenseImage || [];
        setFormData(prev => ({ ...prev, licenseImage: updatedLicenseImages }));

        // Update local userData to keep in sync
        if (userData.driver) {
          setUserData({
            ...userData,
            driver: {
              ...userData.driver,
              licenseImage: updatedLicenseImages
            }
          });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload license documents');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteLicenseImage = async (imageUrl: string) => {
    if (!userData?.driver?.id) return;

    if (!window.confirm("Are you sure you want to delete this license document?")) return;

    setSaving(true);
    try {
      // We filter out the deleted image URL and send the remaining ones
      const remainingImages = formData.licenseImage.filter(url => url !== imageUrl);

      await adminDriverService.updateDriver(userData.driver.id, {
        licenseImage: remainingImages
      });

      toast.success("License document deleted successfully");
      setFormData(prev => ({ ...prev, licenseImage: remainingImages }));

      if (userData.driver) {
        setUserData({
          ...userData,
          driver: {
            ...userData.driver,
            licenseImage: remainingImages
          }
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete license document");
    } finally {
      setSaving(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('profile-image-input')?.click();
  };

  const triggerLicenseInput = () => {
    document.getElementById('license-image-input')?.click();
  };

  const openImageModal = (url: string) => {
    setModalConfig({ isOpen: true, url });
  };

  if (loading) {
    return (
      <div className="h-screen flex overflow-hidden bg-gray-50">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B749DB] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          <div className="flex justify-between items-center mb-6 mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-poppins">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information</p>
            </div>
            <div className="flex gap-3">
              {editMode ? (
                <>
                  <button onClick={handleCancel} disabled={saving} className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                    <FaTimes /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#B749DB] text-white px-6 py-3 rounded-lg hover:bg-[#8B2BB9] transition-colors disabled:opacity-50">
                    <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button onClick={() => setEditMode(true)} className="flex items-center gap-2 bg-[#B749DB] text-white px-6 py-3 rounded-lg hover:bg-[#8B2BB9] transition-colors">
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                      <img
                        src={userData?.profileImage || 'https://i.pravatar.cc/150'}
                        alt={`${formData.firstName} ${formData.lastName}`}
                        className={`w-32 h-32 rounded-full object-cover shadow-lg border-4 border-purple-100 transition-opacity ${uploadingImage ? 'opacity-50' : 'group-hover:opacity-75'}`}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 p-2 rounded-full text-white">
                          <FaCamera size={20} />
                        </div>
                        <span className="text-white text-xs mt-1 font-medium">Change</span>
                      </div>
                      {uploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B749DB]"></div>
                        </div>
                      )}
                      <input id="profile-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploadingImage} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4 font-poppins">{formData.firstName} {formData.lastName}</h2>
                    <p className="text-gray-600 mt-1">{userData?.email}</p>
                    <span className="mt-3 px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">{userData?.role?.toUpperCase()}</span>
                  </div>
                </CardContent>
              </Card>

              {userData?.customer && (
                <Card className="bg-white rounded-xl shadow-sm border-0">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">Account Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Loyalty Points</span>
                        <span className="text-2xl font-bold text-[#B749DB]">{userData.customer.loyaltyPoints || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Account Status</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{userData.status}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} max={new Date().toISOString().split('T')[0]} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                      <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                      <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} disabled={!editMode} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} disabled={!editMode} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {userData?.role === 'driver' && (
                <Card className="bg-white rounded-xl shadow-sm border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">Driver & License Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                        <input type="text" name="licenseNumber" value={formData.licenseNumber} disabled={true} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry</label>
                        <input type="date" name="licenseExpiry" value={formData.licenseExpiry} disabled={true} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIC / National ID</label>
                        <input type="text" name="nationalId" value={formData.nationalId} disabled={true} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                        <input type="date" value={formData.joinDate} disabled={true} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Documents</label>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {formData.licenseImage.map((url, idx) => (
                              <div key={idx} className="relative group aspect-square border-2 border-purple-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <img
                                  src={url}
                                  alt={`License Document ${idx + 1}`}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => openImageModal(url)}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                                  <button
                                    type="button"
                                    onClick={() => openImageModal(url)}
                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                                    title="View"
                                  >
                                    <FaEye size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLicenseImage(url)}
                                    className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Upload New Button */}
                            <button
                              type="button"
                              onClick={triggerLicenseInput}
                              disabled={uploadingImage}
                              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-purple-200 rounded-xl text-purple-400 hover:border-purple-400 hover:text-purple-600 transition-all hover:bg-purple-50 disabled:opacity-50"
                            >
                              {uploadingImage ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                              ) : (
                                <>
                                  <FaPlus size={20} className="mb-2" />
                                  <span className="text-xs font-medium">Add New</span>
                                </>
                              )}
                            </button>
                          </div>

                          <input
                            id="license-image-input"
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            className="hidden"
                            onChange={handleLicenseImageChange}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 font-poppins">Security</h3>
                    <button onClick={() => setShowPasswordSection(!showPasswordSection)} className="flex items-center gap-2 text-[#B749DB] hover:text-[#8B2BB9] transition-colors">
                      <FaLock /> {showPasswordSection ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  {showPasswordSection && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter current password" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter new password (min. 8 characters)" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Confirm new password" />
                      </div>
                      <button onClick={handlePasswordChange} className="w-full bg-[#B749DB] text-white px-6 py-3 rounded-lg hover:bg-[#8B2BB9] transition-colors">Update Password</button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <ImageModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        imageUrl={modalConfig.url}
      />

      <ToastContainer />
    </div>
  );
};

export default UserProfile;
