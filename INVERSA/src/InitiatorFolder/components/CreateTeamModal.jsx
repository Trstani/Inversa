import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiX, FiImage } from 'react-icons/fi';
import Button from '../../components/Button';
import { createTeam } from '../../utils/dataManager/teamManager';

const CreateTeamModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const initialState = {
    title: '',
    description: '',
    backgroundImage: '',
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        backgroundImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Team name is required');
      return;
    }

    setLoading(true);
    try {
      await createTeam(formData, user.id);

      alert('Team created successfully!');
      setFormData(initialState);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-light-accent/20 dark:border-dark-accent/20 bg-light-surface dark:bg-dark-surface">
          <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary">
            Create New Team
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 rounded transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Team Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter team name"
              className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded-lg text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is your team about?"
              rows="3"
              className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded-lg text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent resize-none"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Team Cover Image (Optional)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-light-accent/30 dark:border-dark-accent/30 rounded-lg cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-background dark:bg-dark-background">
              <div className="flex flex-col items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">
                <FiImage className="w-6 h-6 mb-2" />
                <span className="font-medium">Click to upload</span>
                <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Preview */}
          {formData.backgroundImage && (
            <div>
              <p className="text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Preview
              </p>
              <div
                className="w-full h-40 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${formData.backgroundImage})` }}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-light-accent/20 dark:border-dark-accent/20">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary hover:bg-light-accent/10 dark:hover:bg-dark-accent/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
