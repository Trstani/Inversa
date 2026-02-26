import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Button from './Button';

const CollaborationRequestModal = ({ projectTitle, onSubmit, onClose }) => {
  const [selectedRole, setSelectedRole] = useState('writer');
  const [message, setMessage] = useState('');

  const roles = [
    { id: 'writer', name: 'Writer', description: 'Write and create content' },
    { id: 'editor', name: 'Editor', description: 'Edit and improve content' },
    { id: 'illustrator', name: 'Illustrator', description: 'Create illustrations' },
    { id: 'proofreader', name: 'Proofreader', description: 'Check for errors' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedRole);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Request to Join</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <p className="text-light-secondary dark:text-dark-secondary mb-6">
          Request to join <span className="font-semibold">{projectTitle}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Your Role</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center p-3 border border-light-border dark:border-dark-border rounded-lg cursor-pointer hover:bg-light-surface dark:hover:bg-dark-surface transition"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={selectedRole === role.id}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <p className="font-medium">{role.name}</p>
                    <p className="text-xs text-light-secondary dark:text-dark-secondary">
                      {role.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Message (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the initiator why you want to join..."
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-sm"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Send Request
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

export default CollaborationRequestModal;
