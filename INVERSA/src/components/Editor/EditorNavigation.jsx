// components/editor/EditorNavigation.jsx
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const EditorNavigation = ({
  chapters,
  currentChapter,
  onSelectChapter,
}) => {
  const index = chapters.findIndex(c => c.id === currentChapter?.id);

  const goPrev = () => {
    if (index > 0) onSelectChapter(chapters[index - 1]);
  };

  const goNext = () => {
    if (index < chapters.length - 1)
      onSelectChapter(chapters[index + 1]);
  };

  return (
    <div className="flex justify-between items-center my-6 border p-3 rounded">
      <button
        onClick={goPrev}
        disabled={index <= 0}
        className="disabled:opacity-50"
      >
        <FiChevronLeft />
      </button>

      <span className="text-sm">
        {chapters.length > 0
          ? `Chapter ${index + 1} of ${chapters.length}`
          : "No chapters"}
      </span>

      <button
        onClick={goNext}
        disabled={index >= chapters.length - 1}
        className="disabled:opacity-50"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default EditorNavigation;
