import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Button from '../Button';

const CreateChapterModal = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Chapter title is required');
      return;
    }
    onSubmit({ title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Create New Chapter</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Chapter Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chapter title"
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter chapter description"
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-sm"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Create Chapter
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 hover:bg-gray-500"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChapterModal;
