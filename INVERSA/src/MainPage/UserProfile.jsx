import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCamera, FiMail, FiCalendar, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, saveUsers } from '../utils/userManager/userStorage';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfileData();
  }, [user, navigate]);

  const loadProfileData = () => {
    try {
      const users = getAllUsers();
      const userData = users.find(u => u.id === user.id);
      if (userData) {
        setProfileData(userData);
        setEditData(userData);
        // Load profile image from localStorage
        const savedImage = localStorage.getItem(`profile_image_${user.id}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem(`profile_image_${user.id}`, imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    try {
      const users = getAllUsers();
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, ...editData } : u
      );
      saveUsers(updatedUsers);
      setProfileData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-light-secondary dark:text-dark-secondary">Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-light-secondary dark:text-dark-secondary">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-light-accent dark:text-dark-accent hover:opacity-80 mb-6"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Profile Card */}
        <div className="card p-8 bg-light-surface dark:bg-dark-surface">
          {/* Profile Header with Image */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-light-accent to-light-accent/50 dark:from-dark-accent dark:to-dark-accent/50 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {profileData.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-light-accent dark:bg-dark-accent text-white rounded-full cursor-pointer hover:opacity-90 transition">
                <FiCamera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary mb-2">
                {profileData.name}
              </h1>
              <p className="text-light-secondary dark:text-dark-secondary flex items-center gap-2 justify-center sm:justify-start mb-4">
                <FiMail className="w-4 h-4" />
                {profileData.email}
              </p>
              <p className="text-sm text-light-secondary dark:text-dark-secondary flex items-center gap-2 justify-center sm:justify-start">
                <FiCalendar className="w-4 h-4" />
                Joined {new Date(profileData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Edit Section */}
          <div className="border-t border-light-accent/20 dark:border-dark-accent/20 pt-8">
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-2">
                    Full Name
                  </label>
                  <p className="text-light-primary dark:text-dark-primary">{profileData.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-2">
                    Email
                  </label>
                  <p className="text-light-primary dark:text-dark-primary">{profileData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-2">
                    Role
                  </label>
                  <p className="text-light-primary dark:text-dark-primary capitalize">{profileData.role}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded-lg text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded-lg text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(profileData);
                    }}
                    className="flex-1 px-4 py-2 bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-secondary dark:text-dark-secondary rounded-lg hover:bg-light-secondary/30 dark:hover:bg-dark-secondary/30 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
