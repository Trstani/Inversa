import { useState, useEffect } from "react";

import {
  FiArrowUp,
  FiArrowDown,
  FiSave,
} from "react-icons/fi";

import { apiClient } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const ImageSection = ({
  section,
  canEdit,
  onDelete,
  onUpdate,
  onUpload,
  onSave,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {

  const { user } = useAuth();

  /*
  =========================
  STATES
  =========================
  */

  const [isSaving, setIsSaving] =
    useState(false);

  const [hasChanges, setHasChanges] =
    useState(false);

  const [
    lastSavedCaption,
    setLastSavedCaption,
  ] = useState(
    section.caption || ""
  );

  const [
    lastSavedImageUrl,
    setLastSavedImageUrl,
  ] = useState(
    section.image_url || ""
  );

  const [imageUrl, setImageUrl] =
    useState(
      section.image_url || ""
    );

  const [caption, setCaption] =
    useState(
      section.caption || ""
    );

  const [isLocked, setIsLocked] =
    useState(
      section.locked_by &&
      section.locked_by !== user?.id
    );

  const [locking, setLocking] =
    useState(false);



  /*
  =========================
  LOCK
  =========================
  */

  const handleLock =
    async () => {

      if (
        !canEdit ||
        isLocked ||
        locking
      ) {
        return;
      }

      try {

        setLocking(true);

        await apiClient.sections.lock(
          section.id
        );

        setIsLocked(false);

      } catch (error) {

        console.error(error);

        setIsLocked(true);

      } finally {

        setLocking(false);

      }
    };

  /*
  =========================
  UNLOCK
  =========================
  */

  const handleUnlock =
    async () => {

      try {

        await apiClient.sections.unlock(
          section.id
        );

      } catch (error) {

        console.error(
          "Unlock failed:",
          error
        );

      }
    };

  /*
  =========================
  CLEANUP
  =========================
  */

  useEffect(() => {

    return () => {

      handleUnlock();

    };

  }, []);

  /*
  =========================
  CAPTION
  =========================
  */

  const handleCaptionChange =
  (e) => {

    const newCaption =
      e.target.value;

    setCaption(newCaption);

    onUpdate(section.id, {
      caption: newCaption,
    });

    setHasChanges(

      newCaption !==
        lastSavedCaption ||

      imageUrl !==
        lastSavedImageUrl

    );
  };
  /*
  =========================
  IMAGE UPLOAD
  =========================
  */

  const handleImageUpload =
    async (file) => {

      await handleLock();

      onUpload(section.id, file);

      setHasChanges(true);
    };

  /*
  =========================
  IMAGE URL
  =========================
  */

 const handleImageUrlChange =
  (e) => {

    const newUrl =
      e.target.value;

    setImageUrl(newUrl);

    onUpdate(section.id, {
      image_url: newUrl,
    });

    setHasChanges(

      newUrl !==
        lastSavedImageUrl ||

      section.caption !==
        lastSavedCaption

    );
  };

  /*
  =========================
  SAVE
  =========================
  */

  const handleSave =
    async () => {

      if (!hasChanges) {
        return;
      }

      setIsSaving(true);

      try {

        await onSave(
          section.id,
          {
            caption:
              caption,

            image_url:
              imageUrl,
          }
        );

        setLastSavedCaption(
          caption || ""
        );

        setLastSavedImageUrl(
          imageUrl || ""
        );

        onUpdate(section.id, {
          image_url: imageUrl,
        });

        setHasChanges(false);

        await handleUnlock();

      } catch (error) {

        console.error(
          "Failed to save section:",
          error
        );

        alert(
          "Failed to save section"
        );

      } finally {

        setIsSaving(false);

      }
    };

  /*
  =========================
  BUTTON STYLE
  =========================
  */

  const buttonClass =
    "border rounded-lg py-2 flex items-center justify-center hover:bg-white dark:hover:bg-dark-surface disabled:opacity-40 disabled:cursor-not-allowed";

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="card p-6 relative">

      {/* LOCK OVERLAY */}

      {isLocked && (

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">

          <div className="bg-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
            Section is being edited
          </div>

        </div>

      )}

      <div className="flex gap-6">

        {/* LEFT */}

        <div className="flex-1 flex flex-col gap-4">

          {/* IMAGE PREVIEW */}

          {imageUrl ? (

            <div className="w-full h-[300px] rounded-xl overflow-hidden">

              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />

            </div>

          ) : (

            <div className="w-full h-[300px] rounded-xl border-2 border-dashed border-light-border dark:border-dark-border flex items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">

              No image selected

            </div>

          )}

          {/* UPLOAD */}

          {canEdit && !isLocked && (

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-surface dark:bg-dark-surface">

              <div className="flex flex-col items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">

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
                className="hidden"

                onChange={(e) =>
                  handleImageUpload(
                    e.target.files[0]
                  )
                }
              />

            </label>

          )}

          {/* URL INPUT */}

          {canEdit && !isLocked && (

            <input
              type="text"
              placeholder="Or paste image URL..."
              value={imageUrl}
              onFocus={handleLock}
              onChange={handleImageUrlChange}
              className="w-full p-3 border rounded-lg bg-white dark:bg-dark-surface"
            />

          )}

        </div>

        {/* RIGHT */}

        {canEdit && !isLocked && (

          <div className="w-52 flex flex-col gap-4">

            {/* CAPTION */}

            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption || ""}
              onFocus={handleLock}
              onChange={handleCaptionChange}
              className="w-full p-2 border rounded-lg bg-white dark:bg-dark-surface"
            />

            {/* SAVE */}

            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-4 py-2.5 ${
                hasChanges && !isSaving
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50"
                  : "bg-gray-400 cursor-not-allowed text-gray-600"
              }`}
            >

              <FiSave />

              {isSaving
                ? "Saving..."
                : "Save"}

            </button>

            {/* MOVE */}

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className={buttonClass}
              >
                <FiArrowUp />
              </button>

              <button
                onClick={onMoveDown}
                disabled={isLast}
                className={buttonClass}
              >
                <FiArrowDown />
              </button>

            </div>

            {/* DELETE */}

            <button
              onClick={() =>
                onDelete(section.id)
              }
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg text-sm px-4 py-2.5"
            >
              ✕
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default ImageSection;