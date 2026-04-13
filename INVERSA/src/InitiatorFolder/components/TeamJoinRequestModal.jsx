import { useState } from "react";
import { FiX } from "react-icons/fi";

const TeamJoinRequestModal = ({ isOpen, onClose, team, onSubmit }) => {
  const [formData, setFormData] = useState({
    role: "writer",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason.trim()) {
      alert("Please provide a reason for joining");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ role: "writer", reason: "" });
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-light-background dark:bg-dark-background rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-light-border dark:border-dark-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary">
            Request to Join Team
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Team Info */}
        <div className="p-6 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
          <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">
            Requesting to join:
          </p>
          <p className="text-lg font-semibold text-light-primary dark:text-dark-primary">
            {team?.title}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Requested Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            >
              <option value="writer">Writer</option>
              <option value="illustrator">Illustrator</option>
              <option value="editor">Editor</option>
            </select>
            <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1">
              Select the role you want to have in this team
            </p>
          </div>

          {/* REASON */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Reason for Joining *
            </label>
            <textarea
              name="reason"
              rows="4"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Tell the team owner why you want to join..."
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent resize-none"
            />
            <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1">
              {formData.reason.length}/200 characters
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4 border-t border-light-border dark:border-dark-border">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary rounded-lg font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamJoinRequestModal;
