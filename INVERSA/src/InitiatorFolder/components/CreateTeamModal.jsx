import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiX, FiImage } from 'react-icons/fi';
import Button from '../../components/Button';
import { apiClient } from '../../api/client';
import { supabase } from "../../lib/supabase";
import { validateImage } from "../../utils/imageValidation";
import { dismissToast, showError, showSuccess } from '../../utils/toast';

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

  const handleImageUpload = async (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const validation =
      validateImage(
        file
      );

    if (
      !validation.valid
    ) {
      showError(
        validation.message
      );

      return;
    } 

    try {

      const reader =
        new FileReader();

      reader.onload =
        (event) => {

          const img =
            new Image();

          img.onload =
            async () => {

              try {

                const canvas =
                  document.createElement(
                    "canvas"
                  );

                const ctx =
                  canvas.getContext(
                    "2d"
                  );

                const MAX_WIDTH =
                  1200;

                let width =
                  img.width;

                let height =
                  img.height;

                if (
                  width >
                  MAX_WIDTH
                ) {

                  const scale =
                    MAX_WIDTH /
                    width;

                  width =
                    MAX_WIDTH;

                  height =
                    height *
                    scale;

                }

                canvas.width =
                  width;

                canvas.height =
                  height;

                ctx.drawImage(
                  img,
                  0,
                  0,
                  width,
                  height
                );

                canvas.toBlob(

                  async (
                    blob
                  ) => {

                    if (
                      !blob
                    ) return;

                    const fileName =
                      `${Date.now()}-${file.name}`;

                    const {
                      error
                    } =
                      await supabase
                        .storage
                        .from(
                          "images"
                        )
                        .upload(
                          fileName,
                          blob
                        );

                    if (
                      error
                    ) {

                      console.error(
                        error
                      );

                      showError(
                        "Upload failed"
                      );

                      return;

                    }

                    const {
                      data
                    } =
                      supabase
                        .storage
                        .from(
                          "images"
                        )
                        .getPublicUrl(
                          fileName
                        );

                    const imageUrl =
                      data.publicUrl;

                    setFormData(
                      prev => ({

                        ...prev,

                        backgroundImage:
                          imageUrl

                      })
                    );

                  },

                  "image/jpeg",
                  0.7

                );

              }

              catch (
              error
              ) {

                console.error(
                  error
                );

              }

            };

          img.src =
            event.target.result;

        };

      reader.readAsDataURL(
        file
      );

    }

    catch (
    error
    ) {

      console.error(
        error
      );

      showError(
        "Image upload failed"
      );

    }

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !formData.title.trim()
      ) {

        showError(
          'Team name is required'
        );

        return;
      }

      setLoading(true);

      try {

        const response =
          await apiClient.teams.create({

            title:
              formData.title,

            description:
              formData.description,

            background_image:
              formData.backgroundImage,
          });

        if (response.success) {

          showSuccess(
            'Team created successfully!'
          );

          setFormData(
            initialState
          );

          onSuccess?.();

          onClose();
        }

      } catch (error) {

        console.error(
          'Error creating team:',
          error
        );

        showError(
          'Failed to create team'
        );

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
              Team Background image (optional)
            </label>

            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-light-accent/30 dark:border-dark-accent/30 rounded-xl cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-accent/5 dark:bg-dark-accent/5">
              <div className="flex flex-col items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">
                <span className="font-medium">Click to upload</span>
                <span className="text-xs mt-1">PNG, JPG up to 2MB</span>
              </div>

              <input
                type="file"
                accept=".jpg,.jpeg,.png"
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
          <div className="flex gap-3 pt-4 border-t border-light-border dark:border-dark-border">
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
              className="flex-1 px-4 py-2 border border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary rounded-lg font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition"
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
