const EditorActions = ({
  onBack,
  onSaveDraft,
  onPublish,
  loading,
  isInitiator,
  isTeamMember,
  chapterStatus,
  hasActiveLocks,
  hasUnsavedWorkspaceChanges,
}) => {

  /*
  =========================
  STATES
  =========================
  */

  const isDraft =
    chapterStatus === "draft";

  const isPublished =
    chapterStatus === "published";

  /*
  =========================
  PERMISSIONS
  =========================
  */

  const canPublish =
    isInitiator ||
    isTeamMember;

  /*
  =========================
  WORKSPACE STATE
  =========================
  */

  const showSaveWorkspace =
    hasUnsavedWorkspaceChanges;

  const showPublish =
    !hasUnsavedWorkspaceChanges &&
    !hasActiveLocks;

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="flex justify-between mt-10">

      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        onClick={onBack}
        className="
          px-4
          py-2
          bg-gray-500
          text-white
          rounded-lg
        "
      >
        Back
      </button>

      {/* =========================
          RIGHT ACTIONS
      ========================= */}

      <div className="flex flex-col items-end gap-4">

        {/* =========================
            DRAFT STATE
        ========================= */}

        {isDraft && (

          <>
            {/* =========================
                WAITING STATE
            ========================= */}

            {hasActiveLocks && (

              <button
                disabled
                className="
                  bg-gray-400
                  text-white
                  cursor-not-allowed
                  rounded-lg
                  text-sm
                  px-4
                  py-2.5
                "
              >
                Waiting for collaborators...
              </button>

            )}

            {/* =========================
                SAVE WORKSPACE
            ========================= */}

            {!hasActiveLocks &&
              showSaveWorkspace && (

                <button
                  onClick={onSaveDraft}
                  disabled={loading}
                  className="
                    text-white
                    bg-gradient-to-r
                    from-blue-500
                    via-blue-600
                    to-blue-700
                    hover:bg-gradient-to-br
                    focus:ring-4
                    focus:outline-none
                    focus:ring-blue-300
                    dark:focus:ring-blue-800
                    shadow-lg
                    shadow-blue-500/50
                    dark:shadow-lg
                    dark:shadow-blue-800/80
                    font-medium
                    rounded-base
                    text-sm
                    px-4
                    py-2.5
                    text-center
                    leading-5
                    rounded-lg
                  "
                >

                  {loading
                    ? "Saving..."
                    : "Save Workspace"}

                </button>

              )}

            {/* =========================
                PUBLISH
            ========================= */}

            {!hasActiveLocks &&
              showPublish &&
              canPublish && (

                <button
                  onClick={onPublish}
                  disabled={loading}
                  className="
                    text-white
                    bg-gradient-to-r
                    from-green-400
                    via-green-500
                    to-green-600
                    hover:bg-gradient-to-br
                    focus:ring-4
                    focus:outline-none
                    focus:ring-green-300
                    dark:focus:ring-green-800
                    shadow-lg
                    shadow-green-500/50
                    dark:shadow-lg
                    dark:shadow-green-800/80
                    font-medium
                    rounded-base
                    text-sm
                    px-4
                    py-2.5
                    text-center
                    leading-5
                    rounded-lg
                  "
                >

                  {loading
                    ? "Publishing..."
                    : "Publish Chapter"}

                </button>

              )}

          </>

        )}

        {/* =========================
            PUBLISHED STATE
        ========================= */}

        {isPublished && (

          <button
            onClick={onSaveDraft}
            disabled={
              loading ||
              hasActiveLocks
            }
            className={`
              text-white
              font-medium
              rounded-lg
              text-sm
              px-4
              py-2.5
              ${
                hasActiveLocks
                  ? "bg-gray-400 cursor-not-allowed"
                  : `
                    bg-gradient-to-r
                    from-amber-400
                    via-amber-500
                    to-amber-600
                    hover:bg-gradient-to-br
                    focus:ring-4
                    focus:outline-none
                    focus:ring-amber-300
                    dark:focus:ring-amber-800
                    shadow-lg
                    shadow-amber-500/50
                    dark:shadow-lg
                    dark:shadow-amber-800/80
                  `
              }
            `}
          >

            {hasActiveLocks
              ? "Waiting for collaborators..."
              : loading
                ? "Saving..."
                : "Save Changes"}

          </button>

        )}

      </div>

    </div>
  );
};

export default EditorActions;