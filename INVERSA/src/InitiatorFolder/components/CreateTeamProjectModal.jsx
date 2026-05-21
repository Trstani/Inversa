import React, {
  useState,
} from 'react';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  FiX,
} from 'react-icons/fi';

import Button
  from '../../components/Button';

import categories
  from '../../Datajson/categories.json';

import genres
  from '../../Datajson/genres.json';

import {
  apiClient,
} from '../../api/client';

const CreateTeamProjectModal = ({
  isOpen,
  onClose,
  onSuccess,
  teamId,
}) => {

  /*
  =========================
  AUTH
  =========================
  */

  const { user } =
    useAuth();

  /*
  =========================
  STATES
  =========================
  */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const initialState = {

    title: '',

    description: '',

    category:
      categories.categories[0]?.id || '',

    genre:
      genres.genres[0]?.id || '',

    backgroundImage: '',
  };

  const [
    formData,
    setFormData,
  ] = useState(initialState);

  /*
  =========================
  INPUT CHANGE
  =========================
  */

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      );
    };

  /*
  =========================
  IMAGE UPLOAD
  =========================
  */

  const handleImageUpload =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = (
        event
      ) => {

        const img =
          new Image();

        img.onload = () => {

          const canvas =
            document.createElement(
              'canvas'
            );

          const ctx =
            canvas.getContext(
              '2d'
            );

          const MAX_WIDTH = 1200;

          const scale =
            MAX_WIDTH /
            img.width;

          canvas.width =
            MAX_WIDTH;

          canvas.height =
            img.height * scale;

          ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const compressed =
            canvas.toDataURL(
              'image/jpeg',
              0.7
            );

          setFormData(
            (prev) => ({
              ...prev,
              backgroundImage:
                compressed,
            })
          );
        };

        img.src =
          event.target.result;
      };

      reader.readAsDataURL(
        file
      );
    };

  /*
  =========================
  SUBMIT
  =========================
  */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !formData.title.trim()
      ) {

        alert(
          'Project name is required'
        );

        return;
      }

      setLoading(true);

      try {

        /*
        =========================
        PROJECT DATA
        =========================
        */

        const projectData = {

          title:
            formData.title,

          description:
            formData.description,

          category_id:
            formData.category,

          genre_id:
            formData.genre,

          background_image:
            formData.backgroundImage,

          is_team_project: true,

          team_id: teamId,
        };

        /*
        =========================
        CREATE PROJECT
        =========================
        */

        const response =
          await apiClient.projects.create(
            projectData
          );

        if (response.success) {

          alert(
            'Project created successfully!'
          );

          setFormData(
            initialState
          );

          onSuccess?.();

          onClose();
        }

      } catch (error) {

        console.error(
          'Error creating project:',
          error
        );

        alert(
          'Failed to create project'
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================
  CLOSE
  =========================
  */

  const handleClose =
    () => {

      setFormData(
        initialState
      );

      onClose();
    };

  /*
  =========================
  HIDDEN
  =========================
  */

  if (!isOpen) {
    return null;
  }

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div
      className="
        fixed inset-0

        bg-black/50

        flex items-center
        justify-center

        z-50

        p-4
      "
    >

      <div
        className="
          bg-light-surface
          dark:bg-dark-surface

          rounded-2xl

          max-w-2xl
          w-full

          max-h-[90vh]

          overflow-y-auto
        "
      >

        {/* HEADER */}

        <div
          className="
            sticky top-0

            flex items-center
            justify-between

            p-6

            border-b
            border-light-accent/20
            dark:border-dark-accent/20

            bg-light-surface
            dark:bg-dark-surface
          "
        >

          <h2
            className="
              text-2xl font-bold

              text-light-primary
              dark:text-dark-primary
            "
          >
            Create Team Project
          </h2>

          <button
            onClick={handleClose}
            className="
              p-2

              rounded-lg

              hover:bg-light-accent/10
              dark:hover:bg-dark-accent/10

              transition
            "
          >

            <FiX className="w-5 h-5" />

          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* TITLE */}

          <div>

            <label
              className="
                block text-sm font-medium

                text-light-primary
                dark:text-dark-primary

                mb-2
              "
            >
              Project Name
            </label>

            <input
              type="text"

              name="title"

              value={formData.title}

              onChange={handleChange}

              placeholder="Enter project name"

              className="
                w-full

                px-4 py-2

                bg-light-background
                dark:bg-dark-background

                border
                border-light-accent/20
                dark:border-dark-accent/20

                rounded-lg

                text-light-primary
                dark:text-dark-primary

                placeholder-light-secondary
                dark:placeholder-dark-secondary

                focus:outline-none

                focus:border-light-accent
                dark:focus:border-dark-accent
              "
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label
              className="
                block text-sm font-medium

                text-light-primary
                dark:text-dark-primary

                mb-2
              "
            >
              Description
            </label>

            <textarea
              name="description"

              value={formData.description}

              onChange={handleChange}

              rows="4"

              placeholder="Short summary of your project..."

              className="
                w-full

                px-4 py-2

                bg-light-background
                dark:bg-dark-background

                border
                border-light-accent/20
                dark:border-dark-accent/20

                rounded-lg

                text-light-primary
                dark:text-dark-primary

                placeholder-light-secondary
                dark:placeholder-dark-secondary

                focus:outline-none

                focus:border-light-accent
                dark:focus:border-dark-accent

                resize-none
              "
            />

          </div>

          {/* CATEGORY + GENRE */}

          <div className="grid grid-cols-2 gap-4">

            {/* CATEGORY */}

            <div>

              <label
                className="
                  block text-sm font-medium

                  text-light-primary
                  dark:text-dark-primary

                  mb-2
                "
              >
                Category
              </label>

              <select
                name="category"

                value={formData.category}

                onChange={handleChange}

                className="
                  w-full

                  px-4 py-2

                  bg-light-background
                  dark:bg-dark-background

                  border
                  border-light-accent/20
                  dark:border-dark-accent/20

                  rounded-lg

                  text-light-primary
                  dark:text-dark-primary

                  focus:outline-none

                  focus:border-light-accent
                  dark:focus:border-dark-accent
                "
              >

                {categories.categories.map(
                  (cat) => (

                    <option
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* GENRE */}

            <div>

              <label
                className="
                  block text-sm font-medium

                  text-light-primary
                  dark:text-dark-primary

                  mb-2
                "
              >
                Genre
              </label>

              <select
                name="genre"

                value={formData.genre}

                onChange={handleChange}

                className="
                  w-full

                  px-4 py-2

                  bg-light-background
                  dark:bg-dark-background

                  border
                  border-light-accent/20
                  dark:border-dark-accent/20

                  rounded-lg

                  text-light-primary
                  dark:text-dark-primary

                  focus:outline-none

                  focus:border-light-accent
                  dark:focus:border-dark-accent
                "
              >

                {genres.genres.map(
                  (g) => (

                    <option
                      key={g.id}
                      value={g.id}
                    >
                      {g.name}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

          {/* IMAGE URL */}

          <div>

            <label
              className="
                block text-sm font-medium

                text-light-primary
                dark:text-dark-primary

                mb-2
              "
            >
              Cover Image URL
            </label>

            <input
              type="text"

              name="backgroundImage"

              placeholder="https://example.com/image.jpg"

              value={formData.backgroundImage}

              onChange={handleChange}

              className="
                w-full

                px-4 py-2

                bg-light-background
                dark:bg-dark-background

                border
                border-light-accent/20
                dark:border-dark-accent/20

                rounded-lg

                text-light-primary
                dark:text-dark-primary

                placeholder-light-secondary
                dark:placeholder-dark-secondary

                focus:outline-none

                focus:border-light-accent
                dark:focus:border-dark-accent
              "
            />

          </div>

          {/* FILE UPLOAD */}

          <div>

            <label
              className="
                block text-sm font-medium

                text-light-primary
                dark:text-dark-primary

                mb-2
              "
            >
              Or Upload Cover Image
            </label>

            <label
              className="
                flex flex-col
                items-center
                justify-center

                w-full
                h-40

                border-2 border-dashed

                border-light-accent/30
                dark:border-dark-accent/30

                rounded-xl

                cursor-pointer

                hover:border-light-accent
                dark:hover:border-dark-accent

                transition-colors

                bg-light-accent/5
                dark:bg-dark-accent/5
              "
            >

              <div
                className="
                  flex flex-col
                  items-center
                  justify-center

                  text-sm

                  text-light-secondary
                  dark:text-dark-secondary
                "
              >

                <span className="font-medium">
                  Click to upload
                </span>

                <span className="text-xs mt-1">
                  PNG, JPG up to 5MB
                </span>

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

              <p
                className="
                  text-sm font-medium

                  text-light-primary
                  dark:text-dark-primary

                  mb-2
                "
              >
                Preview
              </p>

              <img
                src={formData.backgroundImage}
                alt="preview"
                className="
                  w-full
                  h-48

                  object-cover

                  rounded-xl
                "
              />

            </div>

          )}

          {/* BUTTONS */}

          <div
            className="
              flex gap-3

              pt-4

              border-t
              border-light-accent/20
              dark:border-dark-accent/20
            "
          >

            <Button
              type="submit"

              disabled={loading}

              className="flex-1"
            >

              {loading
                ? 'Creating...'
                : 'Create Project'}

            </Button>

            <Button
              type="button"

              onClick={handleClose}

              disabled={loading}

              className="
                flex-1

                bg-light-surface
                dark:bg-dark-surface

                text-light-primary
                dark:text-dark-primary

                hover:bg-light-accent/10
                dark:hover:bg-dark-accent/10
              "
            >
              Cancel
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateTeamProjectModal;