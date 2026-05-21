const EditorActions = ({
  onBack,
  onSaveDraft,
  onPublish,
  loading,
  isInitiator,
  isTeamMember,
  chapterStatus,
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

  // Team members can also publish
  const canPublish =
    isInitiator ||
    isTeamMember;

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="flex justify-between mt-10">

      {/* BACK BUTTON */}

      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
      >
        Back
      </button>

      {/* ACTION BUTTONS */}

      <div className="flex gap-4">

        {/* =========================
            DRAFT ACTIONS
        ========================= */}

        {isDraft && (
          <>

            {/* SAVE DRAFT */}

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
                : "Save Draft"}
            </button>

            {/* PUBLISH */}

            {canPublish && (
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
                  : "Publish"}
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
            disabled={loading}
            className="
      text-white
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
              : "Save Changes"}
          </button>

        )}

      </div>

    </div>
  );
};

export default EditorActions;