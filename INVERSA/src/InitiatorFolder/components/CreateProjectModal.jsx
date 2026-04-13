import { useState } from "react";
import { FiX } from "react-icons/fi";
import categories from "../../Datajson/categories.json";
import genres from "../../Datajson/genres.json";

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const initialState = {
    title: "",
    description: "",
    abstract: "",
    category: categories.categories[0]?.id || "",
    genre: genres.genres[0]?.id || "",
    status: "open",
    backgroundImage: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState("");

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
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Project title is required");
      return;
    }

    onCreate({
      ...formData,
      isTeamProject: false,
    });

    setFormData(initialState);
    setImagePreview("");
    onClose();
  };

  const handleClose = () => {
    setFormData(initialState);
    setImagePreview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-light-background dark:bg-dark-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary">
            Create New Solo Project
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short summary of your project..."
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent resize-none"
            />
          </div>

          {/* CATEGORY & GENRE ROW */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                {categories.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                {genres.genres.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* IMAGE URL */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Cover Image URL
            </label>
            <input
              type="text"
              name="backgroundImage"
              placeholder="https://example.com/image.jpg"
              value={formData.backgroundImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Or Upload Cover Image
            </label>

            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-light-accent/30 dark:border-dark-accent/30 rounded-xl cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-accent/5 dark:bg-dark-accent/5">
              <div className="flex flex-col items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">
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

          {/* PREVIEW */}
          {imagePreview && (
            <div>
              <p className="text-sm font-medium text-light-primary dark:text-dark-primary mb-2">Preview:</p>
              <div
                className="w-full h-48 rounded-lg bg-cover bg-center shadow-md"
                style={{
                  backgroundImage: `url(${imagePreview})`,
                }}
              />
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4 border-t border-light-border dark:border-dark-border">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              Create Project
            </button>
            <button
              type="button"
              onClick={handleClose}
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

export default CreateProjectModal;
