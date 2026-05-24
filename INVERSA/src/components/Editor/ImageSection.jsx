import { useState, useEffect } from "react";
import { FiArrowUp, FiArrowDown, FiSave } from "react-icons/fi";
import { apiClient } from "../../api/client";
import { socket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";

const ImageSection = ({
  section,
  canEdit,
  onDelete,
  onUpdate,
  onSave,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedCaption, setLastSavedCaption] = useState(section.caption || "");
  const [lastSavedImageUrl, setLastSavedImageUrl] = useState(section.image_url || "");
  const [imageUrl, setImageUrl] = useState(section.image_url || "");
  const [caption, setCaption] = useState(section.caption || "");
  const [isLocked, setIsLocked] = useState(section.locked_by && section.locked_by !== user?.id);
  const [locking, setLocking] = useState(false);

  // LOCK
  const handleLock = async () => {
    if (!canEdit || isLocked || locking) return;
    try {
      setLocking(true);
      await apiClient.sections.lock(section.id);
      socket.emit("lock_section", { sectionId: section.id, userId: user?.id });
    } catch (error) {
      console.error(error);
      setIsLocked(true);
    } finally {
      setLocking(false);
    }
  };

  // UNLOCK
  const handleUnlock = async () => {
    try {
      await apiClient.sections.unlock(section.id);
      socket.emit("unlock_section", { sectionId: section.id });
    } catch (error) {
      console.error(error);
    }
  };

  // SOCKET
  useEffect(() => {
    const handleLocked = ({ sectionId, userId }) => {
      if (sectionId === section.id && Number(userId) !== Number(user?.id)) setIsLocked(true);
    };
    const handleUnlocked = ({ sectionId }) => {
      if (sectionId === section.id) setIsLocked(false);
    };
    const handleUpdated = ({ sectionId, image_url, caption }) => {
      if (sectionId === section.id) {
        setImageUrl(image_url || "");
        setCaption(caption || "");
      }
    };

    socket.on("section_locked", handleLocked);
    socket.on("section_unlocked", handleUnlocked);
    socket.on("section_updated", handleUpdated);

    return () => {
      socket.off("section_locked", handleLocked);
      socket.off("section_unlocked", handleUnlocked);
      socket.off("section_updated", handleUpdated);
    };
  }, [section.id, user?.id]);

  useEffect(() => {
    return () => { handleUnlock(); };
  }, []);

  // INPUT HANDLERS
  const handleCaptionChange = (e) => {
    const value = e.target.value;
    setCaption(value);
    onUpdate(section.id, { caption: value });
    setHasChanges(value !== lastSavedCaption || imageUrl !== lastSavedImageUrl);
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setImageUrl(value);
    onUpdate(section.id, { image_url: value });
    setHasChanges(true);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    await handleLock();
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setImageUrl(imageData);
      onUpdate(section.id, { image_url: imageData });
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  // SAVE
  const handleSave = async () => {
    if (!hasChanges) return;
    try {
      setIsSaving(true);
      await onSave(section.id, { caption, image_url: imageUrl });
      socket.emit("section_updated", {
        sectionId: section.id,
        image_url: imageUrl,
        caption,
      });
      setLastSavedCaption(caption);
      setLastSavedImageUrl(imageUrl);
      setHasChanges(false);
      await handleUnlock();
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const buttonClass =
    "border rounded-lg py-2 flex items-center justify-center hover:bg-white dark:hover:bg-dark-surface disabled:opacity-40";

  return (
    <div className="card p-6">
      <div className="flex gap-6">
        {/* LEFT */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative">
            <label className="w-full h-[300px] rounded-xl overflow-hidden border-2 border-dashed border-light-border dark:border-dark-border cursor-pointer flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">Click to upload</div>
              )}
              {canEdit && !isLocked && (
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              )}
            </label>
            {isLocked && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 rounded-xl flex items-center justify-center">
                <div className="bg-white dark:bg-dark-background dark:text-white px-5 py-3 rounded-lg shadow-lg">
                  Section is being edited
                </div>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Or paste image URL..."
            value={imageUrl}
            onFocus={handleLock}
            onChange={handleImageUrlChange}
            className="w-full p-3 border rounded-lg dark:bg-dark-background"
          />
        </div>

        {/* RIGHT */}
        {canEdit && !isLocked && (
          <div className="w-52 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Caption"
              value={caption}
              onFocus={handleLock}
              onChange={handleCaptionChange}
              className="p-2 border rounded-lg dark:bg-dark-background"
            />
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-4 py-2.5 mt-4 ${
                hasChanges && !isSaving
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50"
                  : "bg-gray-400 cursor-not-allowed text-gray-600"
              }`}
            >
              <FiSave />
              {isSaving ? "Saving..." : "Save"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onMoveUp} disabled={isFirst} className={buttonClass}>
                <FiArrowUp />
              </button>
              <button onClick={onMoveDown} disabled={isLast} className={buttonClass}>
                <FiArrowDown />
              </button>
            </div>
            <button
              onClick={() => onDelete(section.id)}
              title="Delete Section"
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg text-sm px-4 py-2.5 mt-4"
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