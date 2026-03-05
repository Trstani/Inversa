const ImageSection = ({
  section,
  canEdit,
  onDelete,
  onUpdate,
  onUpload,
}) => {
  return (
    <div className="card p-6">
      <div className="flex gap-6">

        {/* LEFT - IMAGE */}
        <div className="flex-1">
          {section.imageUrl ? (
            <div className="w-full h-[300px] rounded-xl overflow-hidden">
              <img
                src={section.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            canEdit && (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-surface dark:bg-dark-surface">
                
                <div className="flex flex-col items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">
                  <span className="font-medium">Click to upload</span>
                  <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onUpload(section.id, e.target.files[0])
                  }
                  className="hidden"
                />
              </label>
            )
          )}
        </div>

        {/* RIGHT - SIDE PANEL */}
        <div className="w-52 flex flex-col gap-4">

          {/* Caption */}
          <input
            type="text"
            placeholder="Caption (optional)"
            value={section.caption}
            disabled={!canEdit}
            onChange={(e) =>
              onUpdate(section.id, {
                caption: e.target.value,
              })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-dark-surface disabled:opacity-60"
          />

          {/* Delete */}
          {canEdit && (
            <button
              onClick={() => onDelete(section.id)}
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5"
              title="delete section"
            >
              ✕
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ImageSection;