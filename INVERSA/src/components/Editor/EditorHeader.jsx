// components/editor/EditorHeader.jsx
const EditorHeader = ({ project, chapter }) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500">
        {project?.title}
      </p>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {chapter ? "Editing Chapter" : "New Chapter"}
        </h2>

        {chapter && (
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              chapter.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {chapter.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default EditorHeader;

