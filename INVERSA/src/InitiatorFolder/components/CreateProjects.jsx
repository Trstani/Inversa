import { useState } from "react";
import Button from "../../components/Button";
import categories from "../../Datajson/categories.json";
import genres from "../../Datajson/genres.json";

const CreateProjects = ({ onCreate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        backgroundImage: reader.result, // base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Project title is required");
      return;
    }

    onCreate(formData);

    setFormData(initialState);
    setShowCreateForm(false);
  };

  return (
    <>
      <div className="mb-8">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
        >
          Create New Project
        </Button>
      </div>

      {showCreateForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Create New Project
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
              />
            </div>

            {/* ABSTRACT */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Abstract
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short summary of your project..."
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
              />
            </div>

            {/* CATEGORY & GENRE ROW */}
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
                >
                  {categories.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
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
              <label className="block text-sm font-medium mb-2">
                Cover Image URL
              </label>
              <input
                type="text"
                name="backgroundImage"
                placeholder="https://example.com/image.jpg"
                value={formData.backgroundImage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
              />
            </div>

            {/* FILE UPLOAD */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Or Upload Cover Image
              </label>

              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-surface dark:bg-dark-surface">

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
            {formData.backgroundImage && (
              <div>
                <p className="text-sm mb-2">Preview:</p>
                <div
                  className="w-full h-56 rounded-lg bg-cover bg-center shadow"
                  style={{
                    backgroundImage: `url(${formData.backgroundImage})`,
                  }}
                />
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-4 pt-2">
              <Button type="submit">Create Project</Button>
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-400 hover:bg-gray-500"
              >
                Cancel
              </Button>
            </div>

          </form>
        </div>
      )}
    </>
  );
};

export default CreateProjects;
