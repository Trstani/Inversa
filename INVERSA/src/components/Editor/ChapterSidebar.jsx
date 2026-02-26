// components/editor/ChapterSidebar.jsx
import { FiPlus, FiTrash2 } from "react-icons/fi";

const ChapterSidebar = ({
  chapters,
  currentChapter,
  onSelectChapter,
  onCreateChapter,
  onDeleteChapter,
  isInitiator,
}) => {
  return (
    <div className="card p-4 h-fit sticky top-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Chapters ({chapters.length})</h3>

        {isInitiator && (
          <button
            onClick={onCreateChapter}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="New Chapter"
          >
            <FiPlus />
          </button>
        )}
      </div>

      {/* Empty State */}
      {chapters.length === 0 && (
        <p className="text-sm text-gray-500">
          {isInitiator ? "No chapters yet. Create your first one." : "No chapters available."}
        </p>
      )}

      {/* Chapter List */}
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {chapters.map((chapter, index) => {
          const isActive = currentChapter?.id === chapter.id;

          return (
            <li
              key={chapter.id}
              className={`p-3 rounded cursor-pointer transition border ${
                isActive
                  ? "bg-blue-500 text-white border-blue-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
              }`}
              onClick={() => onSelectChapter(chapter)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    Chapter {chapter.chapterNumber || index + 1}
                  </div>

                  <div className="text-xs opacity-70 truncate">
                    {chapter.title || "Untitled"}
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap ${
                    chapter.status === "published"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {chapter.status}
                </span>
              </div>

              {/* Delete Button (Only for initiator and draft) */}
              {isInitiator && chapter.status === "draft" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChapter(chapter.id);
                  }}
                  className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <FiTrash2 size={12} />
                  Delete
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChapterSidebar;
