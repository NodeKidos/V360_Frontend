import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaEdit } from 'react-icons/fa'; // Import the Edit icon from react-icons
import { IoArrowBack } from 'react-icons/io5'; // Import the back arrow icon from react-icons

const UserProfile = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Sample user data (you can fetch this from your state or API)
  const [user, setUser] = useState({
    name: "Jacqueline Fernando",
    email: "jack@gmail.com",
    phone: "+1 234 567 890",
    address: "1234 Main St, City, State, Country",
    profileImage: "https://i.pravatar.cc/100", // You can replace this with dynamic image
    gender: "Female",
    passportNo: "X1234567",
    country: "Sri Lanka",
    age: 30,
    rewardPoints: 1200, // Reward or loyalty points
    trips: 25 // Number of trips
  });

  const [editMode, setEditMode] = useState(false); // Manage edit mode state

  // Handle editing the profile
  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Back Button outside the profile box */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/user-dashboard')} // Navigate to User Dashboard
          className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
        >
          <IoArrowBack className="text-[#B749DB] text-lg" /> {/* Back arrow icon */}
          Back
        </button>
      </div>

      {/* Profile Content */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* Profile Heading Section with Title on Left and Edit Icon on Right */}
        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row">
          <h1 className="text-4xl font-bold text-left text-purple-700 font-poppins">User Profile</h1>
          <button
            onClick={handleEditClick}
            className="py-3 px-8 mt-4 sm:mt-0 rounded-lg hover:bg-purple-100 transition duration-300 flex items-center gap-2 font-poppins"
          >
            <FaEdit className="text-purple-500 text-lg" /> {/* Edit Icon */}
            {editMode ? 'Save' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile and Button Section (Two columns layout) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-8 mb-4 sm:mb-0">
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold text-purple-800 font-poppins">
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="bg-gray-100 p-2 rounded-lg w-full sm:w-auto"
                  />
                ) : (
                  user.name
                )}
              </h2>
              <p className="text-lg text-gray-600 font-poppins">
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="bg-gray-100 p-2 rounded-lg w-full sm:w-auto"
                  />
                ) : (
                  user.email
                )}
              </p>
              <p className="text-lg text-gray-600 font-poppins">
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    className="bg-gray-100 p-2 rounded-lg w-full sm:w-auto"
                  />
                ) : (
                  user.phone
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-purple-800 mb-4 font-poppins">Additional Information</h3>
          <ul className="space-y-3 text-gray-700 font-poppins">
            <li>
              <strong>Gender:</strong> {editMode ? (
                <input
                  type="text"
                  name="gender"
                  value={user.gender}
                  onChange={handleInputChange}
                  className="bg-gray-100 p-2 rounded-lg w-full sm:w-auto"
                />
              ) : (
                user.gender
              )}
            </li>
            <li>
              <strong>Passport Number:</strong> {editMode ? (
                <input
                  type="text"
                  name="passportNo"
                  value={user.passportNo}
                  onChange={handleInputChange}
                  className="bg-gray-100 p-2 rounded-lg w-full sm:w-auto"
                />
              ) : (
                user.passportNo
              )}
            </li>
            <li>
              <strong>Country:</strong> {editMode ? (
                <input
                  type="text"
                  name="country"
                  value={user.country}
                  onChange={handleInputChange}
                  className="bg-gray-100 p-2 rounded-lg w-full sm:w-auto"
                />
              ) : (
                user.country
              )}
            </li>
            <li>
              <strong>Age:</strong> {editMode ? (
                <input
                  type="number"
                  name="age"
                  value={user.age}
                  onChange={handleInputChange}
                  className="bg-gray-100 p-2 rounded-lg w-full sm:w-auto"
                />
              ) : (
                user.age
              )}
            </li>
          </ul>
        </div>

        {/* Reward Points and Number of Trips Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-purple-800 mb-4 font-poppins">Rewards & Trips</h3>
          <ul className="space-y-3 text-gray-700 font-poppins">
            <li>
              <strong>Loyalty Points:</strong> {user.rewardPoints}
            </li>
            <li>
              <strong>Number of Trips:</strong> {user.trips}
            </li>
          </ul>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-purple-800 mb-4 font-poppins">Address</h3>
          {editMode ? (
            <textarea
              name="address"
              value={user.address}
              onChange={handleInputChange}
              className="bg-gray-100 p-2 rounded-lg w-full"
            />
          ) : (
            <p className="text-gray-700 font-poppins">{user.address}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
